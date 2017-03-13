const Helpers = {
  video: {
    loadYouTubeAPI(onComplete) {
      this.loadAPI();
      window.onYouTubePlayerAPIReady = function () {
        onComplete();
      };
    },

    loadAPI() {
      const tag = document.createElement('script');
      tag.src = '//www.youtube.com/player_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    },
  },

  removeClass(el, cssClass) {
    // Taken and modified from http://youmightnotneedjquery.com/
    const element = el;
    // console.log(`Removing\n${cssClass}`);
    const oldClass = el.className;
    const newClass = oldClass.replace(
      new RegExp(`(^|\\b)${cssClass.split(' ').join('|')}(\\b|$)`, 'gi'), ' ');
    // console.log(`Old class name\n${oldClass}\n\nNew class name\n${newClass}`);
    element.className = newClass;
  },

  addClass(el, className) {
    const element = el;
    element.className += ` ${className}`;
  },

  animationEventListener(element, type, callback) {
    // Taken and modified from https://www.sitepoint.com/css3-animation-javascript-event-handlers/
    const prefixes = ['webkit', 'moz', 'MS', 'o', ''];
    let animationType = type;
    for (let i = 0; i < prefixes.length; i++) {
      if (!prefixes[i]) {
        animationType = animationType.toLowerCase();
      }

      element.addEventListener(prefixes[i] + animationType, callback, false);
    }
  },
};

export default Helpers;
