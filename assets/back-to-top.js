import { Component } from '@theme/component';
import { prefersReducedMotion } from '@theme/utilities';

/**
 * A fixed button that appears after the shopper scrolls one viewport height
 * and scrolls the page back to the top when clicked.
 *
 * @extends {Component}
 */
class BackToTop extends Component {
  /** @type {number | null} */
  #frame = null;

  connectedCallback() {
    super.connectedCallback();

    window.addEventListener('scroll', this.#onScroll, { passive: true });
    this.#update();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener('scroll', this.#onScroll);
    if (this.#frame !== null) {
      cancelAnimationFrame(this.#frame);
      this.#frame = null;
    }
  }

  /**
   * Throttles visibility updates to one per animation frame.
   */
  #onScroll = () => {
    if (this.#frame !== null) return;

    this.#frame = requestAnimationFrame(() => {
      this.#frame = null;
      this.#update();
    });
  };

  /**
   * Shows the button once the page has scrolled past one viewport height.
   * While hidden the button is inert, so it cannot receive focus.
   */
  #update() {
    const visible = window.scrollY > window.innerHeight;

    this.toggleAttribute('data-visible', visible);
    this.inert = !visible;
  }

  /**
   * Scrolls to the top of the page and moves focus there, so the next Tab
   * press reaches the skip link. Scrolls instantly under reduced motion.
   */
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });

    const { body } = document;
    const hadTabindex = body.hasAttribute('tabindex');

    if (!hadTabindex) {
      body.setAttribute('tabindex', '-1');
      body.addEventListener('blur', () => body.removeAttribute('tabindex'), { once: true });
    }

    body.focus({ preventScroll: true });
  }
}

if (!customElements.get('back-to-top-button')) {
  customElements.define('back-to-top-button', BackToTop);
}
