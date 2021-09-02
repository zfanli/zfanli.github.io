---
title: 用 Python 实现一个简单的 RESTful API 服务器
date: "2018-07-14T12:17:37Z"
tags:
  - Python
  - REST
  - Flask
---

REST 是表现层状态转移的缩写，虽然名称不好理解，但这是一个简单并且实用的概念。

```
REST : REpresentational State Transfer
```

RESTful API 关注下面三点：

1. URL 定义资源位置
2. HTML 动词定义对资源的操作
3. 返回状态码定义操作的结果

<!-- more -->

REST 的概念翻译成通俗易懂的人类语言大概是这样的：

- 第一步，告诉你我要的资源（URL），
- 第二步，告诉你我要对这个资源做什么（GET、POST、UPDATE、DELETE），
- 最后，你告诉我结果（状态码和响应内容）。

是不是感觉对要做的事情描述得很清晰？这就是 REST 要达到的效果。接下来我们来实现一个 RESTful API 的服务器，我给它命名为 `MaruCat`，这是我家猫的名字。

这个服务器将基于 Python 的 `Flask` 框架来实现，我们将一步一步详细的记录每一个步骤，同时记录遇到的所有问题和这些问题的解决方法。让我们开始吧。

## Hello?

我们先尝试一下 Flask 框架的威力。

我们先创建如下的目录结构：

```
root
├── marucat_app
│   └── __init__.py
└── run.py
```

可以看到项目中有一个 `marucat_app` 包，主要的代码都放在这里。这个包之外还有一个 `run.py` 文件，我们将其定义其为程序的入口，启动的位置。并且为了方便调试，`run.py` 文件将以 DEBUG 模式启动开发服务器。

这是这个文件的所有内容：

```python
from marucat_app import app

app.run(debug=True)
```

我们从 `marucat_app` 包导入 app 实例（这个实例将在稍后说明），以 DEBUG 模式运行它。

先不急着运行，为了尝试 Flask 的威力，我们先准备一个 Hello 场景。

假设一个场景，我们要实现这个需求：

**访问（GET）根目录（'/'）时，得到一个问候信息，这个信息需要是 JSON 格式的，并且指定返回类型为 JSON。**

这其实是一个最简单的 REST API，我们可以想象 request 头第一行会是这样的：

```http
GET / HTTP/1.1
```

解释一下：我们将对位于 `/` 的资源进行 HTML 动词的 `GET` 操作，即我们想获得根目录所代表的资源。

所以在服务器这边，我们其实要做这些事：

- 给根路径（'/'）绑定一个路由
- 这个路由需要返回一个 JSON 对象
- 并且 Response 对象需要声明自己是 JSON 类型的（即 `Content-Type` 声明）

> Response 对象声明 `Content-Type` 是为了向请求资源的人描述 Response Body 的格式。

在 Flask 中要做这些事情是很简单的。回到我们的文件结构，在 `marucat_app` 包中有一个 `__init__.py` 文件，我们就把这个 Hello 场景放在这里吧。

使用 Flask 框架，首先需要一个实例化的 Flask 对象，其后的所有操作都将通过这个对象来进行。我们要对这个对象绑定路由，来决定什么情况下返回什么，而除此之外的细节都由框架帮我们处理了。

这是一个最简单的例子：

```python
from flask import Flask, jsonify

app = Flask('marucat_app')


@app.route('/')
def hello():
    return jsonify({'message': 'Hello'})


```

我们从 flask 包中导入 `Flask` 类和 `jsonify` 函数。先创建一个 Flask 对象，因为之后的操作都将围绕这个对象进行。实例化 Flask 对象时需要提供一个参数作为识别符，通常情况下我们把 `__name__` 作为识别符。

不过，官方文档提示第一个参数的设置分两种情况：

> 1）使用单独 module 时通常将 `__name__` 作为第一个参数；2）使用 package 时通常将 package 名硬编码作为第一个参数。究其原因，一部分 Flask 扩展将根据这个识别符来追踪 DEBUG 信息，设置不当的话会造成丢失 DEBUG 信息。

我们的文件结构 app 存在于 `marucat_app` 包里，我们直接将 'marucat_app' 作为第一个参数。

```python
app = Flask('marucat_app')
```

接下来创建一个 `Hello` 函数，直接返回问候信息。问候信息是一个字典对象，使用 `jsonify` 函数将其转成 JSON 字符串再返回。

```python
def hello():
    return jsonify({'message': 'Hello'})
```

最后，将 `Hello` 函数绑定在根路径（'/'）上，Flask 让我们可以使用装饰器的方式简单的绑定路由。在 `Hello` 函数上插入装饰器 `@app.route('/')` 。

```python
@app.route('/')
def hello():
    return jsonify({'message': 'Hello'})
```

