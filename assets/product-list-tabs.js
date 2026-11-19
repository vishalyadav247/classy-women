import { Component } from '@theme/component';
import { prefersReducedMotion } from '@theme/utilities';

/**
 * A slideshow element exposing the `select` method of `assets/slideshow.js`.
 *
 * @typedef {HTMLElement & {
 *   select: (input: number, event?: Event, options?: { animate?: boolean }) => Promise<void> | void
 * }} SelectableSlideshow
 */

/**
 * @typedef {object} ProductListTabsRefs
 * @property {HTMLElement[]} panels - The tab panels, one per non-empty tab, in tab order.
 * @property {HTMLButtonElement[]} [tabs] - The tab buttons (absent when only one tab is rendered).
 * @property {HTMLElement} [tablist] - The tab row.
 * @property {HTMLElement} [shopAll] - Wrapper of the "shop all" button that follows the active tab.
 */

/**
 * Tabbed product list. Panels are rendered on the server (see `sections/product-list.liquid`),
 * so switching tabs only toggles visibility, resets the panel's carousel to the first slide and
 * points the "shop all" button at the active tab's collection.
 *
 * Keyboard support follows the WAI-ARIA tabs pattern with automatic activation:
 * ArrowLeft/ArrowRight move to the previous/next tab (wrapping), Home/End to the first/last tab.
 *
 * @extends {Component<ProductListTabsRefs>}
 */
class ProductListTabs extends Component {
  requiredRefs = ['panels'];

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('shopify:block:select', this.#handleBlockSelect);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('shopify:block:select', this.#handleBlockSelect);
  }

  /**
   * Activates the clicked tab.
   *
   * @param {Event} event - The click event.
   */
  selectTab(event) {
    const index = this.#indexOfTab(event.target);

    if (index === -1) return;

    this.#activate(index, { focus: false });
  }

  /**
   * Moves between tabs with the arrow keys, Home and End.
   *
   * @param {KeyboardEvent} event - The keydown event.
   */
  onTabKeydown(event) {
    const tabs = this.refs.tabs ?? [];
    const current = this.#indexOfTab(event.target);

    if (current === -1 || tabs.length === 0) return;

    const isRtl = getComputedStyle(this).direction === 'rtl';
    const forwardKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const backwardKey = isRtl ? 'ArrowRight' : 'ArrowLeft';

    /** @type {number | null} */
    let next = null;

    switch (event.key) {
      case forwardKey:
        next = (current + 1) % tabs.length;
        break;
      case backwardKey:
        next = (current - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = tabs.length - 1;
        break;
    }

    if (next === null) return;

    event.preventDefault();
    this.#activate(next, { focus: true });
  }

  /**
   * Activates the tab whose block was selected in the theme editor.
   *
   * @param {Event} event - The `shopify:block:select` event.
   */
  #handleBlockSelect = (event) => {
    const tabs = this.refs.tabs ?? [];
    const target = event.target;

    if (!(target instanceof Element)) return;

    const index = tabs.findIndex((tab) => tab === target || tab.contains(target));

    if (index === -1) return;

    this.#activate(index, { focus: false });
  };

  /**
   * Returns the index of the tab that contains the given event target, or -1.
   *
   * @param {EventTarget | null} target - The event target.
   * @returns {number}
   */
  #indexOfTab(target) {
    if (!(target instanceof Element)) return -1;

    const tab = target.closest('[role="tab"]');

    if (!tab) return -1;

    return (this.refs.tabs ?? []).findIndex((element) => element === tab);
  }

  /**
   * Selects a tab, shows its panel and hides the others.
   *
   * @param {number} index - The index of the tab to activate.
   * @param {{ focus: boolean }} options - Whether to move focus to the tab.
   */
  #activate(index, { focus }) {
    const tabs = this.refs.tabs ?? [];
    const { panels } = this.refs;
    const tab = tabs[index];
    const panel = panels[index];

    if (!tab || !panel) return;

    const wasActive = tab.getAttribute('aria-selected') === 'true';

    tabs.forEach((element, i) => {
      const selected = i === index;

      element.setAttribute('aria-selected', String(selected));
      element.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((element, i) => {
      element.hidden = i !== index;
    });

    if (focus) tab.focus({ preventScroll: true });

    tab.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: prefersReducedMotion() ? 'instant' : 'smooth',
    });

    this.#updateShopAllLink(tab);

    if (wasActive) return;

    const slideshow = /** @type {SelectableSlideshow | null} */ (panel.querySelector('slideshow-component'));

    if (slideshow && typeof slideshow.select === 'function') {
      // The panel was hidden, so wait for layout before resetting the carousel to the first slide.
      requestAnimationFrame(() => {
        slideshow.select(0, undefined, { animate: false });
      });
    }
  }

  /**
   * Points the "shop all" link at the active tab's collection.
   *
   * @param {HTMLElement} tab - The active tab.
   */
  #updateShopAllLink(tab) {
    const url = tab.dataset.collectionUrl;
    const link = this.refs.shopAll?.querySelector('a');

    if (!url || !link) return;

    link.href = url;
    link.removeAttribute('role');
    link.removeAttribute('aria-disabled');
  }
}

if (!customElements.get('product-list-tabs')) {
  customElements.define('product-list-tabs', ProductListTabs);
}
