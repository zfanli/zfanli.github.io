---
layout:     post
title:      "搭建 workspace（SSM）"
subtitle:   "Spring + spring MVC + mybatis 整合搭建 workspace。"
date:       2017-10-27 00:15:35 +0800
author:     "Rick"
header-img: "img/post-bg/sunshine-dog.jpg"
catalog:    true
stickies:   true
class:      "major"
tags:
    - SSM
    - 搭建环境
    - 笔记
---

### 开始工程
***

该了解的东西基本都齐了，在这里重新搭建一个新环境权当复习了。我们使用Spring+Spring MVC+mybatis搭建一个环境，然后进入第一步，实现数据库相关的读写操作吧。

总之先把环境搭起来。

### 新建 workspace
***

使用Maven新建一个项目。然后导入所有需要的依赖。Pom文件内容比较长，放在最后展示。

在这个基础上我追加了一个 resources 文件夹，顾名思义存放资源文件。所以我们的目录结构大致如下。

```text
src
 ├─main
 │  ├─java
 │  ├─resources
 │  │  ├─configuration  // 存放xml等配置
 │  │  ├─properties     // 存放properties文件
 │  │  └─tables         // 存放ddl
 │  └─webapp
 │      ├─META-INF
 │      ├─res           // 前端资源总括，以下顾名思义
 │      │  ├─css
 │      │  ├─fonts
 │      │  ├─img
 │      │  └─js
 │      └─WEB-INF
 └─test
     └─java
```



### Spring 搭建
***

Spring 和 Spring MVC 都是一脉相承的，搭建起来非常简单。我们使用Java配置的方式搭建Spring MVC环境。

首先我们需要一个Web App初始化器。通过继承`AbstractAnnotationConfigDispatcherServletInitializer`类实现快速搭建初始Web应用。

结构如下：

```java
package io.critsu.config;

import org.springframework.web.servlet.support
            .AbstractAnnotationConfigDispatcherServletInitializer;

public class StrangeWebAppInitializer 
        extends AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class<?>[] {StrangeRootConfig.class, StrangeSecurityConfig.class};
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class<?>[] {StrangeWebConfig.class};
    }

    @Override
    protected String[] getServletMappings() {
        return new String[] {"/"};
    }
}
```

通过重写初始化器类的这三个方法我们可以简单的搭建一个简易的Web应用。`getRootConfigClasses()`中我们准备了两个root配置，`StrangeSecurityConfig`顾名思义以后我们导入Spring Security时使用的配置，暂时留空即可。稍后会展示这些配置类的内容的。

`getServletConfigClasses()`定义Web应用的servlet上下文。`getServletMappings()`定义映射路径，我们直接映射到所有路径。

下面先看看两份root配置的内容。

```java
package io.critsu.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan({"io.critsu.repositories","io.critsu.services"})
public class StrangeRootConfig {
}
```

`StrangeRootConfig`类我们标记这是一个配置类，并开启自动扫描我们的repository和service对象，省去了我们手动配置Bean的步骤。主体留空就行。

```java
package io.critsu.config;

public class StrangeSecurityConfig {
}
```

`StrangeSecurityConfig`这个等实现控制器的时候再来配置吧。

下面是web上下文的内容。这里我们设置了一个`html`文件的视图解析器和一个资源处理器，可以看到在资源处理器中我们不仅将`res`文件夹内的资源暴露出来，还暴露了顶层的`html`文件，这是为了方便访问DEMO页面而设置的。

```java
package io.critsu.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

@Configuration
@EnableWebMvc
@ComponentScan({"io.critsu.controllers"})
public class StrangeWebConfig extends WebMvcConfigurerAdapter {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("*.html","/res/**").addResourceLocations("/","/res/");

        super.addResourceHandlers(registry);
    }

    @Bean
    public ViewResolver configureViewResolver() {
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setSuffix(".html");
        viewResolver.setExposeContextBeansAsAttributes(true);
        return viewResolver;
    }
}

```

### 测试一下 MVC
***

