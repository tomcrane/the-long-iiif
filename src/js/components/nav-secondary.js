import Helpers from '../helpers/helpers';

class NavSecondary {
  /**
   * constructor
   * Initialises the secondary nav functionality
   *
   * @param {object} navElement (optional) The nav container element
   */
  constructor(navElement = null) {
    this.navElement = navElement === null ?
      document.querySelector('.js-nav-secondary') : navElement;

    this.secondaryOpenClass = 'c-nav-secondary--open';
    if (this.navElement !== null) {
      this.activeNavItem = this.navElement.querySelector('.js-nav-secondary__link--active');
      this.createToggle();
    }
  }

  createToggle() {
    this.toggleElement = document.createElement('a');
    this.toggleElement.setAttribute('class', 'c-nav-secondary__toggle');
    this.toggleElement.setAttribute('href', '#');
    this.toggleElementText = 'View More';

    if (this.activeNavItem !== null) {
      this.toggleElementText = this.activeNavItem.textContent;
    }

    const toggleElementText = document.createTextNode(this.toggleElementText);
    this.toggleElement.appendChild(toggleElementText);
    this.navElement.insertBefore(this.toggleElement, this.navElement.firstChild);
    this.toggleElement.addEventListener('click', (e) => {
      e.preventDefault();

      if (this.navElement.className.indexOf(this.secondaryOpenClass) === -1) {
        Helpers.addClass(this.navElement, this.secondaryOpenClass);
      } else {
        Helpers.removeClass(this.navElement, this.secondaryOpenClass);
      }
    });
  }
}

export default NavSecondary;
