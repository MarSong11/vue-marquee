# vue-marquee

> A Vue component to marquee，horizontally scrolling when the text is too long
>
> 滚动组件，支持文本过长时横向滚动

## Screenshot

![Screenshot](https://github.com/MarSong11/vue-marquee/raw/master/screenshot/GIF.gif)

## Install

```bash
npm install @marsong11/vue-marquee

# or
yarn add @marsong11/vue-marquee
```

## Usage

```html
<template>
  <div class="container">
    <marquee :data="list" />
  </div>
</template>

<script>
  import Marquee from '@marsong11/vue-marquee';

  export default {
    components: {
      Marquee
    },
    ,
    data() {
      return {
        list: [
          'data1 some text.',
          'data2 balabalabalabala.',
          'data3 long long long long long long long long long long long text.',
          'data4 hahaha.'
        ]
      };
    }
  };
</script>
```

## Options

| Name           | Type      | Default | Description                                  |
| -------------- | --------- | ------- | -------------------------------------------- |
| `data`         | `Array`   | `[]`    | content                                      |
| `duration`     | `Number`  | `300`   | duration of transition between items (in ms) |
| `delay`        | `Number`  | `2500`  | delay between transitions (in ms).           |
| `scrollSpeed`  | `Number`  | `60`    | the speed of the scrolling (keep number low) |
| `pauseOnHover` | `Boolean` | `false` | pause on hover                               |
