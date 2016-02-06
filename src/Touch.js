'use strict';

import Hammer from 'hammerjs';
import setTransform from '@sled/set-transform';

class Touch {
  init(core) {
    this.hammer = new Hammer(core.domModules.slides);
    this.slides = core.modules.slides;
    this.autoSlider = core.modules.autoSlider;

    this.hammer.on('swipe', this.swipe.bind(this));
    this.hammer.on('pan', this.pan.bind(this));
    this.hammer.on('panend', this.end.bind(this));
    this.hammer.on('panstart', this.start.bind(this));
  }

  swipe(e) {
    setTimeout(_ =>
      this.slides.change(e.direction == 2 ? 1 : -1), 50);
  }

  nearSlides() {
    let $slide = this.slides.$.children[this.slides.slide];

    return [$slide.previousElementSibling, $slide, $slide.nextElementSibling];
  }

  pan(e) {
    let $slides = this.nearSlides();
    let delta = e.deltaX;

    $slides[1].style.transform = `translateX(${delta}px)`;

    setTransform($slides[0], `translateX(${ -$slides[1].offsetWidth + delta }px)`);
    setTransform($slides[2], `translateX(${ $slides[1].offsetWidth + delta }px)`);
  }

  start() {
    let $slides = this.nearSlides();

    $slides.forEach($slide =>
      $slide ? $slide.style.transition = '0s' : null);

    if (this.autoSlider)
      this.autoSlider.stop();
  }

  end(e) {
    let $slides = this.nearSlides();

    $slides[1].style.transform = `translateX(0px)`;

    setTransform($slides[0], `translateX(-100%)`);
    setTransform($slides[2], `translateX(100%)`);

    $slides.forEach($slide =>
      $slide ? $slide.style.transition = '1s' : null);

    if (Math.abs(e.deltaX) > ($slides[1].offsetWidth / 2))
      this.slides.change(e.deltaX > 0 ? -1 : 1);

    if (this.autoSlider)
      this.autoSlider.start();
  }
};

export default Touch;
