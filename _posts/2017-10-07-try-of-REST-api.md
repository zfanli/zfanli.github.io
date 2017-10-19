---
layout:     post
title:      "REST api 的尝试"
subtitle:   "REST 的简单尝试和记录。内容涉及 REST 的介绍，设计简单 api ，并在 spring MVC 中实现它，最后在浏览器使用 ajax 验证。"
date:       2017-10-7 13:07:00 +0800
author:     "Rick"
header-img: "img/post-bg/sunshine-dog.jpg"
catalog:    true
tags:
    - REST
    - 笔记
    - 正则表达式
---

### REST?
***

REST（Representational State Transfer），表述性状态转移。

`Representational` ：资源表述的形式。例如 JSON 和 XML 等。

`State Transfer` ：资源状态转移。从一个应用转移到另一个应用。例如从服务器的 User 实体对象转移到终端的 JSON 资源。

实现 REST 可以很好的分离前端和后端。尤其是有多套前端实现（Web、iOS、Android）的情况。让服务器只承担服务者的工作，展现形式交由前端发挥。

### REST api 关注什么？
***

关注下面三个点。

* `URL` REST 使用 URL 对资源进行识别和定位。URL 表示需要什么。
* `Http method` REST 的行为通过 HTTP 方法（例如：GET、POST、DELETE、PUT）定义。方法表示做什么。
* `Status code` REST 用 HTTP 状态码告知结果。状态码表示结果。

### Spring MVC 对 REST 的支持
***

**Controller 可以处理所有 HTTP 方法**

`@RequestMapping` 注解中的 method 可以指定所有 HTTP 方法。这使得我们可以指定针对什么方法的请求作出响应

```java
@RequestMapping(value = "/path", method = RequestMethod.GET)

// RequestMethod 如下
public enum RequestMethod {

	GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS, TRACE

}
```

**@ResponseBody 和 HttpMethodConverter 实现可以将对象作为资源发送给客户端**

在类路径中加入 JSON 的依赖，HttpMethodConverter 或自动加载 JSON 解析器。

```xml
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-core</artifactId>
      <version>2.9.1</version>
    </dependency>

    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-annotations</artifactId>
      <version>2.9.1</version>
    </dependency>

    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-databind</artifactId>
      <version>2.9.1</version>
    </dependency>
```

下面是处理请求并发送 JSON 格式资源给客户端的示例。

```java
    @RequestMapping(value = "/target", 
        method = RequestMethod.GET, 
        produces = "application/json")
    public @ResponseBody Target getTarget(@RequestParam(value = "id") int id) {
        // get the target object by id
        Target target = Respository.getTargetById(id);
        return target;
    }
```

这个方法可以处理路径为`host/target`的 GET 请求，并使用 produces 属性进一步限制只对接收 JSON 资源的请求进行响应。这个方法接收一个名为`id`的查询参数。返回类型前的`@ResponseBody`注解告诉消息转换器将返回的对象作为资源（这里是JSON）发送给客户端。

**@RequestBody 和 HttpMethodConverter 实现可以将客户端发来的资源转换为对象处理**

以 JSON 为例，同样需求上面的 JSON 依赖。

下面是接收客户端数据并作出响应的示例。

```java
    @RequestMapping(value = "/target", 
        method = RequestMethod.POST, 
        consumes = "application/json")
    public @ResponseBody Target addTarget(@RequestBody Target target){
        // save the target object
        Target target = Respository.addTarget(target);
        return Target;
    }
```

这个方法可以处理路径为`host/target`的 POST 请求，并使用 consumes 属性进一步限制只对数据为 JSON 格式的请求进行响应。参数前的`@RequestBody`注解可以告诉消息转换器将请求中的数据转换为 Target 对象。这里我们处理结束之后使用`@ResponseBody`注解将加工后的 target 对象作为资源再返回给客户端。

针对上面提到的两种注解，`@ResponseBody`和`@RequestBody`，Spring MVC 还提供了 `@RestController` 注解来标记控制器类让其中的所有方法都应用信息转换功能。我们不必再手动添加`@ResponseBody`和`@RequestBody`注解了。

所以上面的方法会变成下面这样。

```java
@RestController
public class TargetRestController {

    @RequestMapping(value = "/target", 
        method = RequestMethod.GET, 
        produces = "application/json")
    public Target getTarget(@RequestParam(value = "id") int id) {
        // get the target object by id
        Target target = Respository.getTargetById(id);
        return target;
    }

    @RequestMapping(value = "/target", 
        method = RequestMethod.POST, 
        consumes = "application/json")
    public Target addTarget(Target target){
        // save the target object
        Target target = Respository.addTarget(target);
        return Target;
    }
}
```

