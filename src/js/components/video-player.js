/* eslint-disable no-console */
/* eslint-disable no-undef */

class VideoPlayer {
  /**
   * constructor
   * Initialises the video player functionality
   *
   * @param {object} videoPlayerEl The video player element
   */
  constructor(videoPlayerEl, key) {
    const thisObject = this;
    this.container = videoPlayerEl;
    this.videoPlay = this.container.querySelector('.js-video-play');
    this.videoPlaceholder = this.container.querySelector('.js-video-placeholder');
    this.video = this.container.querySelector('.js-video');
    this.video.id = `video-${key}`;
    this.videoPlayer = new YT.Player(this.video.id, {
      events: {
        onReady() {
          thisObject.onPlayerReady();
        },
      },
    });
  }

  /**
   * When player is ready to run
   */
  onPlayerReady() {
    this.videoPlay.addEventListener('click', e => this.playVideo(e));
  }

  /**
   * Handles the video play button click
   *
   * @param {event} e Click event of the video play button
   */
  playVideo(e) {
    e.preventDefault();
    this.container.className += ' c-video--playing';
    this.videoPlayer.playVideo();
  }
}

export default VideoPlayer;