现在，这个简单的例子已经可以运行了，来试试看！

我们可以在 IDE 中配置执行脚本，直接执行 `run.py` 就可以把这个 app 跑起来。或者使用命令行，输入下面的命令，效果是一样的。

```shell
$ python run.py
```

键入上面的命令后，我们会看到类似下面的输出。

```shell
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 274-620-182
```

现在 app 已经在 DEBUG 模式下运行了，可以通过 `http://127.0.0.1:5000/` 访问，我们来试试看。

```shell
$ curl http://127.0.0.1:5000/
{
  "message": "Hello"
}
```

我们打开一个新的命令行界面，使用 curl 访问服务器跟路径，接着我们就得到了预设的问候信息。同时在运行服务器的命令行界面上我们看到如下反馈。

```shell
127.0.0.1 - - [31/May/2018 16:12:03] "GET / HTTP/1.1" 200 -
```

同样我们也可以直接打开浏览器访问。在浏览器中访问根路径，JSON 格式的问候信息将直接显示在页面上。

我们在浏览器中打开开发者工具，切换到 Network 标签（Chrome 浏览器下），在这里可以看到我们访问根路径时得到的 Response 信息（如果你没看到，那就在打开开发者工具的情况下再访问一次根路径）。

这是我得到的一个 Response 头信息。

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 20
Server: Werkzeug/0.14.1 Python/3.6.4
Date: Thu, 31 May 2018 08:24:04 GMT
```

可以看到我们简单的达到了目标。需要注意的是 `jsonify` 自动帮我们把 `Content-Type` 设定成了 JSON。

我们也可以手动做这一步，下面是一个例子，在没有使用 flask 的 `jsonify` 函数的情况下我们怎么设置 response 的头信息。

在这里我设置了 `Content-Type`，这只是一个例子，用这个方法我们可以设置任何想要的头信息。Flask 为我们提供了一个定制 Response 对象的方法，`make_response`。

先看看修改后的代码。

```python
from flask import Flask, make_response
from json import dumps


CONTENT_TYPE = 'Content-Type'
JSON_TYPE = 'application/json'


app = Flask('marucat_app')


@app.route('/')
def hello():
    resp = make_response(dumps({'message': 'Hello'}), 201)
    resp.headers[CONTENT_TYPE] = JSON_TYPE
    return resp


