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

```css
div {
  transition: all 0.25s ease;
  transform: translate(50px) rotate(30deg);
}
```

<!-- more -->

## 过渡 transitions

> 对于动画效果需要注意！
>
> 网页上的缩放动画效果是常见的特定偏头痛症状的触发因素，所以如果你希望在网页上加入这样的动画效果，你应该提供一个开关让用户可以选择关闭动画。
>
> CSS 媒体查询有一个 `prefers-reduced-motion` 属性表示用户系统偏好设置了减少动画效果，你可以考虑使用这个媒体查询来关闭动画效果。

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

用于定义变换效果的属性主要有 2 个。

#### `transform-origin`

指定原点的位置，默认的位置是元素的中心点。这个属性对旋转、缩放和歪曲等变换效果有效果，因为这些效果需要基于一个点作为参数。

<style id="example-transform-origin-style"></style>
<div class="example-container example-transform-origin flex-wrap" style="min-height: 240px">
  <div class="control-panel d-flex flex-column highlight css my-3">
    <pre class="bg-transparent m-0"
      ><span class="line hover-pointer" contentEditable="true" data-transform="rotate(30deg)" data-origin="top: 50%; left: 50%;"
        ><span class="hljs-attribute">transform-origin</span>: center;</span
      ><span class="line hover-pointer" contentEditable="true" data-transform="rotate(30deg)" data-origin="top: 0; left: 0;"
        ><span class="hljs-attribute">transform-origin</span>: top left;</span
      ><span class="line hover-pointer" contentEditable="true" data-transform="rotate(30deg)" data-origin="top: 20px; left: 50px;"
        ><span class="hljs-attribute">transform-origin</span>: 50px 20px;</span
      ><span class="line hover-pointer" contentEditable="true" data-transform="rotate3d(1, 2, 0, 60deg)" data-origin="top: 100%; left: 100%;"
        ><span class="hljs-attribute">transform-origin</span>: bottom right 60px;</span
      ><span class="line hover-pointer" contentEditable="true" data-transform="rotate(30deg)" data-origin="top: 100%; left: 0;"
        ><span class="hljs-attribute">transform-origin</span>: bottom left;</span
    ></pre>
  </div>
  <div class="demo-panel flex-grow-1 d-flex align-items-center justify-content-center mb-3">
    <div id="demo-transform-origin" class="" style=""></div>
  </div>
  <span class="reset position-absolute top-0 end-0 m-3 mt-1 hover-pointer">reset</span>
</div>

```css
/* One value */
div {
  transform-origin: <length>|<percentage>|<keyword>;
}

/* Two values */
div {
  transform-origin: <length>|<percentage>|<x-offset-keyword>
    <length>|<percentage>|<y-offset-keyword>;
}

/* Three values, the third value represents the z offset */
div {
  transform-origin: <length>|<percentage>|<x-offset-keyword>
    <length>|<percentage>|<y-offset-keyword> <length>;
}
```

| Keyword | Value | Description                        |
| ------- | ----- | ---------------------------------- |
| left    | 0%    | x-offset-keyword                   |
| center  | 50%   | x-offset-keyword, y-offset-keyword |
| right   | 100%  | x-offset-keyword                   |
| top     | 0%    | y-offset-keyword                   |
| bottom  | 100%  | y-offset-keyword                   |

#### `transform`

变换属性让你旋转、缩放、歪曲或平移元素。变换属性只能应用在由 CSS 盒子模型控制的可变换元素。你可以只指定一个变换函数，也可以用空格分隔同时指定多个变换函数。

当你指定多个变换函数时构成组合变换 `Composition Transforms`，每个变换效果将根据**从右到左**的顺序依次应用。

指定多个变换函数时，你可以重复指定同一种函数，这些函数会按照上述顺序执行。请注意有些函数交换位置后不影响结果，但是其他的函数执行顺序至关重要。

```css
/* Single function */
div {
  transform: <transform-function>;
}

/* Multiple functions */
div {
  transform: <transform-function> [<transform-function> ...];
}
```

#### `transform: matrix`

