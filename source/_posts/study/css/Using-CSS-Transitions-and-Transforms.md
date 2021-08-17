---
title: Using CSS Transitions and Transforms
date: "2021-08-15T15:07:57.746Z"
tags:
  - CSS
categories:
  - study
  - css
---

CSS 过渡属性提供了一种方式给 CSS 属性变化添加过渡动画，过程中属性值的变化是由浏览器所决定，所以其过程也被叫做`隐式过渡（implicit transitions）`。也因其由浏览器原生实现，所以通常有更好的性能，但是在灵活性上有其局限。

使用场景上，单纯的鼠标悬浮、选中和失去焦点等情况的过渡动画中 CSS 过渡属性是首选；但是当涉及到时间轴动画、稍复杂的补间动画时，应该选择 GSAP 之类的成熟的 JavaScript 动画库才合适。

> 这里有一个[可以使用过渡效果的属性列表](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties)，对于可添加过渡效果的属性有 2 点需要注意：
>
> 1. 可以使用过渡效果的属性列表会发生变化，因为 transitions 的规格还没有定版；
> 2. 对于变化前，或变化后的属性为 `auto` 的情况，规格建议不做过渡效果，但是每个浏览器对其采取不同处理，所以为了保证效果一致性，我们应该避免对 `auto` 添加过渡效果。

<!-- more -->

## 过渡 transitions

### 定义过渡属性

CSS 过渡属性可以轻易实现很出效果的动画。

> 避免产生不适，点击 `start` 开始演示动画。

<div class="example-container" style="height: 150px">
  <div class="example-def transition radius-hover" style="height: 50px; width: 50px; background-color: rgb(25,135,84)"></div>
  <span class="toggle position-absolute top-0 end-0 m-3 hover-pointer">start</span>
</div>

```css
.transition {
  transition: all 0.25s ease;
}
```

#### `transition`

简写属性，定义过渡效果最常用的属性。

```css
div {
  transition: <property> <duration> <timing-function> <delay>;
}
```

#### `transition-property`

指定应用过渡效果的属性。

| Value        | Description                                    |
| ------------ | ---------------------------------------------- |
| `none`       | 没有属性会添加过渡动画                         |
| `all`        | 默认值，所有支持的属性会添加过渡动画           |
| `<property>` | 如果属性支持过渡动画，指定的属性会添加过渡动画 |

#### `transition-duration`

指定过度效果的持续时间。

| Value                | Description         |
| -------------------- | ------------------- |
| 有效单位为 `ms`，`s` | 时间值，默认为 `0s` |

#### `transition-timing-function`

指定过度效果的缓动函数，一个描述数值变动速率的数学函数，视觉表现为我们熟知的贝塞尔曲线。

![timing-function](/images/study/css/TimingFunction.png)

| Value                          | Description                                                 |
| ------------------------------ | ----------------------------------------------------------- |
| `ease`                         | 默认值，相当于 `cubic-bezier(0.25, 0.1, 0.25, 1.0)`         |
| `linear`                       | 相当于 `cubic-bezier(0.0, 0.0, 1.0, 1.0)`                   |
| `ease-in`                      | 相当于 `cubic-bezier(0.42, 0, 1.0, 1.0)`                    |
| `ease-out`                     | 相当于 `cubic-bezier(0, 0, 0.58, 1.0)`                      |
| `ease-in-out`                  | 相当于 `cubic-bezier(0.42, 0, 0.58, 1.0)`                   |
| `cubic-bezier(p1, p2, p3, p4)` | 自定义的贝塞尔曲线，`p1` 和 `p3` 的值需要在 `[0, 1]` 区间内 |
| `steps( n, <jumpterm>)`        | 按步长应用过渡效果，不常用，略                              |

> 步长值定义的参考资料：
>
> - https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function#values

#### `transition-delay`

指定过度效果的延迟时间。

| Value                | Description         |
| -------------------- | ------------------- |
| 有效单位为 `ms`，`s` | 时间值，默认为 `0s` |

