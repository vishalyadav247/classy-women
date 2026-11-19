import { Component } from '@theme/component';
import { prefersReducedMotion } from '@theme/utilities';

/**
 * Collapsible text that is clamped to a number of lines (`--collapsed-lines`)
 * with a "Read more" / "Read less" toggle. The full content always stays in the markup.
 * The toggle is only shown when the content overflows the collapsed height.
 *
 * @typedef {object} Refs
 * @property {HTMLElement} content - The clamped content element (carries `data-collapsed` while collapsed).
 * @property {HTMLButtonElement} toggle - The toggle button (`aria-controls` points at the content).
 *
 * @extends {Component<Refs>}
 *
 * @example
 * ```html
 * <read-more-text style="--collapsed-lines: 4">
 *   <div id="ReadMore-1" ref="content" data-collapsed>…</div>
 *   <button type="button" ref="toggle" aria-expanded="false" aria-controls="ReadMore-1" on:click="/toggle"
 *     data-label-more="Read more" data-label-less="Read less" hidden>Read more</button>
 * </read-more-text>
 * ```
 */
class ReadMoreText extends Component {
  requiredRefs = ['content', 'toggle'];

  /** @type {ResizeObserver | null} */
  #resizeObserver = null;

  connectedCallback() {
    super.connectedCallback();

    this.#resizeObserver = new ResizeObserver(() => this.#measure());
    this.#resizeObserver.observe(this.refs.content);
    this.#measure();

    // Web fonts can change line breaks without changing the clamped box size.
    document.fonts?.ready.then(() => {
      if (this.isConnected) this.#measure();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
  }

  /**
   * Whether the content is currently collapsed.
   * @returns {boolean}
   */
  get #isCollapsed() {
    return this.refs.content.hasAttribute('data-collapsed');
  }

  /**
   * Shows the toggle only when the collapsed content overflows its clamp.
   * While expanded the toggle stays visible so the shopper can collapse again.
   */
  #measure() {
    const { content, toggle } = this.refs;

    if (!this.#isCollapsed) {
      toggle.hidden = false;
      return;
    }

    toggle.hidden = content.scrollHeight <= content.clientHeight + 1;
  }

  /**
   * Expands or collapses the content and updates `aria-expanded` and the label.
   * When collapsing pushes the block above the viewport, it is scrolled back into view
   * (instantly under reduced motion).
   */
  toggle() {
    const { content, toggle } = this.refs;
    const expand = this.#isCollapsed;

    content.toggleAttribute('data-collapsed', !expand);
    toggle.setAttribute('aria-expanded', String(expand));

    const label = expand ? toggle.dataset.labelLess : toggle.dataset.labelMore;
    if (label) toggle.textContent = label;

    if (!expand && this.getBoundingClientRect().top < 0) {
      this.scrollIntoView({ block: 'start', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  }
}

if (!customElements.get('read-more-text')) {
  customElements.define('read-more-text', ReadMoreText);
}
