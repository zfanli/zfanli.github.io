---
layout:     post
title:      "Spring 框架笔记"
subtitle:   "Spring MVC，DI，AOP等相关的笔记。"
date:       2017-9-10 08:03:51 +0800
author:     "Rick"
header-img: "img/post-bg/sunshine-dog.jpg"
catalog:    true
class:      "study"
tags:
    - 笔记
    - Spring
    - MVC
    - AOP
    - DI(IoC)
---

### Spring MVC 笔记
***
使用《Spring in Action》一书学习和练习spring框架的使用。为记录在学习中遇到的问题和解决，也为方便记忆留下笔记。

### Spring MVC 配置
***

**Spring MCV 基本配置**

基于Java的配置：
```java
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class SpittrWebApplicationInitializer extends 
    AbstractAnnotationConfigDispatcherServletInitializer {

    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class<?>[] {RootConfig.class};
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class<?>[] {WebConfig.class};
    }

    @Override
    protected String[] getServletMappings() {
        return new String[] {"/"};
    }

}
```
对于`RootConfig.java`暂时留空：
```java
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@ComponentScan(basePackages={"springtest"},
        excludeFilters={@Filter(type=FilterType.ANNOTATION,value=EnableWebMvc.class)})
public class RootConfig {

}
```
对于`WebConfig.java`需要配置ViewResolver：
```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;


@Configuration
@EnableWebMvc
@EnableAspectJAutoProxy
@ComponentScan({"springtest"})
public class WebConfig extends WebMvcConfigurerAdapter {
    @Bean
    public ViewResolver verwResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/view/");
        resolver.setSuffix(".jsp");
        resolver.setExposeContextBeansAsAttributes(true);
        return resolver;
    }

    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        super.configureDefaultServletHandling(configurer);
        configurer.enable();
    }
}
```

基于web.xml的配置：
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<web-app version="2.5"
    xmlns="http://java.sun.com/xml/ns/javaee"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://java.sun.com/xml/ns/javaee 
        http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd">
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>/WEB-INF/spring/root-context.xml</param-value>
    </context-param>
    <listener>
        <listener-class>
            org.springframework.web.context.ContextLoaderListener
        </listener-class>
    </listener>
    <servlet>
        <servlet-name>appServlet</servlet-name>
        <servlet-class>
            org.springframework.web.servlet.DispatcherServlet
        </servlet-class>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>appServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
</web-app>
    
```


**ViewResolver 配置**

常用的视图解析器为`InternalResourceViewResolver`和`ResourceBundleViewResolver`，下面记录对前者的一些配置。

基于Java的最简单配置：
```java
    @Bean
    public ViewResolver verwResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        // 设置前缀
        resolver.setPrefix("/WEB-INF/view/");
        // 设置后缀
        resolver.setSuffix(".jsp");
        return resolver;
    }
```
基于XML的最简单配置：
```xml
<bean id="viewResolver"
    class="org.springframework.web.servlet.view.InternalResourceViewResolver"
    p:prefix="/WEB-INF/view/"
    p:suffix=".jsp" />
```
`InternalResourceViewResolver`默认将逻辑视图解析为`InternalResourceView`对象。对于使用了JSTL标签来处理格式化和信息的JSP页面，它需要一个 `Locale` 对象来正确的格式化日期和货币等地域化的值，这时需要让解析器将视图解析为`JstlView`。简单的修改解析器的`ViewClass`属性。

基于Java：
```java
    @Bean
    public ViewResolver verwResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        ...
        relover.setViewClass(org.springframework.web.servlet.view.JstlView.class);
        ...
        return resolver;
    }
```
基于XML:
```xml
<bean id="viewResolver"
    class="org.springframework.web.servlet.view.InternalResourceViewResolver"
    p:prefix="/WEB-INF/view/"
    p:suffix=".jsp"
    p:viewClass="org.springframework.web.servlet.view.JstlView" />
```

### Spring MVC 参数传递
***

**向页面传参**

给Controller一个Model型或者Map型的参数。将需要给页面传的参数以键值对的形式放入这个model中，让页面（View层）接收。
```java
    @RequestMapping(value="/spittle")
    public String toSpittle(Model model) {
        model.addAttribute("spittle", (Spittle object));
        return "spittle";
    }
```

**URL查询参数**

适用于URL地址+`?para=value&morePara=value...`的查询参数。用`@RequestParam`注解获取URL地址查询参数，需要设定获得的`value`名，`defaultValue`是可选项，在没有这个value值时默认赋值。

```java
    @RequestMapping(value="/id")
    public String toSpittleInId(
            @RequestParam(value="id", defaultValue="1") Long id,
            Model model) {
        ...
        model.addAttribute("spittle", spittleRepository.findSpittle(id));
        return "spittle";
    }
```

**URL路径参数**

使用指定的URL路径作为参数。适用于URL为`basePath/param`的形式。需要以`/id{id}`的形式在映射的地址上用花括号（{}）定义一个参数名，用`@PathVariable`注解接收这个参数（接收的参数名必须和花括号定义的一致）。

```java
    @RequestMapping(value="/id{id}")
    public String toSpittleInId(
            @PathVariable Long id,
            Model model) {
        ...
        model.addAttribute("spittle", spittleRepository.findSpittle(id));
        return "spittle";
    }
```

**实体类**

在说到表单映射之前要先提到实体类。实体类是为了映射数据库对象以及页面表单对象而存在的类，它需要符合下面的规范。
* 显式的无参构造器（no-argument constructor）
* private修饰符的属性（private fields）
* Setter/Getter方法（Setter/Getter accessor）

**表单映射**

给Controller传递一个实体类参数，页面上的表单内name值与实体类属性名相同的字段将自动装配到实体类。

Controller with an entity object argument
```java
    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public String registration(Spitter spitter) {
        ...
        return "redirect:/spitter/" + spitter.getNickName();
    }
```

Entity object has private fields and Setter/Getter/no-argument constructor
```java
public class Spitter {

    private String realName;
    private String nickName;
    private String username;
    private String password;
    ...
    (Setter/Getter and explicit no-argument constructor)
    ...
}
```

The form's fields have same name with the entity object

```html
    <form action="" method="post">
        Real Name: <input name="realName"> <br>
        Nick Name: <input name="nickName"> <br>
        Username: <input name="username"> <br>
        Password: <input name="password" type="password"> <br>
        <input type="submit" value="Register">
    </form>
```

### Spring MVC 控制器与异常处理
***

**控制器**

加了`@Controller`注解的类即控制器。用`@RequestMapping`注解定义映射的路径。


**异常处理**

使用`@ControllerAdvice`注解定义控制器通知类，使用`@ExceptionHandler`注解定义需要处理的异常和处理方法体。
```java
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.NoHandlerFoundException;
import springtest.exception.SpitterNotFoundException;

@ControllerAdvice
public class AppWideExceptionHandler {

    @ExceptionHandler(value = { SpitterNotFoundException.class, NoHandlerFoundException.class })
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String spitterNotFoundHandler() {
        return "error/404";
    }
}
```
但是在处理404时遇到一个问题，如果在`WebConfig.java`中开启了默认处理的话，404会被默认的Handler处理，我使用的是Tomcat容器，开启默认处理之后404会被Tomcat处理跳转到服务器的404报告页面。这时需要移除下面这行关闭默认的处理。
```java
    configurer.enable();
```