均匀的 2D 变换矩阵。还有一个 3d 版本 `matrix3d` 在下文介绍。

> **NOTE! 注意！**
>
> 演示代码中定义了多个 `transform` 属性，但是实际使用中最后一个定义的变换效果会覆盖之前的定义，如果需要定义多个变换效果，请定义一个 `transform` 属性，用**空格分隔变换函数**赋值给它。

```css
div {
  transform: matrix(a, b, c, d, tx, ty);
  /* For each parameters the function at the same position will be applied */
  /* matrix(scaleX(), skewY(), skewX(), scaleY(), translateX(), translateY()) */

  /* Equivalent to the below */
  transform: matrix3d(a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1);

  /* This line will take effect */
  transform: matrix(1, 2, -1, 1, 80, 80);
}
```

#### `transform: translate`

在 2d 平面平移元素。这个变换函数有几个变种函数。

| Function        | Parameters             | Description                                                            |
| --------------- | ---------------------- | ---------------------------------------------------------------------- |
| `translate()`   | `<length>[, <length>]` | 在 2d 平面平移元素，如果纵轴没有给值则使用横轴的值                     |
| `translate3d()` | `tx, ty, tz`           | 在 3d 空间平移元素，3d 版本具体在下文介绍                              |
| `translateX()`  | `tx`                   | 在水平方向平移元素，等同 `translate(tx, 0)` 或 `translate3d(tx, 0, 0)` |
| `translateY()`  | `ty`                   | 在垂直方向平移元素，等同 `translate(0, ty)` 或 `translate3d(0, ty, 0)` |
| `translateZ()`  | `tz`                   | 围绕 z 轴平移元素，等同 `translate3d(0, 0, tz)`                        |

```css
div {
  transform: translate(50%);
  /* This line will take effect */
  transform: translate(50px, 100px);
}
```

#### `transform: scale`

在 2d 平面缩放元素。这个变换函数有几个变种存在。

| Function    | Parameters   | Description                                                      |
| ----------- | ------------ | ---------------------------------------------------------------- |
| `scale()`   | `sx[, xy]`   | 在 2d 平面缩放元素，如果纵轴没有给值则使用横轴的值               |
| `scale3d()` | `sx, sy, sz` | 在 3d 空间缩放元素，3d 版本具体在下文介绍                        |
| `scaleX()`  | `s`          | 调整水平方向元素大小，等同 `scale(sx, 1)` 或 `scale3d(sx, 1, 1)` |
| `scaleY()`  | `s`          | 调整垂直方向元素大小，等同 `scale(1, sy)` 或 `scale3d(1, sy, 1)` |
| `scaleZ()`  | `s`          | 围绕 z 轴调整元素大小，等同 `scale3d(1, 1, sz)`                  |

```css
div {
  transform: scale(1.5);
  /* This line will take effect */
  transform: scale(-1, 1);
}
```

#### `transform: rotate`

在 2d 平面围绕一个固定点旋转元素。这个变换函数有几个变种函数。

| Function     | Parameters         | Description                                                                |
| ------------ | ------------------ | -------------------------------------------------------------------------- |
| `rotate()`   | `<angle>`          | 在 2d 平面围绕一个**固定点**旋转元素，固定点坐标由 `transform-origin` 定义 |
| `rotate3d()` | `x, y, z, <angle>` | 在 3d 空间围绕一个**固定轴**旋转元素，3d 版本具体在下文介绍                |
| `rotateX()`  | `<angle>`          | 围绕水平坐标轴旋转元素，等同 `rotate3d(1, 0, 0, a)`                        |
| `rotateY()`  | `<angle>`          | 围绕垂直坐标轴旋转元素，等同 `rotate3d(0, 1, 0, a)`                        |
| `rotateZ()`  | `<angle>`          | 围绕 z 轴旋转元素，等同 `rotate3d(0, 0, 1, a)`                             |

`<angle>` 单位定义。