怎么样，是不是清爽了很多？

**返回 ResponseEntity 对象自定义响应**

上面的配置已经能让我们接收数据和发送资源了。但是这还不够，考虑一下下面的情况。

如果一切正常， getTarget() 方法会返回一个客户端预期的资源，同时响应中默认的 HTTP 状态码会是 200（OK）。这没什么问题，但是在 addTarget() 方法中，在成功保存了一个对象时，我们更希望响应中的状态码为 201 （CREATED），这样就显得更准确了。或者如果我们在保存对象或者查询对象的过程中出现了异常，这使得到的结果可能会是一个 null，由于我们没有做任何异常处理或者是错误检查（这个后面会提到），我们的控制器会返回一个 null 给客户端并且响应中的状态码依然是 200，这不太对。

我们需要定制 Response，定义我们认为准确的状态码，这时候就要用到 ResponseEntity 对象了。

下面这个控制器将完善 addTarget() 方法，它正常结束并且返回状态码 201。

```java
@RestController
public class TargetRestController {

    @RequestMapping(value = "/target", 
        method = RequestMethod.POST, 
        consumes = "application/json")
    public ResponseEntity<Target> addTarget(Target target){
        // save the target object
        Target target = Respository.addTarget(target);
        return new ResponseEntity<Target>(target, HttpStatus.CREATED);
    }
}
```

其实如果只是想自定义一个状态码，下面这个更为简洁。

```java
@RestController
public class TargetRestController {

    @RequestMapping(value = "/target", 
        method = RequestMethod.POST, 
        consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public Target addTarget(Target target){
        // save the target object
        Target target = Respository.addTarget(target);
        return Target;
    }
}
```

但是这并不意味着 ResponseEntity 没有意义。不，正相反，它的用处可大了。还是 addTarget() 方法，按照 REST 的思想，我们在保存了 target 对象之后最好再把访问这个对象的 URL 也一并发送给客户端，这样客户端就知道下一步怎么做了。那要怎么实现呢？

我们可以把 URL 存到响应的 header 中。首先我们告诉 spring 把当前的地址通过参数的形式传递给我们，简单的添加一个接收参数并指定类型为 UriComponentBuilder，这样我们就可以获得当前的地址了。接下里一切都好办了，下面的控制器将访问保存之后的 target 的路径储存在了响应的 header 中以让客户端接收。

```java
@RestController
public class TargetRestController {

    @RequestMapping(value = "/target", 
        method = RequestMethod.POST, 
        consumes = "application/json")
    public ResponseEntity<Target> addTarget(Target target, UriComponentBuilder ucb){
        // save the target object
        Target target = Respository.addTarget(target);
        HttpHeaders headers = new HttpHeaders();
        URI locationUri = ubc.path("/target").queryParam("id", target.getId()).build().toUri();
        headers.setLocation(locationUri);
        ResponseEntity<Target> responseEntity = new ResponseEntity<>(target, headers, HttpStatus.CREATED);
        return responseEntity;
    }
}
```

UriComponentBuilder 的用法并不复杂，我们使用 `.path("URL")` 方法将路径的后缀添加到根路径上，由于我们使用了查询参数来传递需要查询的 Target 的 id，所以使用 `.queryParam("key", "value")` 方法把查询参数连接到地址上。

这样客户端就可以从 header 中得到访问这个资源的地址了。

嗯，到此我们简单的 REST api 差不多就完成了，具体怎么获得和保存对象不在本文的讨论范围内，如果你没有合适的环境测试，你也可以写个假的方法返回一个对象来进行下面的测试。

哦，对了，在此之前还要说一下异常捕获和响应错误状态码。其实没有什么需要说的，和 spring MVC 下普通的异常处理一样。相信大家看看下面这个示例就了解了，这里就不多做解释了，注意返回类型即可。

```java
    @ExceptionHandler(targetException.class)
    public ResponseEntity<Error> error() {
        // do somethings with error object
        return new ResponseEntity<>(error,HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(targetNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public @ResponseBody Error notFoundError() {
        // do somethings with error object
        return error;
    }
    
```


### 测试 REST api 的使用
***

API 是实现好了，总归需要被使用。但是在这之前我们先看看 Target 类的内部。

