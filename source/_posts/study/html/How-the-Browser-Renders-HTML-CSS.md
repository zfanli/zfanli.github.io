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

本文以下面这个简单的 HTML 为例来解释浏览器渲染网页的过程。

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Rendering Test</title>

    <!-- stylesheet -->
    <link rel="stylesheet" href="./style.css" />
  </head>
  <body>
    <div class="container">
      <h1>Hello World!</h1>
      <p>This is a sample paragraph.</p>
    </div>

    <!-- script -->
    <script src="./main.js"></script>
  </body>
</html>
```

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

由于 HTML 中的元素是相互嵌套的，浏览器创建每个元素的 Node 对象之后会将它们按照 HTML 中的关系来创建一个树形数据，以此来在网页的整个生命周期内有效的渲染和管理元素。而这个树形数据也就是所谓的 **DOM 树**。例子中的 HTML 解析成 DOM 树之后会变成下面这个样子。

<pre class="text-center"><code class="d-inline-block mt-0 mb-3 text-start">
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
                              |      Hello...      |    |       This is...     |
                              +--------------------+    +----------------------+
</code><div>DOM Tree</div></pre>

DOM 树的结构如其所示，从最上面的根节点 `html` 元素开始，按照每个元素出现的顺序和嵌套的关系向下分支。每当浏览器遇到一个 HTML 元素时，就会在 DOM 树上用这个元素的类创建一个对应的节点。不过 DOM 树的节点不仅包括 HTML 元素，其他诸如注释、属性、文本等类型的数据也会被创建成一个节点存在于 DOM 树的数据结构之中。但是简单起见，本文中我们只关注 DOM 树中的 HTML 元素节点，也就是所谓的 DOM 元素。（你可以从[这个列表](https://www.w3schools.com/jsref/prop_node_nodetype.asp)了解一共 12 种不同的节点类型。）

你可以在浏览器开发者控制台的 Elements 标签页看到 DOM 树的可视化表现。从可视化的视图中你可以看到 DOM 元素的层级关系和每个元素的属性。DOM 并非 JavaScript 的规格实现的一部分，它是由浏览器提供的高级 Web API，目的是为了高效地渲染网页，同时公开给开发者根据需求动态地操作 DOM 元素。

> 💡 通过 DOM API，开发者可以对 HTML 元素进行添加和删除操作，可以改变 HTML 元素的外观，或者监听相应的事件。使用 DOM API 时，HTML 元素可以不影响已渲染的 DOM 树，在内存中进行创建和复制操作。这个特性让前端开发可以设计出用户体验更好的动态页面。

## CSS Object Model (CSSOM)

通过提供 CSS 样式我们可以设计出美观的网页。我们知道 CSS 全称为 **Cascading Style Sheets**，使用 CSS **选择器**可以给指定的 DOM 元素设定像 `color` 或 `font-size` 之类的属性。提供 CSS 样式也有几个不同的方法，比如使用外部文件，使用内嵌在 HTML 的 `<style>` 标签，或者对单个 HTML 元素使用行内属性 `style`，亦或者使用 JavaScript。但是这里最困难的工作是将这些所有的 CSS 样式应用到对应的 DOM 元素上，浏览器必须要完成这个工作。

假设之前的例子中 `style.css` 中定义了以下 CSS 样式属性。

```css
html {
  padding: 0;
  margin: 0;
}

body {
  font-size: 14px;
}

.container {
  width: 300px;
  height: 200px;
  color: black;
}

.container > h1 {
  color: gray;
}