| Unit   | Definition                                         |
| ------ | -------------------------------------------------- |
| `deg`  | 单位 `度`，一整圈为 `360deg`                       |
| `grad` | 单位 `梯度`，一整圈为 `400grad`                    |
| `rad`  | 单位 `弧度`，弧度一整圈为 2π，表示接近 `6.2832rad` |
| `turn` | 单位 `转`，一整圈为 `1turn`                        |

```css
div {
  transform: rotate(30deg);
  transform: rotate(0.5turn);
  /* This line will take effect */
  transform: rotate(200grad);
}
```

#### `transform: skew`

在 2d 平面歪曲元素。这个变换函数有几个变种存在。歪曲函数的参数使用角度单位，与 `rotate` 一致。

| Function  | Parameters | Description                                        |
| --------- | ---------- | -------------------------------------------------- |
| `skew()`  | `ax[, ay]` | 在 2d 平面缩放元素，如果纵轴没有给值则使用横轴的值 |
| `skewX()` | `<angle>`  | 在水平方向歪曲元素，等同 `skew(a)`                 |
| `skewY()` | `<angle>`  | 在垂直方向歪曲元素                                 |

```css
div {
  transform: skew(30deg);
  /* This line will take effect */
  transform: skew(30deg, 60deg);
}
```

### 3D 变换属性

3d 空间的变换效果相对 2d 平面来说参数和概念上复杂很多，并且使用场景差别较大，这一部分我们单独拿出来讨论。

#### `transform: matrix3d`

均匀的 `4 x 4` 的 3d 变换矩阵。矩阵变换是 `transform` 属性实现的基础，所有其他变换函数都是在计算完结果之后应用矩阵变换实现的。

换言之，所有变换效果都有一个与之对应的矩阵变换的写法。对于一般效果而言，使用对应的变换函数是最方便的，但是对于组合变换也难以实现的变换效果来说，就需要用到矩阵变换来实现。

下面是 3d 矩阵变换的参数定义，详细探索以后有机会再具体探讨。

<!-- prettier-ignore-start -->
```css
div {
  transform: matrix3d(
    a1, b1, c1, d1,
    a2, b2, c2, d2,
    a3, b3, c3, d3,
    a4, b4, c4, d4
  );
}
```
<!-- prettier-ignore-end -->

#### `transform: translate3d`

在 3d 空间平移元素。3d 的元素平移变换相对 2d 版本并没有复杂多少，接受 3 个向量作为横轴、纵轴和 z 轴方向上的移动量。

```css
div {
  transform: translate3d(0);
  /* This line will take effect */
  transform: translate3d(42px, -662px, -125px);
}
```

#### `transform: scale3d`

在 3d 空间缩放元素。这个变换也接收 3 个向量，分别作为横轴、纵轴和 z 轴的缩放量。如果 3 个向量的值相等，则元素将按照等比在 3d 空间缩放。

```css
div {
  /* 这两个定义将等比缩放 */
  transform: scale3d(1, 1, 1);
  transform: scale3d(1.3, 1.3, 1.3);
  /* 下面的定义不是等比缩放 */
  transform: scale3d(0.5, 1.4, 0.8);
  transform: scale3d(-1.4, 0.5, 0.7);
}
```

#### `transform: rotate3d`

在 3d 空间围绕一个**固定轴**旋转元素。3d 空间的旋转相比复杂一点。

在 3d 空间旋转一个元素存在 3 个方向的自由度，由三个向量组成的 3d 坐标 `[x, y, z]` 和 `transform-origin` 原点连成一条直线构成 3d 旋转的转轴。

> 如果指定的向量未**标准化**（`normalized`，比如 3 个坐标值的平方和为 `1`），浏览器会代为进行标准化。但是如果指定的值无法进行标准化，比如指定了 `[0, 0, 0]`，则旋转会被无视，但是不会导致整个 CSS 属性失效。
>
> 另外，2d 平面上的元素旋转应用的顺序不会影响其效果，但是通常 3d 空间的旋转不同，其会根据应用的顺序不同，从而产生不同的效果。

```css
div {
  transform: rotate3d(x, y, z, a);
  /* Examples */
  transform: rotate3d(1, 1, 1, 30deg);
  transform: rotate3d(2, -1, -1, 0.5turn);
}
```

