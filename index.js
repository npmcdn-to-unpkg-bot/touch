import Hammer from 'hammerjs';

export default class Touch {
  constructor($core) {
    this.hammer = new Hammer($core.domModules.slides);
    this.slides = $core.modules.slides;
    this.autoSlider = $core.modules.autoSlider;
    this.hammer.on('panstart', _=> {
      let $img = this.slides.$slides.children[this.slides.slide];
      let $imgs = [$img.previousElementSibling, $img, $img.nextElementSibling];

      $imgs.forEach($img =>  $img ? $img.style.transition = '0s' : null);
      if (this.autoSlider) this.autoSlider.stop();
    });
    this.hammer.on('panend', _=> {
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

      if (Math.abs(_.deltaX) > ($img.offsetWidth / 2)) this.slides.change(_.deltaX > 0 ? -1 : 1);
    });

    this.hammer.on('pan', e => {
      let $img = this.slides.$slides.children[this.slides.slide];
      let delta = e.deltaX;

      $img.style.transform = `translateX(${delta}px)`;

      $img.previousElementSibling ? $img.previousElementSibling.style.transform = `translateX(${ -$img.offsetWidth + delta }px)` : null;
      $img.nextElementSibling ? $img.nextElementSibling.style.transform = `translateX(${ +$img.offsetWidth + delta }px)` : null;
    });

    this.hammer.on('swipe', e => {
      setTimeout(_=> {
        if (e.direction == 2) this.slides.change(1);
        else this.slides.change(-1);
      }, 50);
      if (this.autoSlider) this.autoSlider.restart(5000);
    });

  }
}