```java
public class Target {


    private int id;

    private String realName;

    private String nickName;

    private int age;

    private String password;
    
    // setter and getter
    
}
```

很简单的一个实体类，现在我们看看怎么使用 REST api 来获得资源。

顺便一提，由于我同时也使用了 spring Security 框架，所以会包含一些 Security 相关的配置。

**首先来看看如何获取 Target 资源**

获取资源相对简单，因为 GET 方法在 Security 中不需要提供 CSRF token，我们可以简单的使用 ajax 来请求资源。

假设我们需要在下面这个路径请求资源，而这个路径默认显示主页。（假设它就是显示主页）

> https://10.0.0.26:8443/

我们将使用到 JQuery 去发送 ajax 请求。（因为方便呀！）

所以把 JQuery 的依赖写进 HTML 中去。（或者JSP，保证上面的路径下面访问的页面加载了 JQuery 即可）

本地引用或者在线引用都行，也可以使用下面的 CDN。

```html
    <script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
```

OK，一切就绪，我们现在已经到了根路径下，这个路径映射到了我们网站的主页，主页又加载了 JQuery，所以我们可以使用下面的 js 来请求资源了。

```javascript
$.ajax({
    url:"target?id=10013",
    type:"GET",
    dataType:"json",
    success:function(result){
        $("body").html(JSON.stringify(result));
    }
});
```

我们使用相对路径向 target 发出了 GET 请求，实际上接收到请求的路径应该是下面这样。

> https://10.0.0.26:8443/target

我们的请求还有一个查询参数，告诉服务器我们要查找 id 为 10013 的 target 资源。`dataType`属性告诉服务器我们接收 JSON 格式的资源。这符合我们的 api 规范，很好，服务器响应了，并且将需要的资源发送给了我们。我在 ajax 的回调函数里面把服务器响应的资源写到了 body 上，所以我们可以看到画面上显示了下面的信息。

> {"id":10013,"realName":null,"nickName":"nan","age":31,"password":"asd24698"}

很好，成功了，数据和我们数据库的一致。我们再来看看请求和响应的信息。

```text
// Request header
GET /target?id=10013 HTTP/1.1
Host: 10.0.0.26:8443
Connection: keep-alive
Accept: application/json, text/javascript, */*; q=0.01
X-Requested-With: XMLHttpRequest
User-Agent: (too long so let's omit it)
Referer: https://10.0.0.26:8443/
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.8
Cookie: (too long so let's omit it)

// Response header
HTTP/1.1 200
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Strict-Transport-Security: max-age=31536000 ; includeSubDomains
X-Frame-Options: DENY
Content-Type: application/json;charset=UTF-8
Transfer-Encoding: chunked
Date: Sun, 08 Oct 2017 15:55:34 GMT
```

可以看到请求中我们声明接收 JSON 格式的资源，响应中确实给了我们预期的资源。状态码也 OK，一切都很正常。下面我们先看看异常处理时的结果如何。

下面同样的请求，我们事先将 id 为 10013 的 target 删除，这样这个请求就必定会抛出一个异常告诉服务器找不到资源。注意下面的回调函数，上面的示例请求成功所以我们使用 success 来定义资源请求成功后该做什么，但是下面的请求必将失败，我们换用 error 来定义请求失败后做什么。这里我们还是将相应的内容输出在 body 上。

```javascript
$.ajax({
    url:"target?id=10013",
    type:"GET",
    dataType:"json",
    error:function(xhr){
        $("body").html(xhr.responseText);
    }
});
```

执行代码，我们得到了下面的结果。

> {"message":"Not Found.","id":5}

这和我定义的错误信息一致。我们继续看一下 header 信息。

```text
// Request header
GET /target?id=10013 HTTP/1.1
Host: 10.0.0.26:8443
Connection: keep-alive
Accept: application/json, text/javascript, */*; q=0.01
X-Requested-With: XMLHttpRequest
User-Agent: (too long so let's omit it)
Referer: https://10.0.0.26:8443/
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.8
Cookie: (too long so let's omit it)

// Response header
HTTP/1.1 404
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Strict-Transport-Security: max-age=31536000 ; includeSubDomains
X-Frame-Options: DENY
Content-Type: application/json;charset=UTF-8
Transfer-Encoding: chunked
Date: Sun, 08 Oct 2017 15:57:36 GMT
```

我们定义的状态码 404 也起作用了。我们的第一个 api 成功了。接下来我们看看第二个。

