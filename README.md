# vue-marquee

> A Vue component to marquee，horizontally scrolling when the text is too long
>
> 滚动组件，支持文本过长时横向滚动

## Screenshot

![Screenshot](https://github.com/MarSong11/vue-marquee/raw/master/screenshot/GIF.gif)

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

```

## Usage

```javascript
import Marquee from './components/Marquee';
export default {
  data() {
    return {
      list: [
        'data1 some text..',
        'data2 balabalabalabala..',
        'data3 long long long long long long long long long long long text'
      ]
    };
  },
  components: {
    Marquee
  }
};
```

```html
<marquee :marqueeList="list" />
```

## Options

| Name           | Type      | Default | Description                                                                |
| -------------- | --------- | ------- | -------------------------------------------------------------------------- |
| `marqueeList`  | `Array`   | `[]`    | content                                                                    |
| `speed`    | `Number`  | `300`    | duration of transition between items (in ms) |
| `delay`    | `Number`  | `2500`  | delay between transitions (in ms).              |
| `scrollSpeed`  | `Number`  | `60`    | the speed of the scrolling (keep number low)                               |
| `pauseOnHover` | `Boolean` | `false` | pause on hover                                                             |
