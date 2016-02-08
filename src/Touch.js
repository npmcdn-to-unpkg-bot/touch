'use strict';

import { Observable } from 'rx';
const fromEvent = Observable.fromEvent;
import setTransform from '@sled/set-transform';

class Touch {
  constructor() {
    this.startPosition = null;
  }

  init(core) {
    this.slides = core.modules.slides;

    fromEvent(core.$, 'mousedown')
      .pluck('clientX')
      .subscribe(::this.start);

    fromEvent(core.$, 'mouseup')
      .merge(fromEvent(core.$, 'mouseleave'))
      .filter(_ => this.startPosition !== null)
      .map(::this.delta)
      .subscribe(::this.stop);

    fromEvent(core.$, 'touchmove')
      .merge(fromEvent(core.$, 'mousemove'))
      .filter(_ => this.startPosition !== null)
      .map(::this.delta)
      .subscribe(::this.move);
  }

  delta(e) {
    return e.clientX - this.startPosition;
  }

  nearSlides() {
    const $slide = this.slides.$.children[this.slides.slide];

    return [$slide.previousElementSibling, $slide, $slide.nextElementSibling];
  }

  move(delta) {
    const $slides = this.nearSlides();

    $slides[1].style.transform = `translateX(${delta}px)`;

    setTransform($slides[0], `translateX(${ -$slides[1].offsetWidth + delta }px)`);
    setTransform($slides[2], `translateX(${ $slides[1].offsetWidth + delta }px)`);
  }

  start(delta) {
    this.nearSlides()
      .forEach($slide =>
        $slide ? $slide.style.transition = '0s' : null);

    this.startPosition = delta;
  }

  stop(delta) {
    const $slides = this.nearSlides();

    $slides[1].style.transform = `translateX(0px)`;

    setTransform($slides[0], `translateX(-100%)`);
    setTransform($slides[2], `translateX(100%)`);

    $slides.forEach($slide =>
      $slide ? $slide.style.transition = '1s' : null);

    if (Math.abs(delta) > ($slides[1].offsetWidth / 2))
      this.slides.move(delta > 0 ? -1 : 1);

    this.startPosition = null;
  }
};

export default Touch;
