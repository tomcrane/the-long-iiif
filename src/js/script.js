/* eslint-disable no-new */
/* eslint-disable no-console */
/* eslint-disable no-undef */

import Helpers from './helpers/helpers';
import NavPrimary from './components/nav-primary';
import NavSecondary from './components/nav-secondary';
import VideoPlayer from './components/video-player';
import LoadMore from './components/load-more';
import GrayscaleSVGFallback from './components/grayscale-svg-fallback';
import Animations from './components/animations.js';

const DigiratiWebsite = {
  init() {
    this.debug = false;
    new NavPrimary();
    new NavSecondary();
    this.setupVideoComponents();
    this.setupLoadMore();
    this.setupGrayscaleFallback();
    Animations.init(this.debug);
  },

  setupVideoComponents() {
    this.videoComponents = document.querySelectorAll('.js-video-player');

    if (this.videoComponents.length > 0) {
      Helpers.video.loadYouTubeAPI(() => {
        for (let i = 0; i < this.videoComponents.length; i++) {
          const el = this.videoComponents[i];
          new VideoPlayer(el, i);
        }
      });
    }
  },

  setupLoadMore() {
    this.loadMoreAreas = document.querySelectorAll('.js-load-more');

    if (this.loadMoreAreas.length > 0) {
      for (let i = 0; i < this.loadMoreAreas.length; i++) {
        const el = this.loadMoreAreas[i];
        let renderFunction = false;
        let resultSelector = false;

        if (el.className.indexOf('js-updates-load-more') !== -1) {
          renderFunction = this.renderUpdateJSON;
          resultSelector = '.c-updates__item';
        }

        new LoadMore(el, {
          debug: this.debug,
          resultSelector,
          renderFunction,
        });
      }
    }
  },

  renderUpdateJSON(json) {
    let resultString = '';

    for (let i = 0; i < json.items.length; i++) {
      const item = json.items[i];
      const tag = (typeof item.tag !== 'undefined' && item.tag && item.tag.length > 0) ?
      `<p class="c-updates__tag">${item.tag}</p>` : '';

      const result = `<li class="c-updates__item">
            ${tag}
            <a class="c-updates__link" href="${item.link}">${item.title}</a>
          </li>`;
      resultString += result;
    }

    return resultString;
  },

  setupGrayscaleFallback(root = document) {
    const grayscaleElSelectorClass = '.c-content-media__image, .c-video__placeholder';
    if ((!Modernizr.cssfilters && Modernizr.inlinesvg && Modernizr.svgfilters) || this.debug) {
      const applyGrayscaleTo = root.querySelectorAll(grayscaleElSelectorClass);
      for (let i = 0; i < applyGrayscaleTo.length; i++) {
        const element = applyGrayscaleTo[i];
        new GrayscaleSVGFallback(this, element, i + 1);
      }
    }
  },
};

document.addEventListener('DOMContentLoaded', () => {
  DigiratiWebsite.init();
});

// static site 
// $('.parallax').scrolly();
$('.parallax').scrolly({bgParallax: true});

