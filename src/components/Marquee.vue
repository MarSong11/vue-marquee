<template>
  <div
    class="marquee-container"
    @mouseenter="onWrapperMouseEnter"
    @mouseleave="onWrapperMouseLeave"
  >
    <ul ref="wrapper" class="wrapper" @transitionend="onWrapperTransitionEnd">
      <template v-for="(item, index) in marqueeList">
        <li
          ref="slide"
          class="slide"
          :key="index"
          v-html="item"
          @transitionend="onSlideTransitionEnd"
        ></li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    // 内容
    marqueeList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 切换时间(ms)
    speed: {
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
      wrapper: undefined,
      slides: [],
      mqLength: [],
      timer: null,
      index: 1,
      scrollLeftTransform: ""
    };
  },
  watch: {
    marqueeList(val) {
      if (val.length > 0) {
        this.init();
      }
    }
  },
  mounted() {
    if (this.marqueeList.length > 0) {
      this.init();
    }
  },
  methods: {
    init() {
      this.wrapper = this.$refs.wrapper;
      this.slides = this.wrapper.children;
      this.mqLength = this.slides.length;

      this.wrapper.style.transform = "translateY(" + -this.index * 100 + "%)";
      this.wrapper.style.transition = "all " + this.speed + "ms";

      this.initSlide();
      this.autoplay();
    },
    initSlide() {
      var first = this.slides[0].cloneNode(true);
      var last = this.slides[this.slides.length - 1].cloneNode(true);
      this.wrapper.insertBefore(last, this.slides[0]);
      this.wrapper.appendChild(first);
    },
    autoplay() {
      clearInterval(this.timer);

      this.timer = setInterval(() => {
        this.index++;
        this.changeSlide();
      }, this.delay);
    },
    changeSlide() {
      this.wrapper.style.transform = "translateY(" + -this.index * 100 + "%)";
      this.wrapper.style.transition = "all " + this.speed + "ms";

      let slide = this.slides[this.index];
      if (slide.scrollWidth > slide.clientWidth) {
        clearInterval(this.timer);

        this.scrollLeft(slide);
      }
    },
    onWrapperTransitionEnd() {
      if (this.index >= this.mqLength + 1) {
        this.index = 1;
      }

      /* if (this.index <= 0) {
        this.index = this.mqLength;
      } */

      this.wrapper.style.transform = "translateY(" + -this.index * 100 + "%)";
      this.wrapper.style.transition = "";
    },
    scrollLeft() {
      if (this.index == this.mqLength) {
        let slide = this.slides[0];
        slide.style.transform = "translate(-" + slide.scrollWidth + "px, 0px)";
        slide.style.transition = "";
      }

      setTimeout(() => {
        let slide = this.slides[this.index];
        let duration = slide.scrollWidth / this.scrollSpeed;
        slide.style.transform = "translate(-" + slide.scrollWidth + "px, 0px)";
        slide.style.transition = "all " + duration + "s linear";
      }, 500);
    },
    onSlideTransitionEnd() {
      let preIndex = this.index;

      if (this.index == this.mqLength) {
        this.index = 0;
        this.wrapper.style.transform = "translateY(" + -this.index * 100 + "%)";
        this.wrapper.style.transition = "";
      }

      setTimeout(() => {
        this.index++;
        this.changeSlide();

        this.autoplay();
      }, 300);

      setTimeout(() => {
        let slide = this.slides[preIndex];
        slide.style.transform = "translate(0px, 0px)";
        slide.style.transition = "";
      }, 500);
    },
    onWrapperMouseEnter() {
      if (!this.pauseOnHover === true) return false;

      let slide = this.slides[this.index];
      if (slide.scrollWidth > slide.clientWidth) {
        // 记录暂停时滚动的位置
        this.scrollLeftTransform = window.getComputedStyle(slide).transform;
        slide.style.transform = this.scrollLeftTransform;
        slide.style.transition = "all 0s linear";
      }

      clearInterval(this.timer);
    },
    onWrapperMouseLeave() {
      if (!this.pauseOnHover === true) return false;

      let slide = this.slides[this.index];
      if (slide.scrollWidth > slide.clientWidth) {
        let scrollLeftMatrix;
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
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
        slide.style.transform = "translate(-" + slide.scrollWidth + "px, 0px)";
        slide.style.transition = "all " + duration + "s linear";
      } else {
        this.autoplay();
      }
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
