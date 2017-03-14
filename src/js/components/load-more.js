/* eslint-disable no-console */
/* eslint-disable no-undef */

import Helpers from '../helpers/helpers';
const request = require('superagent');
require('raf/polyfill');
import jump from 'jump.js';

class LoadMore {

  /**
   * constructor
   * Initialises load more functionality
   *
   * @param {container} node - The wrapper el of the initial content and pagination
   * @param {options} object - Pass in object of options
   */

  constructor(container, options = {}) {
    this.container = container;
    this.contentArea = container.querySelector('[data-load-more-content]');
    this.pagination = container.querySelector('[data-load-more-pagination]');
    this.paginationLinks = container.querySelectorAll('[data-load-more-page-link]');
    this.nextPageButton = container.querySelector('[data-load-more-next]');
    this.previousPageButton = container.querySelector('[data-load-more-previous]');
    this.setOptions(options);

    if (this.checkPagination()) {
      this.insertLoadMore();
      this.insertLoader();
      this.loadMoreEnabled = true;
      this.loadMoreButton.addEventListener('click', e => this.loadMore(e));
      this.setNumberOfItems();
      this.log(`Page ${this.activePage} active`);
    } else {
      this.log('On last page, load more not needed');
    }
  }

  /**
   * Set default options and merge with passed in options
   *
   * @param {options} object - Pass in options from constructor to override defaults
   */

  setOptions(options) {
    const defaults = {
      debug: false,
      loadMoreActiveClass: 'c-load-more-area--load-more-active',
      loadMoreCompleteClass: 'c-load-more-area--load-more-complete',
      loadMoreClass: 'c-pagination__link c-pagination__load-more btn btn--load-more',
      loaderClass: 'c-load-more-area__loader',
      loadingClass: 'c-load-more-area--loading',
      activePageClass: 'btn--active',
      json: true,
      route: false,
      resultSelector: false,
      numberOfPages: false,
      activePage: false,
      renderFunction: false,
      renderDelay: 2000,
    };

    this.options = Object.assign({}, defaults, options);
    this.setAjaxOptions();
    this.setResultSelectorOption();
  }

  /**
   * Set AJAX type, based on values in options and api data attribute
   *
   */

  setAjaxOptions() {
    if (this.options.json && this.options.route === false) {
      this.options.route = this.container.getAttribute('data-api-route');
      if (this.options.route === null || this.options.route.length === 0) {
        this.log('JSON option selected, but no route passed in, falling back to HTML');
        this.options.json = false;
      } else if (this.options.renderFunction === false) {
        this.log('JSON option selected, but no render function passed in, falling back to HTML');
        this.options.json = false;
      }
    }
  }

  /**
   * Get result selector from data attribute, and set in options
   *
   */

  setResultSelectorOption() {
    if (this.options.resultSelector === false) {
      const resultSelector = this.container.getAttribute('data-results-selector');
      if (resultSelector !== null && resultSelector.length > 0) {
        this.options.resultSelector = resultSelector;
      }
    }
  }

  /**
   * Work out active page and number of pages, and call last page check
   *
   */

  checkPagination() {
    if (this.options.numberOfPages === false) {
      this.numberOfPages = this.paginationLinks.length;
    } else {
      this.numberOfPages = this.options.numberOfPages;
    }

    if (this.options.activePage === false) {
      for (let i = 0; i < this.paginationLinks.length; i++) {
        if (this.paginationLinks[i].hasAttribute('data-load-more-active-page')) {
          this.activePage = i + 1;
        }
      }
    } else {
      this.activePage = this.options.activePage;
    }

    return this.checkNotLast();
  }

  /**
   * Check if on last page
   *
   */

  checkNotLast() {
    let notLastPage;

    if (this.activePage !== this.numberOfPages) {
      notLastPage = true;
      this.container.className += ` ${this.options.loadMoreActiveClass}`;
    } else {
      notLastPage = false;
      this.container.className += ` ${this.options.loadMoreCompleteClass}`;
      Helpers.removeClass(this.container, this.options.loadMoreActiveClass);

      if (this.nextPageButton !== null) {
        this.nextPageButton.style.display = 'none';
      }
    }

    return notLastPage;
  }

