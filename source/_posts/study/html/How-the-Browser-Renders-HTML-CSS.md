---
title: 浏览器如何渲染网页？- DOM，CSSOM & Render Tree
tags:
  - Browser
  - HTML
  - CSS
date: "2021-08-26T14:17:44.900Z"
categories:
  - study
  - html
---

使用浏览器打开一个网页，你会发现有一部分网页资源在加载完之前会阻塞浏览器的渲染进程，还有一部分网页资源可以被异步加载。前端开发时你偶尔会遇到这些问题：资源下载速度**缓慢**？首屏等待**多余的文件**下载和初始化？未应用 CSS 的内容**一闪而过**（flash of unstyled content，`FOUC`）？要避免它们，开发一个用户体验优秀的网站，你需要的是理解浏览器渲染网页的逻辑与顺序。

当浏览器发送请求到服务器以获取 HTML，服务器用**二进制流（`binary stream`）**形式返回 HTML 的文本内容，在响应中，服务器将 header 部分的 `Content-Type` 属性的值设置为 `text/html; charset=UTF-8`。其中 `text/html` 部分告诉浏览器响应数据是一份 HTML 文本；`charset=UTF-8` 部分告诉浏览器响应数据使用的字符集。有了这些信息，浏览器就可以正常的解析 HTML 标签并对网页进行渲染了。相反，如果响应的 header 部分中缺少了 `Content-Type` 属性，浏览器会因为缺少对响应数据的描述信息而将其数据以纯文本的方式展现给用户。

浏览器要渲染的网页主体由 HTML 文本构成，通常有额外的 CSS 文件提供样式，有 JS 文件提供脚本操作。不过浏览器到底是如何从一堆文本信息中知道如何渲染一个网页？讨论这件事情之前，我们需要理解什么是 **DOM**、**CSSOM** 和 **Render Tree**。

<!-- more -->

## Document Object Model (DOM)

浏览器会将所有 HTML 元素转换为 JavaScript 的 **Node** 对象。因为 HTML 元素存在不同的标签和不同的属性，浏览器在转换过程中会将它们变成不同的 Node 子类。

> 💡 比如 `div` 元素会被转换为**继承** `Node` 的子类 `HTMLDivElement`。随便找一个网页，打开开发者控制台，输入下面代码来来看看结果。
>
> ```js
> const div = document.querySelector("div");
> // ...
> div instanceof HTMLDivElement;
> // true
> div instanceof Node;
> // true
> ```
>
> 除此之外，浏览器给每一个 HTML 元素创建了对应的类，比如 `HTMLScriptElement` 等。

由于 HTML 中的元素是相互嵌套的，浏览器创建每个元素的 Node 对象之后会将它们按照 HTML 中的关系来创建一个树形数据，以此来在网页的整个生命周期内有效的渲染和管理元素。而这个树形数据也就是所谓的 **DOM 树**。

```console
                                  +-----------------+
                                  |      html       |
                                  | HTMLHtmlElement |
                                  +-----/-----\-----+
                                  /------       -------\
                          /------                      -------\
              +-----------------+                         +-----------------+
              |      head       |                         |     body        |
              | HTMLHeadElement |                         | HTMLBodyElement |
              +-------/-\-------+                         +-------/-\-------+
                   /--   --\                                   /--   --\
                 /-         -\                               /-         -\
              /--             --\                         /--             --\
  +------------------+   +-----------------+  +------------------+  +-------------------+
  |       title      |   |      link       |  |       div        |  |       script      |
  | HTMLTitleElement |   | HTMLLinkElement |  |  HTMLDivElement  |  | HTMLScriptElement |
  +------------------+   +-----------------+  +--------/-\-------+  +-------------------+
                                                    /--   ---\
                                                /---          --\
                                            /--                 ---\
                                +--------------------+    +----------------------+
                                |         h1         |    |           p          |
                                | HTMLHeadingElement |    | HTMLParagraphElement |
                                +----------|---------+    +-----------|----------+
                                           |                          |
                                           |                          |
                                +----------|---------+    +-----------|----------+
                                |     (TextNode)     |    |       (TextNode)     |
                                |     Text here      |    |       Text here      |
                                +--------------------+    +----------------------+
```

DOM 树的结构类似上面这个例子，其从最上面的根节点 `html` 元素开始，按照每个元素出现的顺序和嵌套的关系向下分支。每当浏览器遇到一个 HTML 元素时，就会在 DOM 树上用这个元素的类创建一个对应的节点。不过 DOM 树的节点不仅包括 HTML 元素，其他诸如注释、属性、文本等类型的数据也会被创建成一个节点存在于 DOM 树的数据结构之中。但是简单起见，本文中我们只关注 DOM 树中的 HTML 元素节点，也就是所谓的 DOM 元素。（你可以从[这个列表](https://www.w3schools.com/jsref/prop_node_nodetype.asp)了解一共 12 种不同的节点类型。）

你可以在浏览器开发者控制台的 Elements 标签页看到 DOM 树的可视化表现。从可视化的视图中你可以看到 DOM 元素的层级关系和每个元素的属性。DOM 并非 JavaScript 的规格实现的一部分，它是由浏览器提供的高级 Web API，目的是为了高效地渲染网页，同时公开给开发者根据需求动态地操作 DOM 元素。

> 💡 通过 DOM API，开发者可以对 HTML 元素进行添加和删除操作，可以改变 HTML 元素的外观，或者监听相应的事件。使用 DOM API 时，HTML 元素可以不影响已渲染的 DOM 树，在内存中进行创建和复制操作。这个特性让前端开发可以设计出用户体验更好的动态页面。

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
- [HTML DOM nodeType Property](https://www.w3schools.com/jsref/prop_node_nodetype.asp)
