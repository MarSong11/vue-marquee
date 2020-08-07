<template>
  <div
    class="marquee-container"
    @mouseenter="onWrapperMouseEnter"
    @mouseleave="onWrapperMouseLeave"
  >
    <ul
      ref="wrapper"
      class="wrapper"
      @transitionend.stop="onWrapperTransitionEnd"
      :key="tmpKey"
    >
      <template v-for="(item, index) in data">
        <li
          ref="slide"
          class="slide"
          :key="index"
          v-html="item"
          @transitionend.stop="onSlideTransitionEnd"
        ></li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'VueMarquee',
  props: {
    // 内容
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 切换时间(ms)
    duration: {
      type: Number,
      validator(val) {
        return /^\d+$/.test(val);
      },
      default: 300
    },
    // 切换间隔时间(ms)
    delay: {
      type: Number,
      validator(val) {
        return /^\d+$/.test(val);
      },
      default: 2500
    },
    // 滚动速度
    scrollSpeed: {
      type: Number,
      validator(val) {
        return /^\d+$/.test(val);
      },
      default: 60
    },
    // 悬停时暂停
    pauseOnHover: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      wrapper: null,
      slides: [],
      olength: 0,
      timer: 0,
      index: 1,
      scrollLeftTransform: '',

      tmpKey: Date.now()
    };
  },
  watch: {
    data(val) {
      if (val.length > 0) {
        this.init();
      }
    }
  },
  mounted() {
    if (this.data.length > 0) {
      this.init();
    }
  },
  activated() {
    if (this.data.length > 0) {
      this.tmpKey = Date.now();

      this.$nextTick(() => {
        this.init();
      });
    }
  },
  methods: {
    init() {
      this.wrapper = this.$refs.wrapper;
      this.wrapper.style.transitionDuration = '0ms';
      this.wrapper.style.transform = 'translateY(' + -this.index * 100 + '%)';

      this.slides = this.wrapper.children;
      this.olength = this.slides.length;

      this.initSlide();

      this.autoplay();
    },
    initSlide() {
      let first = this.slides[0].cloneNode(true);
      first.addEventListener('transitionend', this.onSlideTransitionEnd);
      let last = this.slides[this.slides.length - 1].cloneNode(true);
      last.addEventListener('transitionend', this.onSlideTransitionEnd);
      this.wrapper.insertBefore(last, this.slides[0]);
      this.wrapper.appendChild(first);
    },
    autoplay() {
      clearInterval(this.timer);

      this.timer = setInterval(() => {
        this.loopFix();

        setTimeout(() => {
          let slide = this.slides[this.index];
          if (slide && slide.scrollWidth > slide.clientWidth) {
            clearInterval(this.timer);
            this.timer = 0;

            this.scrollLeft(slide);
          } else {
            this.slideNext();
          }
        }, 10);
      }, this.delay);
    },
    loopFix() {
      if (this.index == this.slides.length - 1) {
        this.index = 1;
        this.wrapper.style.transitionDuration = '0ms';
        this.wrapper.style.transform = 'translateY(' + -this.index * 100 + '%)';
      }
    },
    slideNext() {
      this.index++;
      this.wrapper.style.transitionDuration = this.duration + 'ms';
      this.wrapper.style.transform = 'translateY(' + -this.index * 100 + '%)';
    },
    onWrapperTransitionEnd() {
      this.wrapper.style.transitionDuration = '0ms';
      this.wrapper.style.transform = 'translateY(' + -this.index * 100 + '%)';
    },
    scrollLeft() {
      if (this.index == this.slides.length - 1) {
        let slide = this.slides[1];
        slide.style.transitionDuration = '0ms';
        slide.style.transform = 'translateX(-' + slide.scrollWidth + 'px)';
      }

      setTimeout(() => {
        let slide = this.slides[this.index];
        let duration = slide.scrollWidth / this.scrollSpeed;
        slide.style.transition = 'all ' + duration + 's linear';
        slide.style.transform = 'translateX(-' + slide.scrollWidth + 'px)';
      }, 500);
    },
    onSlideTransitionEnd() {
      let preIndex = this.index;
      let preSlide = this.slides[preIndex];

      if (this.index == this.slides.length - 1) {
        this.index = 1;
        this.wrapper.style.transitionDuration = '0ms';
        this.wrapper.style.transform = 'translateY(' + -this.index * 100 + '%)';

        setTimeout(() => {
          preSlide.style.transition = '';
          preSlide.style.transform = 'translate(0, 0)';
        }, 300);

        setTimeout(() => {
          this.slideNext();

          this.autoplay();
        }, 100);
      } else {
        setTimeout(() => {
          preSlide.style.transition = '';
          preSlide.style.transform = 'translate(0, 0)';
        }, 300);

        setTimeout(() => {
          this.slideNext();

          this.autoplay();
        }, 100);
      }
    },
    pause() {
      let slide = this.slides[this.index];
      if (slide.scrollWidth > slide.clientWidth) {
        // 记录暂停时滚动的位置
        this.scrollLeftTransform = window.getComputedStyle(slide).transform;
        slide.style.transition = 'all 0s linear';
        slide.style.transform = this.scrollLeftTransform;
      }

      clearInterval(this.timer);
    },
    resume() {
      let slide = this.slides[this.index];
      if (slide.scrollWidth > slide.clientWidth) {
        let scrollLeftMatrix;
        if (!!window.ActiveXObject || 'ActiveXObject' in window) {
          // IE
          scrollLeftMatrix = new window.MSCSSMatrix(this.scrollLeftTransform);
        } else {
          // WebKit
          scrollLeftMatrix = new window.WebKitCSSMatrix(
            this.scrollLeftTransform
          );
        }
        // 去掉已经滚动的长度，再计算时间
        let translateX = slide.scrollWidth + scrollLeftMatrix.m41;
        let duration = translateX / this.scrollSpeed;
        slide.style.transition = 'all ' + duration + 's linear';
        slide.style.transform = 'translate(-' + slide.scrollWidth + 'px, 0px)';
      } else {
        this.autoplay();
      }
    },
    onWrapperMouseEnter() {
      if (!this.pauseOnHover === true) return false;

      this.pause();
    },
    onWrapperMouseLeave() {
      if (!this.pauseOnHover === true) return false;

      this.resume();
    }
  }
};
</script>

<style>
.marquee-container {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 0;
  overflow: hidden;
  list-style: none;
}

.marquee-container .wrapper {
  position: relative;
  z-index: 1;
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  transition-property: transform;
  box-sizing: content-box;
}

.marquee-container .slide {
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  position: relative;
  transition-property: transform;
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  white-space: nowrap;
}
</style>