Spring 和 MVC 很快就搭建好了，我们来测试一下 MVC 框架能不能正常的使用。我们先准备一个控制器，放在`io.critsu.controllers`包里，我们的`StrangeWebConfig`开启了对这个包的自动扫描，所以我们不必手动配置Bean了。我们准备的控制器如下。

```java
package io.critsu.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/h")
public class HomeController {
    @RequestMapping(method = RequestMethod.GET)
    public String showHome(){
        System.out.println("Home pages");
        return "home";
    }
}
```

随意准备一个`home.html`，内容无所谓，留空也行。这个控制器将处理`/h`路径的请求，并将`home.html`的内容展现给用户，在显示页面之前会打一句话到控制台。

对MVC框架的测试，或者说对 Controller 的测试一般有两种方法。我们先来看看发布到服务器中确认的方法。

我们先新建一个 Tomcat 服务器，将项目在服务器中发布。我们启动服务器，访问`127.0.0.1:9082/Strange/h`路径。在控制台我们得到了下面的输出。

```text
Home pages
```

这就说明 MVC 框架搭建成功了。是不是很简单？

在这个测试框架是否搭建成功的简单场景中使用发布到服务器中的方式确认确实很轻松，但是如果项目有了一定规模之后，每次都要启动服务确认或许不够效率。

同时最重要的问题是当我们的逻辑复杂之后我们想测试一块代码的时候往往要先满足另外很多块前提逻辑。我们只是想对部分代码做个单元测试呀。没关系，轮到 Mock 出场了。

使用 Mock 进行测试将我们需要测试的代码同其他代码解耦，让我们只关注目标代码是否正确。

这也是我们进行TDD 测试驱动开发的重要环节之一。

新建一个测试类，我们的 Mock 测试代码如下，与 JUnit 结合使用效果更佳。

```java
package test.controllers;


import io.critsu.config.StrangeWebConfig;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@RunWith(SpringRunner.class)
@WebAppConfiguration
@ContextConfiguration(classes = StrangeWebConfig.class)
public class HomeControllerTest {

    @Autowired
    private WebApplicationContext wac;

    private MockMvc mock;

    @Before
    public void setUp () {
        this.mock = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }

    @Test
    public void testHome() throws Exception {
        mock.perform(MockMvcRequestBuilders.get("/h"))
                .andExpect(MockMvcResultMatchers.view().name("home"));
    }

}

```

注意测试类的三个注解，这些注解让 JUnit 模拟服务器环境并且创建了应用上下文。我们使用这个上下文创建 MockMvc 对象并藉此测试。

运行的结果我们看到了预期的输出和绿条。说明一切正常。

在复杂环境中 Mock 测试的方法得以解耦关联性，让我们测试关注的部分，所以更为实用一些。

上面测试也测试玩了，接下来整合下一块，MyBatis！




### Pom.xml
***