  /**
   * Create and insert load more button
   *
   */

  insertLoadMore() {
    const content = document.createTextNode('Load more');
    this.loadMoreButton = document.createElement('button');
    this.loadMoreButton.className = this.options.loadMoreClass;
    this.loadMoreButton.appendChild(content);
    this.pagination.appendChild(this.loadMoreButton);
  }

  /**
   * Create and insert loader
   *
   */

  insertLoader() {
    const content = document.createTextNode('Loading');
    this.loader = document.createElement('span');
    this.loader.className = this.options.loaderClass;
    this.loader.appendChild(content);
    this.pagination.appendChild(this.loader);
  }

  /**
   * Handle click of load more button -  Add CSS class, disable button, call ajax function
   *
   * @param {event} e Click event of the load more button
   */

  loadMore(e) {
    e.preventDefault();
    if (this.loadMoreEnabled) {
      this.container.className += ` ${this.options.loadingClass}`;
      this.disableLoadMore();
      this.ajaxRequest();
    } else {
      this.log('Load more running');
    }
  }

  /**
   * AJAX request, with response handling
   *
   */

  ajaxRequest() {
    const requestPage = this.activePage + 1;
    const requestUrl = this.getRequestUrl(requestPage);
    this.log(`Starting ajax request for page ${requestPage}`);
    if (requestUrl) {
      request
        .get(requestUrl)
        .query(this.getRequestData(requestPage))
        .set('Accept', this.getResponseType())
        .end((err, res) => {
          if (this.options.debug) {
            setTimeout(() => {
              this.ajaxComplete(res, err);
            }, this.options.renderDelay);
          } else {
            this.ajaxComplete(res, err);
          }
        });
    }
  }

  /**
   * Handle ajax complete
   *
   * @param {res} object - Response object from AJAX call
   * @param {err} object - Error object from AJAX call
   */

  ajaxComplete(res, err) {
    this.log(`Ajax request to ${res.req.url} complete.\nResponse is ${res.type}`);
    if (err === null) {
      if (this.options.json) {
        this.renderJSONResults(res.text);
      } else {
        this.renderHTMLResults(res.text);
      }
    } else {
      this.loadErrored(err);
    }
  }

  /**
   * Get request URL, handling html or json call
   *
   * @param {requestPage} int - Page requested
   */

  getRequestUrl(requestPage) {
    let requestUrl = false;

    if (this.options.json) {
      requestUrl = this.options.route;
    } else {
      const pageLink = this.paginationLinks[requestPage - 1];
      if (typeof pageLink !== 'undefined') {
        requestUrl = pageLink.href;
      } else {
        this.loadErrored('No pagination link found for requested page');
      }
    }

    return requestUrl;
  }

  /**
   * Get request params, if call is JSON
   *
   * @param {requestPage} int - Page requested
   */

  getRequestData(requestPage) {
    let requestData = false;
    if (this.options.json) {
      requestData = {
        page: requestPage,
      };
    }
    return requestData;
  }

  /**
   * Get expected response type depending on if call will be JSON or HTML
   *
   */

  getResponseType() {
    let requestType = 'application/json';

    if (this.options.json === false) {
      requestType = 'text/html';
    }
    return requestType;
  }

  /**
   * Convert response to JSON, call external render function,
  create nodelist from results, then pass to insert function
   *
   * @param {text} string - String returned by AJAX request
   */

  renderJSONResults(text) {
    this.log('Render JSON result');
    const json = JSON.parse(text);
    let renderedResults = this.options.renderFunction(json);

    if (renderedResults !== false && renderedResults.length > 0) {
      const resultWrapper = document.createElement('div');
      resultWrapper.innerHTML = renderedResults;
      renderedResults = resultWrapper.childNodes;
      this.insertResults(renderedResults);
    }
  }

  /**
   * Convert response to HTML, search for results via selector, then pass to insert function
   *
   * @param {text} string - String returned by AJAX request
   */