**保存并获取 Target 资源**

在第二个 api 中我们保存一个 Target 对象到数据库中，并且将保存后的对象返回给客户端，同时我们还将访问这个资源的 URI 也写进了响应的 header 中，让我们来看看怎么使用这个 api。

如果仅仅在上面的方法上稍作修改就去使用的话，我们会得到 403 错误。这是因为我们同时使用了 Security 框架，并且对 POST 请求要求验证通过 CSRF token，否则服务器将拒绝我们的请求。那么问题来了，CSRF token 从哪儿获得呢？

如果你使用的是 JSP 页面的话，这一点很容易做到，简单的在表单中添加下面的 hidden 项目，我们将自动获得 CSRF token。

```html
<input type="hidden"
	name="${_csrf.parameterName}"
	value="${_csrf.token}"/>
```

我们可能要将 token 放在 header 中，可能我们还需要 key 的名称。在 HTML 的`<head>`标签内加入下面的标签可以让我们获得想要的信息。

```html
<html>
<head>
	<meta name="_csrf" content="${_csrf.token}"/>
	<!-- default header name is X-CSRF-TOKEN -->
	<meta name="_csrf_header" content="${_csrf.headerName}"/>
	<!-- ... -->
</head>
<!-- ... -->
```

但是我们要将前端和后端分离的话，使用 JSP 不太现实，或许我们希望使用纯 HTML 页面来制作我们的前端。这时我们可以让 Security 将 token 写到 cookie 中去。这需要下面这些设置。

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            // settings
            .and()
            .csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
    }
}
```

`CookieCsrfTokenRepository.withHttpOnlyFalse()` 告诉 Security 框架将 token 写入 cookie 中，并且允许我们使用 js 获取。

现在万事俱备，我们可以使用下面的 js 尝试保存一个 target 了。

```javascript
$.ajax({
	url:"api/spitter",
	beforeSend:function(request){
		var match = window.document.cookie.match(/(?:^|\s|;)XSRF-TOKEN\s*=\s*([^;]+)(?:;|$)/);
		request.setRequestHeader("X-XSRF-TOKEN",match && match[1]);
    },
	type:"POST",
	contentType:"application/json",
	data:JSON.stringify({
		"id":1234,
		"realName":null,
		"nickName":"API_USER_TEST",
		"age":99,
		"password":"THIS_IS_CREATE_BY_API_TEST"
	}),
	success:function(result){
		$("body").html(JSON.stringify(result));
	}
});
```

这里我们定义 beforeSend 使其在请求发送之前将 token 装入 header 中。我们使用正则表达式从 cookies 中匹配出 token。我们用 contentType 属性告诉服务器我们发送的数据的格式。这里有一点要注意，发送的 JSON 格式数据要求严格格式，我们需要使用`JSON.stringify()`方法格式化一下我们的 JSON 对象，否则将出现错误。和之前一样，如果成功我们将结果写入 body 来验证。我们看到了下面的结果。

> {"id":10014,"realName":null,"nickName":"API_USER_TEST","age":99,"password":"THIS_IS_CREATE_BY_API_TEST"}

我们成功了，再看一下 header 信息。

```text
// Request header
POST /target HTTP/1.1
Host: 10.0.0.26:8443
Connection: keep-alive
Content-Length: 103
Origin: https://10.0.0.26:8443
X-XSRF-TOKEN: 2d19f598-78dd-448e-809c-9a75cc987ab7
User-Agent: (too long so let's omit it)
Content-Type: application/json
Accept: */*
X-Requested-With: XMLHttpRequest
Referer: https://10.0.0.26:8443/
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.8
Cookie: (too long so let's omit it)

// Response header
HTTP/1.1 201
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Strict-Transport-Security: max-age=31536000 ; includeSubDomains
X-Frame-Options: DENY
Location: https://10.0.0.26:8443/target?id=10014
Content-Type: application/json;charset=UTF-8
Transfer-Encoding: chunked
Date: Sun, 08 Oct 2017 16:33:33 GMT
```

请求的 header 中我们将 X-XSRF-TOKEN 放了进去，所以我们顺利通过了验证。服务器处理了我们的请求，并且将处理后的对象发给了我们。（id 是保存后取出来的）

在响应中我们得到了更合理的 201 状态码，同时 Location 属性告诉了我们下一步应该怎么做。

### 到这里我们所做的尝试都成功了，接下来就是试着将其应用到实际中去吧...




