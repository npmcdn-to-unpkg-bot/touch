'use strict';

import setTransform from '@sled/set-transform';

class Touch {
  constructor() {
    this.startPosition = null;
  }

  init(core) {
    this.slides = core.modules.slides;

    core.$.addEventListener('mousedown', e => ::this.start(e.clientX));
    core.$.addEventListener('mouseup', e =>
      this.startPosition !== null ? ::this.stop(this.delta(e)) : null);

    core.$.addEventListener('mouseleave', e =>
      this.startPosition !== null ? ::this.stop(this.delta(e)) : null);

    core.$.addEventListener('touchmove', e =>
      this.startPosition !== null ? ::this.move(this.delta(e)) : null);

    core.$.addEventListener('mousemove', e =>
      this.startPosition !== null ? ::this.move(this.delta(e)) : null);
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

  start(position) {
    this.nearSlides()
      .forEach($slide =>
        $slide ? $slide.style.transition = '0s' : null);

    this.startPosition = position;
  }

  stop(delta) {
    const $slides = this.nearSlides();

    $slides[1].style.transform = `translateX(0px)`;

    setTransform($slides[0], `translateX(-100%)`);
    setTransform($slides[2], `translateX(100%)`);

    $slides.forEach($slide =>
      $slide ? $slide.style.transition = null : null);

    if (Math.abs(delta) > ($slides[1].offsetWidth / 2))
      delta > 0 ? this.slides.prev() : this.slides.next();

    this.startPosition = null;
  }
};

export default Touch;
