/* eslint-disable no-new */
/* eslint-disable no-console */
/* eslint-disable no-undef */

import Helpers from '../helpers/helpers';
require('waypoints/lib/noframework.waypoints.js');
// https://github.com/kaimallea/isMobile
const isMobile = require('ismobilejs');

export default {
  init(debug) {
    if (Modernizr.cssanimations) {
      this.debug = debug;
      this.isMobile = isMobile.any;
      this.setupAnimationCompleteTracking();

      if (this.isMobile === false) {
        Helpers.addClass(document.documentElement, 'waypoint-animations-enabled');
        this.setupWaypointAnimations();
      }
    }
  },

  setupAnimationCompleteTracking() {
    const animations = [
      {
        name: 'hero',
        selector: '.c-hero',
        childSelectors: [
          '.c-hero__header',
          '.c-quote--hero',
          '.c-hero__image-wrapper',
        ],
        completeClass: 'hero-animation-complete',
        progressClass: 'hero-animation-in-progress',
      },
      {
        name: 'initial-updates',
        selector: '.c-updates',
        childSelectors: [
          '.c-updates__item',
        ],
        completeClass: 'updates-animation-complete',
        progressClass: 'updates-animation-in-progress',
      },
    ];

    for (let i = 0; i < animations.length; i++) {
      const element = document.querySelector(animations[i].selector);
      if (element !== null) {
        const animationTotal = this.getNumberOfAnimationEvents(element,
          animations[i].childSelectors);
        if (animationTotal > 0) {
          this.setupAnimationCompleteEvent(
            element,
            animationTotal,
            animations[i].progressClass,
            animations[i].completeClass)
          ;
        }
      }
    }
  },

  setupAnimationCompleteEvent(element, total, progressClass, completeClass) {
    let animationCount = 0;

    Helpers.animationEventListener(element, 'AnimationEnd', () => {
      if (animationCount === 0) {
        Helpers.addClass(document.documentElement, progressClass);
      }

      animationCount++;

      if (animationCount === total) {
        if (this.debug) {
          console.log(`Animation complete, added ${completeClass}`);
        }

        Helpers.addClass(document.documentElement, completeClass);
        Helpers.removeClass(document.documentElement, progressClass);
      }
    });
  },

  getNumberOfAnimationEvents(root, childSelectors) {
    let animationCount = 0;

    for (let i = 0; i < childSelectors.length; i++) {
      const elements = root.querySelectorAll(childSelectors[i]);
      if (elements.length > 0) {
        animationCount += elements.length;
      }
    }
    return animationCount;
  },

  setupWaypointAnimations() {
    const waypointAnimations = [
      {
        selector: '.c-aggregator',
        animationClass: 'c-aggregator--animate-in',
        offset: '75%',
      },
      {
        selector: '.c-updates--animate',
        animationClass: 'c-updates--animate-in',
        offset: '90%',
      },
    ];

    for (let i = 0; i < waypointAnimations.length; i++) {
      this.addWaypointAnimation(waypointAnimations[i]);
    }
  },

  addWaypointAnimation(options) {
    const { animationClass, selector, offset } = options;
    const element = document.querySelector(selector);
    const thisObject = this;

    if (element !== null) {
      new Waypoint({
        element,
        offset,
        handler(direction) {
          thisObject.waypointAnimationHandler(direction, animationClass, element);
        },
      });
    }
  },

  waypointAnimationHandler(direction, animationClass, element) {
    if (direction === 'down') {
      if (this.debug) {
        console.log('Waypoint triggered');
      }

      Helpers.addClass(element, animationClass);
    }
  },
};