我们用到的依赖总计如下。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>cn.mr</groupId>
  <artifactId>Strange</artifactId>
  <packaging>war</packaging>
  <version>0.0.1-SNAPSHOT</version>
  <name>Strange Maven Webapp</name>
  <url>http://maven.apache.org</url>

  <properties>
    <spring.ver>4.3.10.RELEASE</spring.ver>
    <spring.security.ver>4.2.3.RELEASE</spring.security.ver>
  </properties>

  <dependencies>

      <!--Spring dependencies START-->

    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-core</artifactId>
        <version>${spring.ver}</version>
    </dependency>
    
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-beans</artifactId>
        <version>${spring.ver}</version>
    </dependency>
    
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>${spring.ver}</version>
    </dependency>
    
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-expression</artifactId>
        <version>${spring.ver}</version>
    </dependency>
    
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context-support</artifactId>
        <version>${spring.ver}</version>
    </dependency>
    
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-aop</artifactId>
        <version>${spring.ver}</version>
    </dependency>
    
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-aspects</artifactId>
        <version>${spring.ver}</version>
    </dependency>
    
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-test</artifactId>
        <version>${spring.ver}</version>
        <scope>test</scope>
    </dependency>
    
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>${spring.ver}</version>
    </dependency>

    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-tx</artifactId>
        <version>${spring.ver}</version>
    </dependency>

    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>${spring.ver}</version>
    </dependency>

    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-core</artifactId>
        <version>${spring.security.ver}</version>
    </dependency>

    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-config</artifactId>
        <version>${spring.security.ver}</version>
    </dependency>

    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-web</artifactId>
        <version>${spring.security.ver}</version>
    </dependency>

    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-aspects</artifactId>
        <version>${spring.security.ver}</version>
    </dependency>

    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-crypto</artifactId>
        <version>${spring.security.ver}</version>
    </dependency>

    <!--Spring dependencies END-->

    <!--mybatis and mysql driver-->
      <dependency>
          <groupId>org.mybatis</groupId>
          <artifactId>mybatis</artifactId>
          <version>3.4.5</version>
      </dependency>

      <dependency>
          <groupId>mysql</groupId>
          <artifactId>mysql-connector-java</artifactId>
          <version>6.0.6</version>
      </dependency>

      <dependency>
          <groupId>org.mybatis</groupId>
          <artifactId>mybatis-spring</artifactId>
          <version>1.3.1</version>
      </dependency>

      <dependency>
          <groupId>com.alibaba</groupId>
          <artifactId>druid</artifactId>
          <version>1.1.3</version>
      </dependency>

      <!--log components-->

      <dependency>
          <groupId>org.apache.logging.log4j</groupId>
          <artifactId>log4j-core</artifactId>
          <version>2.9.1</version>
      </dependency>

      <dependency>
          <groupId>org.apache.logging.log4j</groupId>
          <artifactId>log4j-api</artifactId>
          <version>2.9.1</version>
      </dependency>

      <dependency>
          <groupId>org.apache.logging.log4j</groupId>
          <artifactId>log4j-web</artifactId>
          <version>2.9.1</version>
      </dependency>

      <dependency>
          <groupId>org.slf4j</groupId>
          <artifactId>slf4j-api</artifactId>
          <version>1.7.25</version>
      </dependency>

      <dependency>
          <groupId>org.apache.logging.log4j</groupId>
          <artifactId>log4j-slf4j-impl</artifactId>
          <version>2.9.1</version>
      </dependency>

      <!--json-->

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


    <dependency>
        <groupId>org.aspectj</groupId>
        <artifactId>aspectjrt</artifactId>
        <version>1.8.10</version>
    </dependency>
    
    <dependency>
        <groupId>org.aspectj</groupId>
        <artifactId>aspectjweaver</artifactId>
        <version>1.8.10</version>
    </dependency>
    
    <dependency>
        <groupId>cglib</groupId>
        <artifactId>cglib</artifactId>
        <version>3.2.5</version>
    </dependency>
      
    <dependency>
        <groupId>org.apache.commons</groupId>
        <artifactId>commons-lang3</artifactId>
        <version>3.6</version>
    </dependency>
      
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>jstl</artifactId>
        <version>1.2</version>
    </dependency>
      
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-core</artifactId>
        <version>2.8.47</version>
        <scope>test</scope>
    </dependency>
      
    <dependency>
        <groupId>org.hamcrest</groupId>
        <artifactId>hamcrest-all</artifactId>
        <version>1.3</version>
        <scope>test</scope>
    </dependency>
      


    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.12</version>
      <scope>test</scope>
    </dependency>
    
    <dependency>
      <groupId>javax.servlet</groupId>
      <artifactId>javax.servlet-api</artifactId>
      <version>3.1.0</version>
      <scope>provided</scope>
    </dependency>

  </dependencies>

  <build>
    <finalName>Strange</finalName>
        <plugins>  
        <plugin>  
            <groupId>org.apache.maven.plugins</groupId>  
            <artifactId>maven-war-plugin</artifactId>  
            <version>2.6</version>  
            <configuration>  
                <failOnMissingWebXml>false</failOnMissingWebXml>  
            </configuration>  
        </plugin>  
    </plugins> 
  </build>

  <profiles>
    <profile>
      <id>jdk-1.8</id>
      <activation>
        <activeByDefault>true</activeByDefault>
        <jdk>1.8</jdk>
      </activation>
      <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
      </properties>
    </profile>
  </profiles>
  <reporting>

  </reporting>
</project>

```


