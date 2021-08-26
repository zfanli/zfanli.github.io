---
title: 浏览器如何渲染网页？
tags:
  - Browser
  - HTML
  - CSS
date: '2021-08-26T14:17:44.900Z'
categories:
  - study
  - html
---

资源下载速度**缓慢**？首屏等待**没必要的文件**下载和初始化？未应用 CSS 的内容**一闪而过**（flash of unstyled content，`FOUC`）？

浏览器会阻塞网页的渲染进程直到某些资源被加载，而另一些资源会被异步加载。在前端开发过程中你总会遇到上面的问题，要避免它们，开发一个用户体验优秀的网站，你需要理解浏览器渲染网页的逻辑与顺序。

<!-- more -->

首先我们要理解什么是 **DOM**。当浏览器发送请求到服务器获取 HTML，服务器会用**二进制流（`binary stream`）形式**返回 HTML 的文本内容，并将 header 的 `Content-Type` 设置为 `text/html; charset=UTF-8`。

`text/html` 告诉浏览器这是一个 HTML 文本，`charset=UTF-8` 告诉浏览器内容使用的字符集。有了这些信息，浏览器就可以正常的解析 HTML 标签渲染我们的网页了。如果服务器的响应中缺少了这个 header，浏览器会不知道该如何处理响应内容，转而将 HTML 当作纯文本输出。

一个网页主体由 HTML 文本构成，通常有额外的 CSS 文件提供样式，JS 文件提供脚本操作。所以，问题是浏览器到底如何从一个纯文本信息的文件中知道如何渲染一个网页？要解释这件事，我们还需要理解什么是 **DOM**、**CSSOM** 和 **Render Tree**。

## Document Object Model (DOM)

浏览器会将所有 HTML 元素转换为 JavaScript 的 Node 对象。因为 HTML 元素存在不同的标签和不同的属性，浏览器在转换过程中会将它们变成不同的 Node 子类。

> 比如 div 元素会被转换为继承 Node 的子类 `HTMLDivElement`。
>
> ```js
> const div = document.querySelector("div");
> // undefined
> div instanceof HTMLDivElement;
> // true
> div instanceof Node;
> // true
> ```

浏览器根据 HTML 代码创建了 Node 对象之后，会使用它们创建一个叫做 DOM 树的树形结构。因为 HTML 中的元素是相互嵌套的，浏览器会使用元素相对应的 Node 对象复现这个结构。这个结构将帮助浏览器在网页的生命周期内有效率的渲染和管理网页元素。

DOM 树从最上面的根节点 html 标签开始分支，按照元素出现和嵌套的关系，浏览器每找到一个元素，就会创建其对应的 Node 子类的对象。

> DOM 树节点类型不仅包括 HTML 元素，还包括注释、属性和纯文本内容。但是方便起见，本文中我们仅考虑 DOM 树中的 HTML 元素，这些元素也叫做 DOM 元素。

在浏览器中，打开开发者控制台，找到 Elements 标签，这里你可以看到当前 DOM 树的层级和属性。DOM 并非 JavaScript 的规格的一部分，而是浏览器提供的高级 Web API，目的是为了高效渲染网页，同时方便开发者根据需求动态操作网页元素。

> 通过 DOM API，开发者可以对 HTML 元素进行添加和删除操作，可以改变其外观，以及绑定事件监听器；还可以在不影响已经渲染过的 DOM 树的情况下，在内存中对 HTML 元素进行创建和复制等操作。这带给开发者高自由度，基于此开发用户体验丰富的网页。

## CSS Object Model (CSSOM)

我们可以通过 CSS 给指定的 HTML 元素提供样式。这些 CSS 的定义可以用外部文件导入到当前页面中；可以使用 style 标签将 CSS 定义嵌入到当前页面中；或者在 HTML 标签上使用 inline 属性来针对单个元素的 CSS 属性。此外，通过 JavaScript 也可以动态的设定元素的 CSS 属性。