  renderHTMLResults(text) {
    if (this.options.resultSelector) {
      this.log('Render HTML result');
      const html = document.createElement('html');
      html.innerHTML = text;
      const results = html.querySelectorAll(this.options.resultSelector);
      if (results.length > 0) {
        this.insertResults(results);
      } else {
        this.loadErrored(`No results found with using ${this.options.resultSelector}`);
      }
    } else {
      this.loadErrored('HTML Result selector not passed into options or via data tag');
    }
  }

  /**
   * Convert passed in nodes into fragments and append to content area
   *
   * @param {results} nodelist - Set of rendered HTML nodes ready to insert
   */

  insertResults(results) {
    const resultFragments = document.createDocumentFragment();

    for (let i = 0; i < results.length; i++) {
      resultFragments.appendChild(results[i]);
    }

    this.beforeInsert();
    this.contentArea.appendChild(resultFragments);
    this.afterInsert();
    this.log(`Page ${this.activePage} active`);
  }

  /**
   * Remove loading class, update pagination to new page, and enable load more if not last page
   *
   */

  beforeInsert() {
    Helpers.removeClass(this.container, this.options.loadingClass);
    this.updatePagination(this.activePage, this.activePage + 1);
    this.activePage++;

    if (this.checkNotLast()) {
      this.enableLoadMore();
    } else {
      this.log('Last page loaded, show pagination again');
    }
  }

  /**
   * Update active page link and hide next if on last
   *
   * @param {oldPage} int - Old page
   * @param {newPage} int - New page
   */

  updatePagination(oldPage, newPage) {
    if (this.paginationLinks.length > 0) {
      if (typeof this.paginationLinks[oldPage - 1] !== 'undefined') {
        const oldPageEl = this.paginationLinks[oldPage - 1];
        Helpers.removeClass(oldPageEl, this.options.activePageClass);
      }

      if (typeof this.paginationLinks[newPage - 1] !== 'undefined') {
        const newPageEl = this.paginationLinks[newPage - 1];
        newPageEl.className += ` ${this.options.activePageClass}`;
      }

      if (newPage === this.paginationLinks.length && this.nextPageButton !== null) {
        this.nextPageButton.style.display = 'none';
      }
    }
  }

  /**
   * Disable load more button
   *
   */

  disableLoadMore() {
    this.loadMoreEnabled = false;
    this.loadMoreButton.setAttribute('disabled', 'disabled');
  }

  /**
   * Enable load more button
   *
   */

  enableLoadMore() {
    this.loadMoreEnabled = true;
    this.loadMoreButton.removeAttribute('disabled');
  }

  afterInsert() {
    this.scrollToLoadedContent();
  }

  scrollToLoadedContent() {
    jump(this.getFirstNewItem());
  }

  /**
   * Set number of items
   *
   * @param {items} nodeList - Pass in item nodeList, to avoid reselecting unless needed
   */

  setNumberOfItems(items = false) {
    let allItems = items;

    if (allItems === false) {
      allItems = this.getAllItems();
    }

    this.numberOfItems = allItems.length - 1;
  }

  /**
   * Get all Items
   *
   */

  getAllItems() {
    return this.contentArea.querySelectorAll(this.options.resultSelector);
  }

  /**
   * Get first new item loadedin and set number of items;
   *
   */

  getFirstNewItem() {
    const allItems = this.getAllItems();
    const firstNewItem = allItems[this.numberOfItems + 1];
    this.setNumberOfItems(allItems);
    return firstNewItem;
  }


  /**
   * Output message when log fails, and show standard pagination
   *
   * @param {err} string - Error message
   */

  loadErrored(err) {
    this.log(`Load failed:\n${err}`);
    Helpers.removeClass(this.container, this.options.loadingClass);
    Helpers.removeClass(this.container, this.options.loadMoreActiveClass);
  }

  /**
   * Output message if debug enabled
   *
   * @param {message} string - Message
   */

  log(message) {
    if (this.options.debug) {
      console.log(message);
    }
  }
}

export default LoadMore;