### 定义多个过渡属性

#### 使用 `transition` 时

CSS 过渡可以针对不同属性分别设置持续时间、缓动函数和延迟时间。使用 `transition` 时，多个过渡设置用逗号分隔。

> 避免产生不适，点击 `start` 开始演示动画。

<div class="example-container justify-content-evenly" style="height: 150px">
  <div id="example-def" class="example-def transition radius-hover text-white text-nowrap fs-6 d-flex align-items-center justify-content-center" style="height: 50px; width: 50px; background-color: rgb(25,135,84)"><small>指定 all</small></div>
  <div id="example-def" class="example-def transition transition-multiple radius-hover text-white text-nowrap fs-6 d-flex align-items-center justify-content-center" style="height: 50px; width: 50px; background-color: rgb(25,135,84)"><small>分别指定</small></div>
  <span class="toggle position-absolute top-0 end-0 m-3 hover-pointer">start</span>
</div>

```css
.transition {
  transition: all 0.25s ease;
}

.transition-multiple {
  transition: background-color 1s ease, width 0.25s ease, height 0.25s ease, border-radius
      1s ease, transform 0.25s ease-in-out;
}
```

#### 使用 `transition-*` 分别定义时

在每个 `transition-*` 属性中使用逗号分隔值，由位置相互匹配属性，比如上面的简写转换成单独的属性将变成下面的定义。

```css
.transition-multiple {
  transition-property: background-color, width, height, border-radius, transform;
  transition-duration: 1s, 0.25s, 0.25s, 1s, 0.25s;
  transition-timing-function: ease, ease, ease, ease, ease-in-out;
  transition-delay: 0s, 0s, 0s, 0s, 0s;
}
```

分别定义各过渡属性时，如果遇到值的长度不匹配的情况，将按照下面规则处理：

- 如果 `transition-property` 长度比其他属性**短**时，无视其他属性多出来的值；
- 如果 `transition-property` 长度比其他属性**长**时，其他属性进行循环重复匹配。

比如如果有下面的定义。

```css
.transition-test1 {
  /* the length of property is shorter than the duration */
  transition-property: background-color, width;
  transition-duration: 1s, 0.25s, 0.25s, 1s, 0.25s;
}

.transition-test2 {
  /* the length of duration is shorter than the property */
  transition-property: background-color, width, height, border-radius, transform;
  transition-duration: 1s, 0.25s;
}
```

最终将转换成以下的设置起效。

```css
.transition-test1 {
  transition-property: background-color, width;
  /* the parts that longer than property are truncated */
  transition-duration: 1s, 0.25s;
}

.transition-test2 {
  transition-property: background-color, width, height, border-radius, transform;
  /* values are repeated to match the length */
  transition-duration: 1s, 0.25s, 1s, 0.25s, 1s;
}
```

### 使用 JavaScript 时需要注意

在下面操作之后**立即**修改过渡属性时，可能**不会触发**过渡动画：

- 使用 `.appendChild()` 将元素添加到 DOM；
- 修改 `display: none;` 属性让元素显示时。

原因在于修改过渡属性时元素的样式属性可能还未计算出来，这导致元素显示出来时已经是过渡结束的状态，其初始状态未被触发，所以也就不会发生过渡效果。规避这个限制的最简单方法是使用 `setTimeout()` 函数让过渡属性的修改延迟几毫秒，元素的初始状态将在这期间进行计算。

### 检测 CSS 过渡效果的开始和结束

`TransitionEvent` 用来判断过渡动画的进行状态，浏览器会在过渡动画的执行阶段触发下面事件：

| Event              | Description                                                         |
| ------------------ | ------------------------------------------------------------------- |
| `transitioncancel` | 当 CSS 过渡动画被取消时触发                                         |
| `transitionend`    | 当 CSS 过渡动画结束时触发                                           |
| `transitionrun`    | 当 CSS 过渡动画被创建，并被放入执行队列时触发，此时动画可能尚未开始 |
| `transitionstart`  | 当 CSS 过渡动画开始时触发                                           |