.container > p {
  font-size: 12px;
  display: none;
}
```

浏览器在创建完 DOM 树后会开始读取各种来源提供的 CSS，据此来创建 CSSOM，也就是所谓的 **CSS Object Model**。这个数据结构和 DOM 树相似，同样是一个树形数据。CSSOM 树上的每一个节点包含对应 DOM 元素的所有 CSS 信息，这个对应元素通过 CSS 选择器来指定。CSSOM 树不包含不会显示在屏幕上的 DOM 元素信息，比如 `<meta>`、`<script>` 和 `<title>` 等元素。

我们需要理解浏览器计算 CSS 属性的规则。每个浏览器都会提供一套用户代理样式（**User Agent Stylesheets**）来设定一些 CSS 属性的默认值，浏览器通过将开发者提供的 CSS 属性根据特定规则覆盖用户代理样式来计算最终的 CSS 属性值，并且依此创建 CSSOM 树的节点。如有 CSS 属性在用户代理样式和开发者指定的样式中都没有定义，浏览器将根据 W3C CSS 标准指定的**默认值**来设定这个属性。

使用默认值时，如果该属性在 W3C 文档中被标识为可继承的属性，默认值将根据某些继承规则来决定。例如一个 HTML 元素的 `color` 和 `font-size` 属性在未作具体定义时，默认值会从其父元素继承。因此当你给一个 HTML 元素设定这些属性，这个元素的所有子代元素都会继承这些属性作为默认值。这个规则就是**样式层叠（cascading of styles）**，这也是为什么 CSS 叫作层叠样式表（cascading style sheets）的原因所在，同样这也是为什么浏览器要将 CSSOM 构建成一个树形结构的原因，浏览器可以根据其父节点的样式和继承规则来计算每个元素的最终的 CSS 样式属性。

> 💡 浏览器的开发者控制台中，在 Elements 标签中有一个 Computed 面板中会显示元素所有最终计算出来的属性值。

我们可以将上面的 CSS 构建成 CSSOM 树的结果可视化表达为下面的树状图表。这里简单起见，我们先无视由浏览器定义的所有用户代理样式，只关注开发者提供的 CSS 样式。

<pre class="text-center"><code class="d-inline-block mt-0 mb-3 text-start">
            +-----------------+
            |       html      |
            |  padding: 0px;  |
            |   margin: 0px;  |
            +---------\-------+
                        --\
                          ---\
                              --\
                        +-------------------+
                        |       body        |
                        |  font-size: 14px; |
                        +--------/----------+
                              /--
                            /--
                        /--
          +-----------------------+
          |          div          |
          |      width: 300px;    |
          |     height: 200px;    |
          |      color: black;    |
          |  <span class="text-danger">font-size: 14px;</span>     |
          +----------/-\----------+
                  /--   ---\
                /--          --\
            /--                ---\
+--------------------+   +----------------------+
|         h1         |   |           p          |
|      color: gray;  |   |  font-size: 12px;    |
|  <span class="text-danger">font-size: 14px;</span>  |   |    display: none;    |
+--------------------+   |      <span class="text-danger">color: black;</span>   |
                         +----------------------+
</code><div>CSSOM Tree</div></pre>

与之前的 DOM 树图表相比，你会发现 CSSOM 树上不存在 `<meta>`、`<script>` 和 `<title>` 等不在屏幕上显示的元素。图表中红色的属性表示是从上层继承来的层叠样式，这些样式在当前元素没有设定相应的属性时作为默认值被浏览器设定。而如果当前元素设定了对应的属性，比如 `h1` 元素的 `color` 属性被设为了 `gray`，从上层继承而来的 `black` 就不再起作用，但是 `p` 元素没有设定这个属性，`black` 就作为从上层元素层叠下来的式样被浏览器设置给了它。

## Render Tree

Render-Tree 顾名思义，同样是一个树形结构的数据，通过组合 DOM 树和 CSSOM 树创建而成。Render-Tree 的作用在于帮助浏览器计算每个可见元素的**布局（Layout）**并在屏幕上进行**绘制（Paint）**。不过也因为如此，在 DOM 树和 CSSOM 树被创建出来之前，屏幕上不会渲染任何内容。

Render-Tree 是一种底层表达，用来决定哪些元素最终会输出到屏幕上，那些不占据任何像素面积的节点不包括在 Render-Tree 中。比如 `display: none;` 的元素使用 `0px x 0px` 的面积，它们不会出现在 Render-Tree 中。

<pre class="text-center"><code class="d-inline-block mt-0 mb-3 text-start">
             +-----------------+
             |       html      |
             |  padding: 0px;  |
             |   margin: 0px;  |
             +---------\-------+
                        --\
                           ---\
                               --\
                         +-------------------+
                         |       body        |
                         |  font-size: 14px; |
                         +--------/----------+
                               /--
                            /--
                         /--
           +-----------------------+
           |          div          |
           |      width: 300px;    |
           |     height: 200px;    |
           |      color: black;    |
           |  <span class="text-danger">font-size: 14px;</span>     |
           +----------/------------+
                   /--
                /--
             /--
+--------------------+
|         h1         |
|      color: gray;  |
|  <span class="text-danger">font-size: 14px;</span>  |
+----------|---------+
           |
           |
           |
+----------|---------+
|     (TextNode)     |
|      color: gray;  |
|  <span class="text-danger">font-size: 14px;</span>  |
+--------------------+
</code><div>Render-Tree</div></pre>

上面的图表是 DOM 树和 CSSOM 树构成 Render-Tree 的结果。如你所见，Render-Tree 选择性的仅保留了会显示在屏幕上的内容作为节点构成这棵树。比如 CSSOM 树中 `p` 元素的属性是 `display: none;`，所以它被排除在 Render-Tree 之外。不过，如果某个元素是 `visibility: hidden;` 或 `opacity: 0;`，这个元素还是会占据屏幕空间，所以同样会出现在 Render-Tree 中。

浏览器提供 DOM API 让开发者可以直接的访问到 DOM 树上的元素，但是没有提供直接操作 CSSOM 的接口。不过介于最终浏览器要合并 DOM 树和 CSSOM 树来创建 Render-Tree，浏览器在 DOM 元素身上暴露了一套高级 API 来让开发者可以操作元素对应的 CSSOM 的 CSS 属性。

## 渲染顺序

现在我们理解了什么是 DOM、CSSOM 和 Render-Tree，下一步就是理解浏览器如何使用它们渲染网页。理解这个过程对于前端开发者设计和开发一个高用户体验和高性能的网站至关重要。

网页加载后，浏览器首先读取 HTML 文本，从中创建 DOM 树。其次浏览器处理行内、内嵌或者外部文件中的 CSS 样式，据此创建 CSSOM 树。在 DOM 树和 CSSOM 树创建完成之后，浏览器接着合并它们，创建 Render-Tree。一旦 Render-Tree 创建完成，浏览器通过下面的步骤开始向屏幕上输出 Render-Tree 中的所有元素。

### 布局操作

首先浏览器为 Render-Tree 中的每一个节点生成布局。生成的布局包括**每个元素的尺寸**以及输出到屏幕上的位置。这个过程中浏览器会计算每个节点的布局信息，所以称作布局操作。这个过程也称作**重排（Reflow）**或**浏览器重排（Browser Reflow）**，当你**滑动滚动条**、**调整窗口大小**或者**操作 DOM 元素**时也会触发重排操作。

> 💡 重排操作会计算页面布局。一个元素进行重排会重新计算它的尺寸和位置关系，并且一个元素的重排会进一步触发其子代元素、父代元素和临近元素的重排。最终重排会导致重绘（Repaint）。重排是很重的操作，但不幸的是重排操作可以被轻易触发。
>
> 下面这些情况都会触发重排操作：
>
> - 插入、移除或更新一个 DOM 元素
> - 修改页面内容，比如修改输入框的文本
> - 移动 DOM 元素
> - 动画操作一个 DOM 元素
> - 测量元素，使用 `offsetHeight` 或 `getComputedStyle`
> - 改变 CSS 属性
> - 改变元素的 Class 属性
> - 添加或移除样式表
> - 调整窗口大小
> - 操作滚动条

### 绘制操作

现在我们有一堆几何图形需要输出到屏幕上。浏览器会给 Render-Tree 中的每个元素创建**图层（Layer）**，来处理这些元素可能会出现的相互覆盖，或者受元素的 CSS 属性的变化而引起的对元素的外观、位置或尺寸的频繁改变。

图层可以让浏览器在网页的生命周期中高效率的执行绘制操作，来处理诸如滚动条动作或调整窗口大小行为造成的重绘。图层也能让浏览器根据元素的 `z-index` 属性正确的根据开发者的意图堆叠元素。

现在我们有图层了，浏览器会合并它们，并且在屏幕上进行绘制。不过浏览器不会一次性绘制所有图层，每个图层会先分开绘制。在每个图层中，浏览器会将所有可见属性填充像素，比如元素的边框、背景颜色、阴影和文本等属性。这个过程也被叫做**删格化（Rasterization）**。浏览器会用不同的**线程**完成删格化过程来提升性能。

> 💡 浏览器对网页中的图层的处理和 **Photoshop** 对图层的处理是类似的。你可以从浏览器的开发者工具中可视化观察图层处理，打开开发者工具，选择“**更多**”选项，然后选择“**图层**”。你也可以在“**渲染**”面板可视化观察图层的边界。删格化通常在 CPU 中完成，这也造成删格化处理缓慢且消耗资源，不过现在有新技术用 GPU 执行删格化过程来强化性能。

### 合成操作

目前为止我们还未在屏幕上绘制任何内容。现在有的是不同的图层的位图，我们需要按照指定的顺序在屏幕上绘制。在**合成**操作中，这些图层会经由 GPU 处理，最终在屏幕上绘制出来。但是将整个图层发送出去绘制是低效的，因为每次**重排（Reflow）**或**重绘（Repaint）**时这个过程都会发生一次。因此，每个图层被分解成不同的**贴图**，然后才被绘制到屏幕上。在浏览器开发者工具的渲染面板中你可以可视化观察到这些贴图。

从上面的信息中，我们可以构建一个路径串联这些事件来描述浏览器如何从网页的 HTML 和 CSS 的文本信息中向屏幕上渲染内容。这个一系列事件也被称作**关键渲染路径（Critical Rendering Path）**。

<pre class="text-center"><code class="d-inline-block mt-0 mb-3 text-start">
    +----------------+   +----------------+   +----------------+
    |       DOM      |   |     CSSOM      |   |   Render-Tree  |
    |  construction  |-> |  construction  |-> |  construction  | --+
    +----------------+   +----------------+   +----------------+   |
                                                                   |
 +-----------------------------------------------------------------+
 |
 |  +----------------+   +----------------+   +----------------+
 |  |     Layout     |   |      Paint     |   |   Compositing  |
 -> |    operation   |-> |    operation   |-> |    operation   |
    +----------------+   +----------------+   +----------------+
</code><div>Critical Rendering Path</div></pre>

## 浏览器引擎

浏览器中的**浏览器引擎（Browser engines）**，也叫做**渲染引擎**或**视图引擎**，负责创建 DOM 树、CSSOM 树，处理渲染逻辑。浏览器引擎中存在所有必要的元素和逻辑来将网页 HTML 代码渲染到屏幕上的实际的像素点。如果你有听过人们在讨论 **WebKit**，实际上人们讨论的是浏览器引擎。**WebKit**是 Apple 的 Safari 浏览器使用的渲染引擎，也是谷歌 Chrome 浏览器曾经使用过的渲染引擎。目前 **Chromium** 项目使用 **Blink** 作为默认渲染印象。

> 下面是流行的浏览器和其使用的渲染引擎。
>
> - IE
>   - Engine: Trident
>   - CSS-prefix: `-ms`
> - Edge
>   - Engine: ~~EdgeHTML~~ → Blink
>   - CSS-prefix: `-ms`
> - Firefox
>   - Engine: Gecko
>   - CSS-prefix: `-moz`
> - Opera
>   - Engine: ~~Presto~~ → Blink
>   - CSS-prefix: `-o` (Presto) and `-webkit` (Blink)
> - Safari
>   - Engine: WebKit
>   - CSS-prefix: `-webkit`
> - Chrome
>   - Engine: ~~WebKit~~ → Blink
>   - CSS-prefix: `-webkit`

## 浏览器的渲染过程

冷知识：JavaScript 实际上是一个注册商标，它的语言标准由 ECMAScript 制定。

JavaScript 存在 V8、Chakra 和 Spider Monkey 等不同的语言引擎，ECMAScript 制定的语言标准让不同的引擎遵守相同的规则，保持 JavaScript 在浏览器、Node 或 Deno 等不同运行环境之下的行为和体验的一致性，这个特性非常有利于面向多平台的 JavaScript 应用的开发。

不过，关于浏览器该如何渲染网页却是另一种情况。HTML、CSS 或 JavaScript 的语言标准由一些实体或组织制定标准。但是，到了关于浏览器该如何管理和渲染网页这块目前还没有任何标准化出现。Chrome 的浏览器引擎可能会采取与 Safari 浏览器引擎不同的方式处理网页。

我们很难预测特定浏览器的渲染顺序和其背后的机制。不过 HTML5 的规格对理论上浏览器该如何做渲染的标准化上做出了一些努力，但浏览器支持这个标准到何种程度完全取决于其自身。

尽管存在如此的不一致性，但是浏览器之间还是存在一些通用原则。

### 解析和外部资源

**解析（Parsing）**是浏览器读取 HTML 内容并且创建 DOM 树的过程。因此这个过程也称作 **DOM 解析（Parsing）**，解析 DOM 的程序叫做 **DOM 解析器（Parser）**。大多数浏览器提供 `DOMParser` 接口从 HTML 代码创建 DOM 树。使用时先创建 `DOMParser` 的实例对象，调用它的 `parseFromString` 方法，我们可以将原始 HTML 代码文本解析为 DOM 树。

```js
const parser = new DOMParser();
// ...
parser.parseFromString("<p>Hello World!</p>", "text/html");
// #document
// <html>
//  ​<head>​</head>​
//  <body>
//    ​<p>​Hello World!​</p>​
//  </body>
// ​</html>​
```

浏览器向网站的服务器发出请求，服务器随之响应请求并返回 HTML 文本，服务器通过将响应 Header 的 `Content-Type` 设为 `text/html` 告诉浏览器响应数据的类型，然后只要 HTML 有部分内容被读取到，浏览器就可以开始**解析**。因此浏览器可以每次一个节点的**增量**创建 DOM 树。由于 HTML 是一个嵌套的树状结构，浏览器会从上而下的解析 HTML 代码。

这个过程表现出来的结果就是，浏览器在后台下载网页内容的时候会逐步解析已经下载完成的内容，所以用户会看到网页的内容依次显示出来——先解析完成的先显示在屏幕上，同时后台在持续下载过程，如果有新的下载完成的部分出现，浏览器会立即将其解析成 DOM 树，并尝试在屏幕上显示出来。

打开开发者工具的**性能**标签页，在 **Timing** 这行可以看到一些**事件**。这些事件是网站的**性能指标**，这些事件**越靠近**并且**出现的越早**，则表示用**户体验**越好。

> 💡 使用性能标签页的刷新按钮可以重新采集性能数据。

来解释一下这些事件。你会看到 `FP` 事件，它的全称是 **First Paint**，意味着从这个时间点开始浏览器开始向屏幕绘制东西了，这时绘制的可能是 `body` 的背景颜色。

`FCP` 的全称是 **First Contentful Paint**，意味着从这个时间点开始浏览器开始绘制网页内容，比如文本和图片。`LCP` 全称为 **Largest Contentful Paint**，意味着从这个时间点开始浏览器已经绘制了大块文本或图片。

> 💡 你可能听过 `FMP`，即 **First Meaningful Paint**，是一个类似 **LCP** 的指标，由于重复已经从 Chrome 中移除了。

`L` 表示 `onload` 事件，发生在 `window` 对象上。`DCL` 表示 `DOMContentLoaded` 事件，发生在 `document` 对象上，但是会向上冒泡到 `window` 对象，因此你也可以在 `window` 上监听这个事件。这些事件稍微复杂一点，一会我们会再讨论它们。

当浏览器遇到外部资源，比如 JavaScript 脚本文件，用 `<link>` 导入的 CSS 文件，一个 `<img>` 元素导入的图片或其他外部资源，浏览器会在后台开始下载对应的文件。这个过程不会影响**主线程**。

`<script>` 元素会阻塞解析。浏览器对 DOM 的解析过程通常只会发生在**主线程**上。所以如果主线程忙碌，DOM 解析就会等待主线程释放。

### 解析阻塞的脚本

**解析阻塞脚本（Parser-blocking Scripts）**是指 JavaScript 脚本代码阻止 HTML 的解析。当浏览器遇到内嵌的 `<script>` 元素，会**优先执行**脚本内容，然后再继续创建 DOM 树。所以所有内嵌到 HTML 的脚本都属于解析阻塞脚本。如果 `<script>` 元素是一个外部脚本文件，浏览器会在后台开始下载这个文件，但是依然会**阻止主线程的执行**直到文件下载结束。这意味着 DOM 树的解析过程在脚本文件下载完之前会一直等待。

一旦脚本文件下载完成，浏览器会首先在主线程执行这个脚本文件，接着继续 DOM 的解析过程。这个过程在浏览器遇到的每个 `<script>` 元素时都会重复一次。或许你要问为什么浏览器要等这些 JavaScript 文件下载和执行？浏览器公开 DOM API 给 JavaScript 意味着我们可以用 JavaScript 访问和操作 DOM 元素。如果浏览器要并行处理 DOM 树解析和脚本执行的话，也就是说有一个线程进行 DOM 解析，另一个线程执行脚本，这里就会出现一个**竞态条件**，因为解析和脚本执行都需要访问和修改 DOM 树。

不过，让 DOM 解析停止转而等待脚本文件的下载在大多数场景来说都是不必要的。因此 HTML5 给 `<script>` 添加了 `async` 属性告诉浏览器这个脚本文件在下载过程中不需要停止 DOM 解析，但是一旦脚本文件下载结束，还是会立即阻止 DOM 继续解析，优先执行这个脚本文件。

同时还有另一个魔法属性 `defer` 与其类似，浏览器在遇到脚本带有这个属性时不会停止 DOM 解析，但与 `async` 的不同之处在于文件下载完成之后也不会立即执行。所有 `defer` 属性的脚本将在浏览器解析完所有 HTML 元素，也就是 DOM 树创建完成之后，按照它们在 HTML 结构中出现的顺序依次执行。

总结：所有普通的脚本无论是内嵌到 HTML 中的还是引用外部文件的都是**解析阻塞**的，因为它们都会阻止继续构建 DOM 树。所有 `async` 脚本，也就是所谓的异步脚本在下载完成之前不会阻塞解析，但是一旦 `async` 脚本下载完成，它们就会变成解析阻塞脚本。然而，`defer` 脚本，也就是所谓的延迟执行脚本，是**非解析阻塞**的，它们在下载时不会阻塞 DOM 树的构建，下载完成后会等到 DOM 树创建完成之后才开始执行。

> 💡 如果一个网页上存在 `async` 和 `defer` 脚本，网页加载后你可以在开发者工具的**性能**标签页观察到 `FP` 和 `FCP` 会非常靠近，因为浏览器不会等待脚本下载完成，而是继续解析 DOM 元素。但是 `LCP` 事件可能会与之前的事件有段间隔，这个间隔的期间 `async` 加载结束开始阻塞 DOM 树构建。
>
> 💡 **解析阻塞**也被引用为**渲染阻塞**，因为渲染在 DOM 树之后才会发生。不过两者之间有一定区别，在稍后我们会继续讨论它们。

一些浏览器引入了**推测解析（Speculative Parsing）**的策略将 HTML 解析（并非 DOM 树构建）的过程卸载到独立的线程中完成，这让浏览器可以更早的读取到 CSS 文件、脚本文件、图片文件并且开始下载这些资源。

假如你有 3 个 `<script>` 依次存在于 HTML，浏览器在结束第一个脚本的加载和执行之前都不会去下载第二个脚本，因为浏览器这时还未读取到第二脚本。你可以给脚本添加 `async` 属性让浏览器同时开始 3 个脚本的下载，但是异步脚本不保证执行的顺序。也就是说先下载完的脚本会被优先执行。这时推测解析将起到作用，这个策略被称作推测解析的原因在于浏览器会推测资源在未来会被加载，所以最好现在就在后台去加载它们。

对于这个情况，推测解析会提前加载 3 个脚本，并且在他们需要执行的时候依次执行脚本。不过如果 JavaScript 操作 DOM 对外部资源进行移除或者隐藏操作的话，就会造成无效的推测，让提前加载的资源派不上用场。

> 💡 每个浏览器都有自己的想法，所以推测解析什么时候发生和会不会发生都是无法保证的。不过你可以用 `<link ref="preload">` 要求浏览器预先加载某些需要的资源。

### 渲染阻塞的 CSS

前面我们提到除了解析阻塞脚本以外，其他的外部资源请求不会阻塞 DOM 解析过程。因此，CSS 不会阻塞 DOM 解析吗？答案是否定的，CSS 会间接阻塞 DOM 解析。这里需要引入渲染过程。

浏览器引擎根据从服务器接收到的 HTML 文本创建 DOM 树。与之相同，浏览器从 HTML 中引入的 CSS 文件或内嵌的 CSS 样式内容中创建 CSSOM 树。DOM 树和 CSSOM 树的创建**同时**发生在主线程上。由它们共同组成的 **Render-Tree** 在 DOM 树构建完成后也会开始增量式地构建。

我们有提到 DOM 树的生成是**增量式**的，也就是说浏览器读取 HTML 后会将新的 DOM 元素添加到 DOM 树上。但是 CSSOM 树不是这个套路。CSSOM 树**无法做到增量式**构建，其必须以特定的方式构建。原因也很简单，因为 CSS 的内容没有嵌套关系，CSS 文件中最后一行的设定有可能覆盖其第一行的设定。如果浏览器按照增量式的创建 CSSOM 树，就有可能由于后面遇到的 CSS 属性**覆盖**了前面的设定，导致同一个 CSSOM 节点更新了多次，其这个更新行为会造成 **Render-Tree** 多次渲染，其最直接的结果就是让用户看到屏幕上的内容因为 CSS 的解析过程一直发生样式的改变，最终变成糟糕的用户体验。由于 CSS 样式属于**层叠式**的，一个规则的变化可能影响到很多元素，增量式创建 CSSOM 树很大可能会造成这种后果。

因此 CSSOM 树只会在所有 CSS 规则都处理完之后被更新。而一旦 CSSOM 树更新完，接着就会去更新 **Render-Tree** 将结果渲染到屏幕上。

所以 CSS 是渲染阻塞资源。一旦浏览器请求了外部样式表，**Render-Tree** 的构建就会被停止。这会导致**关键渲染路径**卡住，屏幕上不会渲染任何内容。但是 DOM 树的构建不受影响，在 CSS 文件下载过程中会继续构建过程。

浏览器如果在 HTML 增量式解析到足够开始向屏幕渲染东西时就使用 CSSOM 树的某个时间点的状态来生成 Render-Tree 的话，会有一个巨大的弊端，这种情况一旦 CSS 下载完并解析后，CSSOM 就会被更新，这会让 Render-Tree 同步更新造成重绘，最终导致无样式的元素闪烁，带来很糟糕的用户体验。

因此浏览器在 CSS 文件下载和解析结束之前会一直等待。一旦样式解析了，CSSOM 得到更新，Render-Tree 同步更新，然后关键渲染路径解锁，让 Render-Tree 在屏幕上开始绘制元素。也正因如此，外部 CSS 越早加载越好，通常在 `head` 标签内加载最好。

让我们来设想这样一个场景。浏览器开始解析 HTML 了，它遇到一个外部 CSS 文件。浏览器阻塞关键渲染路径，开始在后台下载这个文件，然后继续 DOM 解析。但是当浏览器遇到 `<script>` 标签，它阻塞 DOM 解析，开始下载外部脚本文件。现在浏览器主线程空闲，等待 CSS 文件和 JS 文件的下载。

这时，外部 JS 文件下载结束了，但是 CSS 文件仍然在后台继续下载。浏览器应该开始执行这个脚本文件吗？继续执行的话会造成什么弊端？

浏览器通过在 DOM 元素上暴露 `style` 对象提供一套操作 CSSOM 的高级 API 让 JavaScript 可以对其进行操作。比如你可以读取和修改 `elem.style.backgroundColor` 属性来获取和修改元素的背景色。

如果 CSS 仍然在后台下载，但 JavaScript 不受影响可以在主线程开始执行的话，这时我们通过 JavaScript 访问 DOM 元素的 CSS 属性，将会得到 CSSOM 当前状态下的值。一旦 CSS 下载解析结束，造成 CSSOM 更新，我们之前拿到的值就已经不是最新的值了。基于这个原因，在 CSS 还在下载时开始执行 JavaScript 脚本是不安全的。

根据 HTML5 规格，浏览器可以下载脚本文件，但是在之前出现的所有 CSS 文件解析结束之前都不应该开始执行脚本。而 CSS 文件阻塞脚本的执行时，这个文件就变成了**脚本阻塞 CSS** 了。

> 💡 `<script>` 标签有 `async` 和 `defer` 属性告诉浏览器**不要阻塞解析**，外部 CSS 文件也可以使用 `media` 属性告诉浏览器**不要阻塞渲染**。浏览器会根据 `media` 属性的值来智能的决定何时加载这个 CSS。

### document 的 `DOMContentLoaded` 事件

`DOMContentLoaded` （**DCL**）事件表示浏览器读取完了 HTML，并且完成了 DOM 树的创建。不过有很多因素会改变 `DCL` 事件发生的时间点。

假如我们的 HTML 不存在任何脚本，DOM 解析过程就不会被阻塞，`DCL` 事件会在浏览器解析完整个 HTML 后立即发生。不过如果 HTML 中存在任何解析阻塞的脚本，`DCL` 会在所有这些脚本下载执行结束之后发生。

当把 CSS 文件纳入考虑的范围时，事情就更加复杂了。就算 HTML 没有任何外部脚本，`DCL` 仍然会等到 CSS 加载结束才会发生。原因在于 `DCL` 表示 DOM 树准备好了，但是如果 CSSOM 没有构建完成，任何对 DOM 元素的 CSS 信息的访问都是不安全的。因此大部分浏览器会等待所有外部 CSS 文件的加载和解析。

结果就是脚本阻塞的 CSS 显然会推迟 `DCL` 事件。DOM 树在 CSS 加载完成之前不会构建结束。

`DCL` 是网站性能指标之一，对其的优化目标是越早出现越好。最佳实践其一是尽可能给 `<script>` 设定 `defer` 或 `async` 属性让其不要阻塞 HTML 的解析，其二是优化**脚本阻塞**和**渲染阻塞**的 CSS。

### window 的 `load` 事件

JavaScript 会阻塞 DOM 树的生成，而 CSS 和图片、视频等外部文件不会阻塞。`DOMContentLoaded` 事件标记 DOM 树完全创建完成并且可以安全访问的时间点，`window.onload` 则标记外部 CSS 和文件都下载完成，应用结束所有下载的时间点。

> ✏️ 这里本来应该还有一个例子，准备一个网页加载几个 JS、CSS 和一些图片，然后看看 Performance 下 `FP`，`FCP`，`DCL` 以及 `load` 事件发生的顺序和时机。然后观察 3 个 JS 分别需要 3 秒、6 秒和 9 秒下载，按照浏览器读取 HTML 的顺序一共需要 **18 秒**来完成下载，但是又发现浏览器采用了**推测解析**的方法提前下载了 JS 文件，最终下载脚本的时间只用了 **9 秒**。然后第 **9.1** 秒 `DCL` 发生了。这时还有一些图片文件还在下载，到了第 10 秒它们都下载结束了，第 **10.2 秒** window 上 `load` 事件发生了。到此为止页面加载结束了。

后来又觉得没有必要了，你现在看的网页就是一个很好的例子，你可以打开开发者控制台，切到性能标签页，点击标签页左上角的刷新图标，等页面加载结束，再观察一下各种事件发生的情况吧！

## Reference

这篇文章主要对下面资料进行了整理和翻译。

- [How the browser renders a web page? — DOM, CSSOM, and Rendering](https://medium.com/jspoint/how-the-browser-renders-a-web-page-dom-cssom-and-rendering-df10531c9969)

下面是一些拓展资料。

- [How the browser renders HTM & CSS](https://medium.com/@mustafa.abdelmogoud/how-the-browser-renders-html-css-27920d8ccaa6)
- [HTML DOM nodeType Property](https://www.w3schools.com/jsref/prop_node_nodetype.asp)
- [An Introduction and Guide to the CSS Object Model (CSSOM)](https://css-tricks.com/an-introduction-and-guide-to-the-css-object-model-cssom/)
- [Working with the new CSS Typed Object Model](https://developers.google.com/web/updates/2018/03/cssom)
- [Avoid Large, Complex Layouts and Layout Thrashing](https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing)
- [Inside look at modern web browser (part 3) ](https://developers.google.com/web/updates/2018/09/inside-browser-part3)