#### `transform: perspective`

透视变换，设定用户与 `z=0` 平面的距离。

```css
div {
  /* TODO: perspective demo with CSS cube */
  transform: perspective(0);
  transform: perspective(800px);
  transform: perspective(23rem);
}
```

## References

- [Using CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions)
- [Using CSS transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transforms/Using_CSS_transforms)
- [transition](https://developer.mozilla.org/en-US/docs/Web/CSS/transition)
- [transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
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
  width: 370px;
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

#demo-transform-multiple,
#demo-transform {
  transition: all .25s ease;
}
#demo-transform-origin {
  position: relative;
  border: 3px dashed #dc3545;
  height: 106px;
  width: 106px;
  border-radius: 2px;
}
#demo-transform-origin::before {
  transform: rotate(0);
  content: 'ROTATE ME';
  color: white;
  line-height: 100px;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgb(25, 135, 84);
  z-index: -1;
}
#demo-transform-origin::after {
  content: ' ';
  width: 5px;
  height: 5px;
  position: absolute;
  background-color: white;
  border-radius: 50%;
  padding: 3px;
  border: 3px solid #dc3545;
  transform: translate(-50%, -50%);
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
  ;(function() {
    const lines = $('.example-transform .line'),
      transformStyles = $('#example-transform-style')
    lines.each(function(){
      $(this).data('bk', $(this).html())
    })
    lines.click(function() {
      lines.removeClass('active')
      $(this).addClass('active')
      transformStyles.html(`.example-transform #demo-transform {${$(this).text()}}`)
    })
    lines.on('input', function() {
      transformStyles.html(`.example-transform #demo-transform {${$(this).text()}}`)
    })
    $('.example-transform .reset').click(() => lines.each(function() {
      lines.removeClass('active')
      $(this).html($(this).data('bk'))
      transformStyles.html('')
    }))
  })()
  // example-transform end
  // example-transform-origin start
  ;(function() {
    const lines = $('.example-transform-origin .line'),
      transformStyles = $('#example-transform-origin-style')
    lines.each(function(){
      $(this).data('bk', $(this).html())
    })
    lines.click(function() {
      lines.removeClass('active')
      transformStyles.html('')
      $(this).addClass('active')
      setTimeout(()=>
      transformStyles.html(`#demo-transform-origin::before {${$(this).text()}} #demo-transform-origin::after {${$(this).data('origin')}}`)
      ,10)
      setTimeout(()=>
      transformStyles.html(`#demo-transform-origin::before {transition: all .75s ease;${$(this).text()}transform: ${$(this).data('transform')}!important;} #demo-transform-origin::after {${$(this).data('origin')}}`)
      ,100)
    })
    lines.on('input', function() {
      transformStyles.html(`#demo-transform-origin::before {transition: all .75s ease;${$(this).text()}transform: ${$(this).data('transform')}!important;} #demo-transform-origin::after {${$(this).data('origin')}}`)
    })
    $('.example-transform-origin .reset').click(() => lines.each(function() {
      lines.removeClass('active')
      $(this).html($(this).data('bk'))
      transformStyles.html('')
    }))
  })()
  // example-transform-origin end
  // example-transform-multiple start
  ;(function() {
    const lines = $('.example-transform-multiple .line'),
      transformStyles = $('#example-transform-multiple-style')
    lines.each(function(){
      $(this).data('bk', $(this).html())
    })
    lines.click(function() {
      lines.removeClass('active')
      $(this).addClass('active')
      transformStyles.html(`.example-transform-multiple #demo-transform-multiple {${$(this).text()}}`)
    })
    lines.on('input', function() {
      transformStyles.html(`.example-transform-multiple #demo-transform-multiple {${$(this).text()}}`)
    })
    $('.example-transform-multiple .reset').click(() => lines.each(function() {
      lines.removeClass('active')
      $(this).html($(this).data('bk'))
      transformStyles.html('')
    }))
  })()
  // example-transform-multiple end
})
</script>