同时 `TransitionEvent` 拥有下面属性：

| Property         | Description                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `.propertyName`  | 包含过渡动画关联属性名称的 `DOMString`                                                         |
| `.elapsedTime`   | 一个 `float` 表达过渡动画执行了多长时间，以秒为单位，不受延迟时间影响                          |
| `.pseudoElement` | 如果过渡动画执行对象是一个伪类元素，则为 `::` 开头的伪类元素名称的 `DOMString`，否则为空字符串 |

> 鼠标悬停，或者点击 `start` 开始统计事件数据。

<div class="example-container flex-column">
  <div class="w-100 p-3 d-flex align-items-center justify-content-center position-relative" style="height: 150px">
    <div id="transitionTarget" class="example-def transition radius-hover" style="height: 50px; width: 50px; background-color: rgb(25,135,84)"></div>
    <span class="toggle position-absolute top-0 end-0 m-3 hover-pointer">start</span>
  </div>
  <div class="w-100 mb-3 d-flex flex-column align-items-center justify-content-center text-nowrap">
    <div>
      <div class="text-center fw-bold">Event Status</div>
      <span class="me-3">Transition State: <code id="transitionState">Unknown</code></span>
      <span>Elapsed Time: <code id="elapsedTime">Unknown</code></span>
    </div>
    <div>
      <div class="text-center fw-bold">Event Count</div>
      <code>transitioncancel: <span id="countCancel">0</span></code>
      <code>transitionend: <span id="countEnd">0</span></code><br>
      <code>transitionrun: <span id="countRun">0</span></code>
      <code>transitionstart: <span id="countStart">0</span></code>
    </div>
  </div>
</div>

```js
const target = document.querySelector("#transitionTarget");
target.addEventListener("transitioncancel", (e) => {});
target.addEventListener("transitionend", (e) => {});
target.addEventListener("transitionrun", (e) => {});
target.addEventListener("transitionstart", (e) => {});
```

## 变换 transforms

用下面的 Demo 尝试各种变换的效果，下面的设定可以修改，结果会实时反应到绿色方块上。你可以按 `reset` 按钮到默认状态。

<style id="example-transform-style"></style>
<div class="example-container example-transform flex-wrap" style="min-height: 240px">
  <div class="control-panel d-flex flex-column highlight css my-3">
    <pre class="bg-transparent m-0"
      ><span class="line hover-pointer" contentEditable="true"
        ><span class="hljs-attribute">transform</span>: <span class="hljs-built_in">translate</span>(<span class="hljs-number">120px</span>, <span class="hljs-number">50px</span>);</span
      ><span class="line hover-pointer" contentEditable="true"
        ><span class="hljs-attribute">transform</span>: <span class="hljs-built_in">rotate</span>(<span class="hljs-number">0.5turn</span>);</span
      ><span class="line hover-pointer" contentEditable="true"
        ><span class="hljs-attribute">transform</span>: <span class="hljs-built_in">scale</span>(<span class="hljs-number">1.3</span>);</span
      ><span class="line hover-pointer" contentEditable="true"
        ><span class="hljs-attribute">transform</span>: <span class="hljs-built_in">skew</span>(<span class="hljs-number">30deg</span>, <span class="hljs-number">20deg</span>);</span
      ><span class="line hover-pointer" contentEditable="true"
        ><span class="hljs-attribute">transform</span>: <span class="hljs-built_in">perspective</span>(<span class="hljs-number">500px</span>);</span
    ></pre>
  </div>
  <div class="demo-panel flex-grow-1 d-flex align-items-center justify-content-center mb-3">
    <div id="demo-transform" class="" style="height: 100px; width: 100px; background-color: rgb(25,135,84)"></div>
  </div>
  <span class="reset position-absolute top-0 end-0 m-3 mt-1 hover-pointer">reset</span>