最终，浏览器会负责这里最困难的工作，将这些所有的 CSS 属性的定义整合到一块，并应用到对应的 DOM 元素上。

在构筑完 DOM 树之后，浏览器会读取各种来源的 CSS 属性定义，诸如外部的、内嵌的、行内的还有用户代理（User Agent，即浏览器）定义的所有 CSS 属性，将其构建成 CSSOM 树，就像 DOM 树一样。

CSSOM 树的每一个节点包含需要应用到选择器目标的 DOM 元素上的 CSS 样式，但是不包含不会显示在页面上的元素，比如 meta、style 等。

之前有提到用户代理样式，大部分浏览器会提供一套自己的默认样式，即 User Agent Stylesheet。浏览器通过将开发者指定的 CSS 属性覆盖默认式样来计算最终的属性值，然后创建 CSSOM 的节点。

但是如果浏览器的用户代理样式和开发者指定的 CSS 属性都没有对某个属性设定，那么浏览器会根据 W3C 的 CSS 标准将其设定为指定的默认值。

当使用 CSS 标准指定的默认值时，如果在 W3C 文档中有提到某属性的值是可继承的，那么它就会根据一定的继承规则来设定自己的值。例如 color 和 font-size 属性在未指定具体值的时候，会从其父元素继承。所以当你给某个 HTML 元素设定了这两个属性，它的子元素会全部继承这个值。这个规则就是层重叠（cascading），这也是为什么 CSS 被称作层重叠样式表（cascading style sheets），同样这也是为什么浏览器要将 CSSOM 构建成一个树形结构的原因，浏览器可以根据其父节点的样式和继承规则来计算每个元素的最终的 CSS 样式属性。

> 浏览器的开发者控制台中，在 Elements 标签中有一个 Computed 面板中会显示元素所有最终计算出来的属性值。## Render Tree

## Render Tree

Render Tree 同样是一个树形结构，通过将 DOM 树和 CSSOM 树组合来创建。浏览器通过 Render Tree 计算每个可见元素的图层并将其绘制到屏幕上。因此网页内容只会在浏览器将 Render Tree 创建完成后才会显示，而要创建 Render Tree，还需要先创建 DOM 树和 CSSOM 树。

Render Tree 是网页内容输出到屏幕上的过程中的底层表达，其不包含不显示的内容。比如 dispaly：none；的元素，他们在平面上占据 0px x 0px 面积，所以不会出现在 Render Tree 中。然而根据这个规则，opacity 和 visibility 虽然也会让元素不可见，但是元素占据的空间没有消失，所以还是会出现在 Render Tree 中。

## Rendering Sequence

### Layout operation

### Paint operation

### Compositing operation

## Browser engines

- IE

  - Engine: Trident
  - CSS-prefix: `-ms`

- Edge

  - Engine: ~~EdgeHTML~~ → Blink
  - CSS-prefix: `-ms`

- Firefox

  - Engine: Gecko
  - CSS-prefix: `-moz`

- Opera

  - Engine: ~~Presto~~ → Blink
  - CSS-prefix: `-o` (Presto) and `-webkit` (Blink)

- Safari

  - Engine: WebKit
  - CSS-prefix: `-webkit`

- Chrome

  - Engine: ~~WebKit~~ → Blink
  - CSS-prefix: `-webkit`

## Rendering Process in browsers

### Parsing and External Resources

### Parser-Blocking Scripts

## Reference

- [How the browser renders HTM & CSS](https://medium.com/@mustafa.abdelmogoud/how-the-browser-renders-html-css-27920d8ccaa6)
- [How the browser renders a web page? — DOM, CSSOM, and Rendering](https://medium.com/jspoint/how-the-browser-renders-a-web-page-dom-cssom-and-rendering-df10531c9969)
- [An Introduction and Guide to the CSS Object Model (CSSOM)](https://css-tricks.com/an-introduction-and-guide-to-the-css-object-model-cssom/)
