/* eslint-disable no-console */
/* eslint-disable no-undef */
/* This includes functions from https://github.com/karlhorky/gray, customised and converted to ES6 */

class GrayscaleSVGFallback {

  /**
   * constructor
   * Initialises load more functionality
   *
   * @param {el} node - The image that needs a grayscale effect applied
   */

  constructor(parent, el, id) {
    this.parent = parent;

    if (typeof this.parent.filterAdded === 'undefined' || this.parent.filterAdded === false) {
      this.filterSVG = this.addFilterSVG();
    } else {
      this.filterSVG = this.parent.filterSVG;
    }

    this.wrapperClass = 'grayscale-fallback';
    this.wrapperClassFull = `${this.wrapperClass} ${el.className}`;
    this.svgClass = 'grayscale-fallback__svg';
    this.id = id;
    this.el = el;
    this.switchImage();
  }

  addFilterSVG() {
    this.parent.filterAdded = true;
    let filterSVG = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute">
        <defs><filter id="gray"><feColorMatrix type="saturate" values="0"/></filter></defs></svg>`;

    const filterWrapper = document.createElement('div');
    filterWrapper.innerHTML = filterSVG;
    filterSVG = filterWrapper.childNodes[0];
    document.body.appendChild(filterSVG);
    this.parent.filterSVG = filterSVG;
    return filterSVG;
  }

  switchImage() {
    const svgString = this.generateSVGString(this.el, this.id);
    const svgNode = this.generateNode(svgString);
    this.el.parentNode.replaceChild(svgNode, this.el);
  }

  generateNode(string) {
    const parent = document.createElement('div');
    parent.innerHTML = string;
    return parent.querySelector(`.${this.wrapperClass}`);
  }

  generateSVGString(el, id) {
    let title = el.getAttribute('alt');
    if (title.length === 0) {
      title = `Grayscale Image ${id}`;
    }
    const titleEl = `<title id="gray-title-${id}">${title}</title>`;
    const labelledByAttr = ` aria-labelledby="gray-title-${id}"`;
    const imageUrl = el.getAttribute('src');
    const imageStyles = this.getComputedStyles(el);
    const imageWidth = this.convertPxToInt(imageStyles.width);
    const imageHeight = this.convertPxToInt(imageStyles.height);
    const background = `background: transparent url('${imageUrl}') top left/contain no-repeat`;

    const svg = `
    <div class="${this.wrapperClassFull}" style="${background}">
      <svg class="${this.svgClass}" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${imageWidth} ${imageHeight}" role="img"${labelledByAttr} width="${imageWidth}" height="${imageHeight}">
        ${titleEl}
        <image filter="url(&quot;#gray&quot;)" x="0" y="0" preserveAspectRatio="none" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="${imageUrl}" width="${imageWidth}" height="${imageHeight}"/>
      </svg>
    </div>`;

    return svg;
  }

  getComputedStyles(el) {
    const computedStyle = window.getComputedStyle(el, null);
    const styles = {};

    for (let i = 0, length = computedStyle.length; i < length; i++) {
      const prop = computedStyle[i];
      const val = computedStyle.getPropertyValue(prop);
      styles[prop] = val;
    }

    return styles;
  }

  convertPxToInt(pxString) {
    return parseInt(pxString.replace('px', ''), 10);
  }
}

export default GrayscaleSVGFallback;