</div>

### 定义变换属性

### 3D 变换属性

### 定义多个变换属性

## References

- [Using CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions)
- [Using CSS transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transforms/Using_CSS_transforms)
- [TransitionEvent](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent)

<!-- Resources used by only this post -->
<style>
.transition {
  cursor: pointer;
  transition: all .25s ease;
  border-radius: 0;
}
.transition-multiple {
  transition: background-color 1s ease, width .25s ease, height .25s ease, border-radius 1s ease, transform .25s ease-in-out;
}
.radius-hover:hover {
  border-radius: 50%!important;
}
.hover-pointer {
  cursor: pointer;
}
.example-container .line {
  display: block;
  margin: 2px 0;
  padding: 5px;
  width: 350px;
  border-left: 4px transparent solid;
  border-bottom: 1px transparent solid;
  overflow: auto;
}
.example-container .line.active {
  border-color: #198754;
}
.example-container .line:focus {
  outline: none;
}
#demo-transform {
  transition: all .25s ease;
}
</style>
<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
<script>
$(function(){
  // example-def start
  const $def = $('.example-def')
  let states = [
    {'background-color': '#d63384',
     'width': '50px', 'height': '100px',
     'transform': 'rotate(.1turn)', 'border-radius': '100%'},
    {'background-color': '#0d6efd',
     'width': '45px', 'height': '45px',
     'transform': 'rotate(.5turn)', 'border-radius': '50%'},
    {'background-color': '#ffc107',
     'width': '100px', 'height': '60px',
     'transform': 'rotate(.6turn)', 'border-radius': '50%'},
    {'background-color': 'rgb(25,135,84)',
     'width': '50px', 'height': '50px',
     'transform': 'rotate(1turn)', 'border-radius': '0%'},
  ]
  let state = 0
  const anime = () => setInterval(() => {
    const curr = states[state++ % 4]
    Object.keys(curr).forEach(key => {
      $def.css(key, curr[key])
    })
  }, 1000)
  let timer = null
  // let timer = anime()
  const toggle = $('.example-container .toggle')
  toggle.click(function () {
    if ($(this).text() === "stop") {
      clearInterval(timer)
      toggle.text('start')
    } else {
      timer = anime()
      toggle.text('stop')
    }
  })
  // example-def end
  // example-event start
  let cancel = 0, run = 0, end = 0, start = 0
  const target = $('#transitionTarget'),
    transitionState = $('#transitionState'),
    elapsedTime = $('#elapsedTime'),
    countCancel = $('#countCancel'),
    countEnd = $('#countEnd'),
    countRun = $('#countRun'),
    countStart = $('#countStart'),
    count = {
      'Cancelled': () => countCancel.text(++cancel),
      'Ended': () => countEnd.text(++end),
      'Run': () => countRun.text(++run),
      'Started': () => countStart.text(++start),
    },
    record = name => e => {
      // console.log(e)
      transitionState.text(name)
      elapsedTime.text(e.originalEvent.elapsedTime)
      count[name]()
    }
  target.on('transitioncancel', record('Cancelled'))
  target.on('transitionend', record('Ended'))
  target.on('transitionrun', record('Run'))
  target.on('transitionstart', record('Started'))
  // example-event end
  // example-transform start
  const lines = $('.example-transform .line')
    transformStyles = $('#example-transform-style')
  lines.each(function(){
    $(this).data('bk', $(this).html())
  })
  lines.click(function() {
    lines.removeClass('active')
    $(this).addClass('active')
    transformStyles.html(`#demo-transform {${$(this).text()}}`)
  })
  lines.on('input', function() {
    transformStyles.html(`#demo-transform {${$(this).text()}}`)
  })
  $('.example-transform .reset').click(() => lines.each(function() {
    lines.removeClass('active')
    $(this).html($(this).data('bk'))
    transformStyles.html('')
  }))
  // example-transform end
})
</script>
