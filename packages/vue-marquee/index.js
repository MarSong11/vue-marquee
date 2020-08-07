import VueMarquee from './src/VueMarquee.vue';

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(VueMarquee.name, VueMarquee);
}

export default VueMarquee;
