---
layout:     post
title:      "Reading List"
subtitle:   "一些近期需要阅读的文档，这里记载文档地址和阅读的进度。"
date:       2018-02-01 23:28:57 +0800
author:     "Rick"
header-img: "img/post-bg/sunshine-dog.jpg"
catalog:    true
class:      "study"
stickies:   false
tags:
    - Read List
---

### 清单
***

最近需要了解很多东西，但不像之前阅读的Spring相关文档那样，这次阅读的东西很多都是可以马上用得上的，敲个几行代码就能利用到这些特性。

这个清单本来不应该发在这个板块，但是新的Blog还没构建完成，没必要花时间去弄个时间线那样的UI了，到时候迁移Blog的时候可以做一个List的UI专门给ToDo List或者Reading List。

废话也不多说，介绍一下这次看的文档。

依旧英文文档为主，这次弄了几个Chrome的划词插件，看起来应该比上次要轻松很多。

这次的目标是重构Blog需要用的模块，包含前端和后台部分。

当然选择工具也不太可能一次正好选中最合适的，相同模块可能会阅读多个工具的文档，然后选择更好的一个。

**提醒自己适度做些笔记。**

这次使用Python构建，前端目前预期是用React，DB采用noSql的MongoDB。

大致是Flask的RESTful框架，ORM应该是pymongo，加上前端就完成了。

下面贴地址和进度。

### 文档 List
***

**Update time: 2018-02-05 01:38:19**


>[M101P: MongoDB for Developers](https://university.mongodb.com/courses/M101P/about)

MongoDB开发者Tutorial。

**进度：基础（可以使用）**

MongoDB官方的教程要预约还有deadline...~~然感觉很良心...但是英语+deadline有点...~~

~~先看看情况再说。~~

[Introduction to MongoDB](https://docs.mongodb.com/manual/introduction/)

官方技术文档。

[MongoDB简介](http://docs.mongoing.com/introduction.html)

中文社区汉化的技术文档，低0.2个版本，还是以英文文档为主，中文文档做参考。


>[Flask Quickstart](http://flask.pocoo.org/docs/0.12/quickstart/)

Flask的Quickstart，然后转战RESTful。

**进度：基础（可以使用）**

[Flask-RESTPlus](http://flask-restplus.readthedocs.io/en/latest/quickstart.html)

RESTful的API实现还是使用Flask的扩展，选择RESTPlus的原因是可以使用装饰器`route(url)`映射，flask-restful看到目前还是只能使用`app.add_resource(cls, url)`绑定路径。

>[Tutorial: Intro To React](https://reactjs.org/tutorial/tutorial.html)

React的官方教程。这个可以用来构建Event-Driven的UI，也可以做服务器，但是服务器用的是Node.js，先mark一下，考虑REST的customer做成什么形式的

**进度：开头**

（阅读新文档开始的时候再补充地址和进度）



