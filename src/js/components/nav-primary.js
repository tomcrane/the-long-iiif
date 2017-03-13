import Helpers from '../helpers/helpers';

class NavPrimary {
  /**
   * constructor
   * Initialises the nav functionality
   *
   * @param {object} button (optional) The menu button object
   * @param {object} elementToToggle (optional) The element to toggle the nav active class on
   */
  constructor(button = null, elementToToggle = null) {
    this.activeClass = 'nav--active';
    this.html = elementToToggle === null ? document.documentElement : elementToToggle;
    this.menubutton = button === null ? document.querySelector('.js-menu') : button;
    if (this.menubutton !== null) {
      this.menubutton.addEventListener('click', e => this.toggle(e));
    }
  }

  /**
   * Handles the toggling of the nav active class
   *
   * @param {event} e Click event of the menu button
   */
  toggle(e) {
    e.preventDefault();
    if (this.html !== null) {
      if (this.html.className.indexOf(this.activeClass) === -1) {
        this.html.className += ` ${this.activeClass}`;
      } else {
        Helpers.removeClass(this.html, this.activeClass);
      }
    }
  }
}

export default NavPrimary;
