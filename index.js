'use strict';

let Hammer = require('hammerjs');

module.exports = class Touch {
  constructor($core) {
    this.hammer = new Hammer($core.domModules.slides);
    this.slides = $core.modules.slides;
    this.autoSlider = $core.modules.autoSlider;

    this.hammer.on('swipe', this.swipe.bind(this));
    this.hammer.on('pan', this.pan.bind(this));
    this.hammer.on('panend', this.end.bind(this));
    this.hammer.on('panstart', this.start.bind(this));
  }

  swipe(e) {
    setTimeout(_ =>
      this.slides.change(e.direction == 2 ? 1 : -1), 50);

    if (this.autoSlider) this.autoSlider.restart(5000);
  }

  pan(e) {
    let $img = this.slides.$slides.children[this.slides.slide];
    let delta = e.deltaX;

    $img.style.transform = `translateX(${delta}px)`;

    $img.previousElementSibling ? $img.previousElementSibling.style.transform = `translateX(${ -$img.offsetWidth + delta }px)` : null;
    $img.nextElementSibling ? $img.nextElementSibling.style.transform = `translateX(${ +$img.offsetWidth + delta }px)` : null;
  }

  start() {
    let $img = this.slides.$slides.children[this.slides.slide];
    let $imgs = [$img.previousElementSibling, $img, $img.nextElementSibling];

    $imgs.forEach($img =>  $img ? $img.style.transition = '0s' : null);
    if (this.autoSlider) this.autoSlider.stop();
  }

  end(e) {
    let $img = this.slides.$slides.children[this.slides.slide];
    let $imgs = [$img.previousElementSibling, $img, $img.nextElementSibling];

    $img.style.transform = `translateX(0px)`;

    $img.previousElementSibling ? $img.previousElementSibling.style.transform = `translateX(-100%)` : null;
    $img.nextElementSibling ? $img.nextElementSibling.style.transform = `translateX(100%)` : null;

    $imgs.forEach($img => {
      $img ? $img.style.transition = '1s' : null;
    });
    if (this.autoSlider) {
      this.autoSlider.work = true;
      this.autoSlider.restart(5000);
    }

    if (Math.abs(e.deltaX) > ($img.offsetWidth / 2)) this.slides.change(e.deltaX > 0 ? -1 : 1);
  }
};
