---
layout:     post
title:      "Spring Security 配置和问题解决"
subtitle:   "安全框架初接触都是大坑...理解为何这么设计就好了。都是套路。"
date:       2017-10-6 10:26:16 +0800
author:     "Rick"
header-img: "img/post-bg/sunshine-dog.jpg"
catalog:    true
tags:
    - 安全
    - Q&A
    - Spring Security
---

### 版本和说明
***

说在最前，我使用的Security版本是**4.2.3.RELEASE**！！！

然后还有一件事，遇到啥问题自己解决不了的话，在到处百度谷歌之前不如先看看官方文档，全体看一遍的话能避免很多问题！！！

[Spring Security Reference](https://docs.spring.io/spring-security/site/docs/current/reference/htmlsingle/)

本文部分示例代码就是直接从官方文档摘抄的。

### 先提问题
***

在说配置之前还是先说说遇到的问题吧。配置真的很简单，特别是基于Java的配置，为了方便配置的目的，框架将大部分参数隐藏了，如果我们不配置任何参数只创建了初始化器的话就会载入默认一套配置。当有需求的时候再去定义需要的参数，而XML配置是需要把一套参数全都显式的配置的。两种配置各有好处。（XML配置不需要关心需要创建什么Bean，例如对http的配置都在这个标签下面。Java配置基本也能做到但是一些场合下需要创建对应的Bean）

但是遇到的问题真的都是坑。虽然这些问题可能是不熟悉框架和不懂security的套路导致的，换句话说了解了这些应该就可以更得心应手的使用它了吧。但是这些问题花了我好几天的时间寻找解决，在解决之后又发现问题简单的想撞墙...

话不多说，先来看看我遇到的这几个问题吧。

### 开启 Spring Security 的日志输出（debugging）
***

这个我一定要放在最前面，没有日志分析就是抓瞎...（默认是不打开的）

打开方式：

有两种方式，第一种是`@EnableWebSecurity(debug = true)`，大致如下。

```java
@EnableWebSecurity(debug = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    // contents
}
```

或者在`configure(WebSecurity web)`里面开启，如下。

```java
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    public void configure(WebSecurity web) throws Exception {
        web.debug(true);
    }
}
```

Tomcat中发布项目的时候输出了debugging提示信息就表示开启成功了。（提示生产环境不要开启debugging日志输出，可能造成敏感信息泄漏）

```text
********************************************************************
**********        Security debugging is enabled.       *************
**********    This may include sensitive information.  *************
**********      Do not use in a production system!     *************
********************************************************************
```

OK，现在debugging日志开启了。

### 注册 springSecurityFilterChain
***

这是个现在想起来很白痴的问题，但是在我跟着《Spring in Action》一步步配置的时候还是遇到了。书上的描述并没有让我重视这部分，但是查阅了官方文档之后得知，`springSecurityFilterChain`是Spring Security实现基于URL的安全策略的关键。

这里基于XML的配置不容易遇到这个问题，因为它要求手动配置所有需要配置的东西，所以自然而然会在`web.xml`里面添加下面的配置。

```xml
<filter>
<filter-name>myFilter</filter-name>
<filter-class>org.springframework.web.filter.DelegatingFilterProxy</filter-class>
</filter>

<filter-mapping>
<filter-name>myFilter</filter-name>
<url-pattern>/*</url-pattern>
</filter-mapping>
```

我们只需要注册一个过滤器，这是个代理过滤器，它会将我们设定的 springSecurityFilterChain 得到应用。

但是在Java配置中，因为它为我们做了非常多的事情，所以一开始难免会有，好棒！连过滤器注册的步骤都省了，的想法...然而事实并非如此。

因为如果你不动手注册 springSecurityFilterChain 的话，那么你的 SecurityConfig 就不会起到任何作用！（废话...）

在Java配置中，注册过滤器也是非常容易的，简单的继承`AbstractSecurityWebApplicationInitializer`，并且根据情况，如果项目里只使用了Spring Security则需要在构造器里面加载具体配置到上下文中。我们同时使用了Spring MVC所以安全配置放在Spring MVC的`getRootConfigClasses()`方法里面加载即可。对我们来说只需要一个空的继承了`AbstractSecurityWebApplicationInitializer`的类即可完成注册过滤器的操作。

```java
import org.springframework.security.web.context.*;

public class SecurityWebApplicationInitializer
	extends AbstractSecurityWebApplicationInitializer {

}
```

在Spring MVC中加载安全配置到上下文。

```java
public class MvcWebApplicationInitializer extends
		AbstractAnnotationConfigDispatcherServletInitializer {

	@Override
	protected Class<?>[] getRootConfigClasses() {
		return new Class[] { WebSecurityConfig.class };
	}

	// ... other overrides ...
}
```

上面都是小问题。百度一下就两三分钟解决了，但是后面的问题折腾了好久，最后在通读了一遍官方 Guide 对整体有了一些了解之后才恍然问题所在。（由此得到的结论是英文很重要...通读官方文档用了近一天的时间...）

### HTTPS 切换到 HTTP 时 session 丢失
***

在 `SecurityConfig` 中我用到了下面的配置。

```java
@Configuration
@EnableWebSecurity(debug = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                // 登陆页面让所有人访问
                .antMatchers("/login").permitAll()
                // 其他页面需要登录认证
                .anyRequest().authenticated()
            .and()
            .requiresChannel()
                // 登陆时必须经过 HTTPS 提交，HTTP 访问的情况下重定向到 HTTPS 页面
                .antMatchers("/login").requiresSecure()
            .and()
            .portMapper()
                // 端口映射，这里我的 HTTP 端口是 9081，映射到 HTTPS 端口是 9082
                .http(9081).mapsTo(9082)
                .http(80).mapsTo(443);
    }
    
    // others
}
```

然后我发布项目到Tomcat中尝试登陆，没问题，成功跳转到了主页，然后在主页点击一个按钮，结果跳转到403拒绝访问页面，留下下面这段信息。

> Could not verify the provided CSRF token because your session was not found.

无法验证 CSRF token 因为 session 没有找到。从报错内容可以得到的信息是确实取到了 CSRF token 但是没有找到 session 去验证它。

在 From 中也确实添加了下面的 hidden 项目。

```html
<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
```

并且渲染出来的画面可以看到存在 CSRF token，所以不存在取不到 token 报错的可能。

```html
<input type="hidden" name="_csrf" value="78dae7c8-d165-4841-aae3-982191dc0cf5">
```

其实原因就是这句话所说，找不到 session 验证 token。

**为什么？**

首先要了解到 Session 是如何被查找的。当然是用 Session ID 去匹配。

而 Session ID 是谁提供的？是在 Request 中提供的。

那么 Request 从哪里取得的 Session ID？是从 cookie 中取得的。

（那么 cookie 中的 Session ID 从哪儿来的呢？废话当然是第一次请求时候服务器发来的，然后就存在 cookie 中了）

了解了这些，再看一下访问登陆页面时的日志信息。（正常的信息）

```text
servletPath:/login
pathInfo:null
headers: 
host: (my https host)
connection: keep-alive
user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36
upgrade-insecure-requests: 1
accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
accept-encoding: gzip, deflate, br
accept-language: zh-CN,zh;q=0.8
cookie: JSESSIONID=D50D3F11881578617E843E11E3571CB0
```

嗯，很好，最后一行就是 Session ID 了。再看看报403时的日志信息。（不正常的信息）

```text
servletPath:/target
pathInfo:null
headers: 
host: (my http host)
connection: keep-alive
user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36
upgrade-insecure-requests: 1
accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
accept-encoding: gzip, deflate
accept-language: zh-CN,zh;q=0.8
```

发现了什么？欸？我的 Session ID 呢？不见了。

服务器一看，好家伙连身份证都没有，当然不让过了。毕竟安全策略是`.anyRequest().authenticated()`嘛。（然后顺手还给发行了一个新的 Session ID）

现在知道问题所在了，没有发送 Session ID 给服务器当然无法找到匹配的 session 验证 token 啦。那取不到 Session ID 的原因是什么？Cookie 丢失吗？

在浏览器查询发现 cookie 并没有丢失。

**那为什么 http 下的请求取不到 cookie ？**

官方文档一个 Q&A 提到了这个问题，这个问题的原因就是 http 和 https 链接的混用。

> [44.2.10 I’m using Tomcat (or some other servlet container) and have enabled HTTPS for my login page, switching back to HTTP afterwards. It doesn’t work - I just end up back at the login page after authenticating.](https://docs.spring.io/spring-security/site/docs/current/reference/htmlsingle/#appendix-faq-tomcat-https-session)  
> This happens because sessions created under HTTPS, for which the session cookie is marked as "secure", cannot subsequently be used under HTTP. The browser will not send the cookie back to the server and any session state will be lost (including the security context information). Starting a session in HTTP first should work as the session cookie won’t be marked as secure. However, Spring Security’s Session Fixation Protection can interfere with this because it results in a new session ID cookie being sent back to the user’s browser, usually with the secure flag. To get around this, you can disable session fixation protection, but in newer Servlet containers you can also configure session cookies to never use the secure flag. Note that switching between HTTP and HTTPS is not a good idea in general, as any application which uses HTTP at all is vulnerable to man-in-the-middle attacks. To be truly secure, the user should begin accessing your site in HTTPS and continue using it until they log out. Even clicking on an HTTPS link from a page accessed over HTTP is potentially risky. If you need more convincing, check out a tool like sslstrip.

看不明白没关系，稍后我们会详细解释为什么的。但是再让我们看看由此还会导致的另一个问题。

假设现在我们了解原因了，那我们不混用了，我想只使用 http 行吗？你会发现，可能问题还是没有解决。原因是 cookie 中可能还存在 https 的 Session ID。

如果你坚持要用回 http 的话，那就关掉 https 的端口，并且删掉相关的 cookie 吧。但是建议是只使用 https。下面来看看官方的说法。

> 出现这个问题的原因是在 HTTPS 下创建的 Session 其在 cookie 中被标记为了“secure”，跳转到 HTTP 下是不能使用它的。浏览器将不会发送 Session 信息给服务器，从而导致所有的 session 信息都被丢失（包括Security的上下文信息）。如果一开始在 HTTP 下创建了 session 应该不会出现这个问题，因为 cookie 不会被标记为“secure”。然而 Spring Security 的 Session Fixation Protection（会话固定保护）会干涉进来，因为其会创建一个新的 Session ID 发回给浏览器，并且通常会带有安全flag。要规避这个问题，你可以禁用 session fixation protection，但是在更新的 Servlet 容器中你也可以配置 session cookie 让其不使用安全flag。但是请注意在 HTTP 和 HTTPS 之间切换通常都不是一个好主意，如同只使用 HTTP 的应用一样容易受到中间人攻击（man-in-the-middle attacks）。要做到真正的安全，用户应该从开始访问你的网站到登出为止都使用 HTTPS。即使是在 HTTP 中点击一个 HTTPS 的链接也是有潜在的风险的。如果你想了解的更多可以看一下这个工具 [sslstrip](https://moxie.org/software/sslstrip/) （这是一个基于 Python 的模拟 HTTPS stripping attacks 的 演示工具）

所以，如果不是特别需求的话，还是老老实实使用 HTTPS 吧。

```java
@Configuration
@EnableWebSecurity(debug = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                // 登陆页面让所有人访问
                .antMatchers("/login").permitAll()
                // 其他页面需要登录认证
                .anyRequest().authenticated()
            .and()
            .requiresChannel()
                // 所有 HTTP 的请求都重定向到 HTTPS 下
                .anyRequest().requiresSecure()
            .and()
            .portMapper()
                // 端口映射，这里我的 HTTP 端口是 9081，映射到 HTTPS 端口是 9082
                .http(9081).mapsTo(9082)
                .http(80).mapsTo(443);
    }
    
    // others
}
```

下面是个粗心的问题。

### 谨慎安全保护的范围
***

这真是个粗心引发的问题。记下来给自己敲个警钟，以后多考虑一点。

我在上面的配置里加了点东西，有了登陆我总要加个退出吧。所以就有了下面这个配置。

```java
@Configuration
@EnableWebSecurity(debug = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                // 登陆页面让所有人访问
                .antMatchers("/login").permitAll()
                // 其他页面需要登录认证
                .anyRequest().authenticated()
            .and()
            .requiresChannel()
                // 所有 HTTP 的请求都重定向到 HTTPS 下
                .anyRequest().requiresSecure()
            .and()
            .portMapper()
                // 端口映射
                .http(9081).mapsTo(9082)
                .http(80).mapsTo(443)
                // 开启登陆验证（之前其实有的我给省略掉了）
            .and().formLogin().loginPage("/login").permitAll()
            // 保持登陆
        .and().rememberMe().key("remember")
            // 退出
        .and().logout().logoutUrl("/logout").logoutSuccessUrl("/login?logout");
    }

}
```

从上往下看，嗯还不错，应该能行！去试试吧，结果是不行！眼尖的你可能已经看出问题所在了，但我们先不说，先看看现象。

我打开了登陆页面，输入账号密码，嗯，成功登陆进去了，然后点退出按钮，额，跳转到登陆页面了，什么意思？

算了那我在登陆一次吧，登陆完结果又跳转到登陆画面。这次有点不一样，URL是 `(path)/login?logout`。

**到底什么情况？**

情况就是在访问 logout 时突然发现，没有权限访问这个画面了。

那怎么办，授权啊，就是登陆咯，登陆完就给你显示咯。（嗯，很正常的思维）

但是你发现登陆后显示给你的是一个退出登陆的画面...这就让人类难以理解了。

没错，就是权限的问题。在这个配置中并没有开放 logout 的访问权限，或许我们想的是我还在登陆的时候访问了 logout 路径最终结果是跳转到了允许所有人访问的 login 页面了嘛，为什么会权限不够呢？

其实从现象就可以分析出，在真正定向到 logout 的时候，Filter 中早已经清除了 session 信息（这也是必然的），这时我们已经是未认证的状态了呀，但是我们请求的路径在 `.anyRequest().authenticated()` 范围内，所以出现了这个登陆才给你退出的闹剧。

解决很简单，开放 logout 的访问权限就可以了。但是这个问题的本质还是对权限的思考不够，思维不够严谨，不过吃一堑长一智，以后好好学习，多想一步吧。

下面这个配置可以让登出功能正常使用。

```java
@Configuration
@EnableWebSecurity(debug = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                // 登陆页面让所有人访问
                .antMatchers("/login").permitAll()
                // 其他页面需要登录认证
                .anyRequest().authenticated()
            .and()
            .requiresChannel()
                // 所有 HTTP 的请求都重定向到 HTTPS 下
                .anyRequest().requiresSecure()
            .and()
            .portMapper()
                // 端口映射
                .http(9081).mapsTo(9082)
                .http(80).mapsTo(443)
                // 开启登陆验证（之前其实有的我给省略掉了）
            .and().formLogin().loginPage("/login").permitAll()
            // 保持登陆
        .and().rememberMe().key("remember")
            // 退出
        .and().logout().logoutUrl("/logout").logoutSuccessUrl("/login?logout").permitAll();
    }

}
```


### 先到这里
***

写文档时间太长也不好，今天就先到这里吧。