```

与之前不同，这次我们返回一个定制过的 response 对象。从 flask 包中导入 `make_response` 函数，这个函数可以生成一个 response 对象。它接受几个参数，一般我们传递两个参数给它，第一个是 response 的数据，第二个是返回状态码。

之前我们并没有显式的设置过状态码，因为默认将发送 `200` 状态码。这次我们将状态码设置成 `201`，等会看看效果。

```python
resp = make_response(dumps({'message': 'Hello'}), 201)
```

我们拿到 `resp` 这个对象后，就可以给它设置 header 了。

为了方便使用，我们先将 `Content-Type` 设置为常量。

```python
CONTENT_TYPE = 'Content-Type'
JSON_TYPE = 'application/json'
```

接着，给 `resp` 设置 header。

```python
resp.headers[CONTENT_TYPE] = JSON_TYPE
```

到此基本搞定，我们再来跑跑看。重新打开服务器，如果你没有关闭的话，等服务器 reload 完成。在浏览器中打开开发者工具，访问 app 的地址根路径。

```json
{ "message": "Hello" }
```

页面上显示了我们设定的结果，再看看 Response 头信息。

```http
HTTP/1.0 201 CREATED
Content-Type: application/json
Content-Length: 20
Server: Werkzeug/0.14.1 Python/3.6.4
Date: Thu, 31 May 2018 09:02:34 GMT
```

注意我们通过自定义 response 的头信息实现了下面两点：

1. 状态码返回了 201
2. `Content-Type` 声明了 JSON 类型

我们完成了 Hello 的需求。虽然上面碎碎念了这么多，但其实我们仅使用了 10 行代码就完成了一个 app 的构建。

### 小结

到目前为止，我们先做一个小结。

我们实现了一个 Hello 场景，创建了一个最简单的问候语 API。依此来了解了 Flask 框架的基本用法，以及 REST API 的概念。

这些内容可以总结如下：

- Flask 框架的使用从实例化 `Flask` 对象开始
- 使用装饰器 `@app.route(path)` 来绑定路由
- 路由可以是一个函数，返回一个字符串或者 response 对象
- 如果路由函数返回一个字符串，response 头信息的 `Content-Type` 默认为 `text/html`
- 如果不设定返回的状态码，路由函数默认返回 `200` 状态码
- Flask 提供 `make_response` 函数来定制 response 对象
- response 对象定制可以设定响应内容、状态码和响应头信息

## 番外

插播几个番外。

### 设计模式问题

数据库目前选择的是 MongoDB，但是也要确保以后更换数据库的情况不产生影响，所以数据库相关的部分单独提出来，放在一个子 package 里。对外部来说仅导入这个包，使用里面的 `factory` 方法获得需要的数据库访问 `Helper` 就足够了。

假定 `Helper` 一定会返回正确的数据，外部不需要关注 `Helper` 的实现。这样就能不产生负面影响的情况下更换数据库。这个模式有很多种实现，在 Java 中这叫面向接口编程。

大致概念如下：

- 定义接口
- 外部和内部并行开发
- 外部只需调用接口不关注具体实例对象
- 内部只需实现接口不限制技术细节

不过在 Python 中没有类似的设计模式。

我在一番搜索之下找到一个很棒的库，介绍 Python 的各种设计模式。

[https://github.com/faif/python-patterns](https://github.com/faif/python-patterns)

在其中我找到了一个合适的设计模式，`Bridge Pattern`。

概念总结一下，对外和对内的处理基本稍有些差异。大致如下：

- 用一个类 A 作为桥梁
- 实例化 A 时将具体的实现类对象 B 作为参数传进去
- A 的内部定义类所有接口方法，在这些方法中调用 B 相对应的方法并返回结果
- 指定一个实现类对象 B 来实例化一个 A 的对象，这个 A 的对象作为 Helper 暴露出去
- A 不关注 B 的细节，只要 B 拥有 A 所定义的所有对应的方法

没有大差，但是 Python 下稍有点麻烦。不过路算是疏通路。

### logging 问题

路由的绑定根据路径分成几个文件定义。在分割文件的过程中，每个文件都需要实例化一个 `blueprint` 对象，由此来完成路由绑定操作。

这些 `blueprint` 对象最终会注册在应用实例化的 Flask 对象上。由此就有一个问题，logger 对象只能从 Flask 的实例对象上访问。

这玩意传递都不好搞，flask 有一个 `current_app` 功能对象可以获得当前的实例化 app 对象。但是 `current_app` 使用的前提是 Flask 实例化的 app 对象调用了 `app_context` 方法创建了上下文，并且把 logger 传到上下文里去。

目前的几次尝试都没有成功，对 flask 的 logging 理解还不深入。但是失败几次转换思路后，我开始重新思考需求。

- `blueprint` 中记录跟踪信息和错误信息，并且为了保持 log 的连贯性，要将其和 flask 内部 logger 输出到同一个地方。

一开始的思路是拿同一个 logger 输出就能把 log 打到同一个地方。仔细想想，并非如此，flask 内部 logger 默认情况下会把所有 log 输出到 console。所以我的目的应该是将 `blueprint` 的 log 信息同样输出到 console 就可以了。

结论：普通的 logger 就足够了。

所以最后还是直接从 logging 包拿到一个 logger 直接输出 log 信息了。

中途疏通花了挺长时间，或许再坚持一下一开始的思路说不定也是可以走通的，但是方向却是一开始就走偏了。不过这个过程也更深入的了解到了 flask 的 logging 机制，其实默认的 logger 就是普通的 logging 包拿到的 logger 对象。

我们在实例化之前对 logging 包设定 `baseConfig` 或者 `dictConfig`，这也会对 log 产生影响。到此这条路也是被疏通了。

### 处理异常 Code

客户端请求的一个路径可能不存在，或者请求一个路径使用的 method 可能是不被允许的。总有各种各种错误会在服务的中间出现，我们要处理这些错误。

flask 使用 Werkzeug 发布应用，这个库默认帮我们处理了这些错误。但是如果你尝试一下就会发现，当错误发生时 response 会得到一个描述错误信息的页面。

通常这没什么问题，用户看到这些信息后就知道发生什么了。但是 MaruCat 只是一个 REST API 提供者，用户不是人类而是消费这些 API 的前端服务器。仅需要一个 code 就足以让服务器明白发生了什么，我们需要自定义这些错误处理。而在 flask 中做到这一切非常容易。

下面是一个处理 404 的例子，我们仅需要返回一个 code 就足够了。

```python
from werkzeug.exceptions import NotFound


@app.errorhandler(NotFound)
def not_found(error):
    return '', 404
```

也没什么好解释的，注意这个方法需要接受一个 `exception` 的参数，如果不接受参数在运行时会抛错误的。这个 `exception` 有几个可访问的属性，在特定时候需要用到。以上面函数接受的参数名 `error` 为例。

```python
# 错误状态码 e.g. 400
error.code
# 错误名 e.g. NOT FOUND
error.name
# 错误信息
error.description
```

处理其他 code 的套路是一样的。这条路被疏通了。
