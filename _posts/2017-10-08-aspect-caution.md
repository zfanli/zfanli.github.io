---
layout:     post
title:      "使用切面时一定注意！"
subtitle:   "两天时间白白花在这上面了...这是一个可以在一开始就避免的问题。使用切面一定要注意它！"
date:       2017-10-8 21:01:00 +0800
author:     "Rick"
header-img: "img/post-bg/sunshine-dog.jpg"
catalog:    true
class:      "usage"
tags:
    - 问题
    - 笔记
    - 切面
    - Aspect
---

### 深坑
***

明天都要上班了，假期的最后两天被我遇到这么个坑一样的问题。

只想说，使用切面需谨慎，思维还要再严谨一点！！！

### 先说现象
***

涉及到两篇文章，一个是造成的原因，一个是遇到了问题。

首先是[Log4j2 配置和使用](/2017/09/30/log4j/)这篇文章，里面关于切面的配置导致了这个问题，现在已经修复了。（没有及时发现所以一开始没想到是这个原因...）

然后就是上一篇文章，[REST api 的尝试](/2017/10/07/try-of-REST-api/)里面我在准备示例代码的时候发现了问题。

现象就出现在了`@ExceptionHandler`注解上。

所有程序中抛出的异常都没有被这个注解所标注的相应的异常处理器处理。这句话可能有点绕，举个例子来说，就是假如我在程序中抛出了`IOException`异常，并且我是有一个`@ExceptionHandler`标注的异常处理器来处理这个异常的，同时可以保证它在`@ControllerAdvice`类中是可以被调用的（因为我用这个异常处理器处理不止一个异常，并且存在可以正常处理的异常），但是现象是这个`IOException`没有被处理，直接返回了一个空的响应给客户端。

为此我针对`@ExceptionHandler`和`@ControllerAdvice`在谷歌和百度上进行了疯狂的搜索，然后又涉及到了`HandlerExceptionResolver`等等等等。

能试的方法都试过了，甚至连在`@ControllerAdvice`类上加`@EnableWebMvc`注解这种白痴的方法都被迫尝试了。（XML配置时`@EnableWebMvc`加这里还是有意义的）

没辙了，现在用的这个环境复杂度较高，debug启动超级慢。好吧，只有最后的办法了，新建个项目单独导入spring MVC框架，重新配置一下然后debug！！！（早该这样做的）

然后发现，没有问题！！！

`@ExceptionHandler`注解的异常处理器都可以正常的处理对应的异常！！！

**没道理啊！到底怎么回事？**

我来回debug了好几次，把抛出异常到处理异常的过程了解了一下。大致如下。（就大致说下流程不具体到类，套路还是很好理解的）

**1.控制器处理过程中抛出异常**

很好理解，就是个入口。

**2.框架捕获这个异常，然后**

被框架捕获了，然后用一系列反射机制来处理。

**3.在异常发生的控制器类中查找异常处理器**

由于我把异常处理器写在了通知器里面了，所以这一步没成功。但是从这个套路来看，即使`@ControllerAdvice`中存在对应的`@ExceptionHandler`方法，但我们还是可以在异常抛出的Controller中定义一个`@ExceptionHandler`来满足当前类的需求。因为首先搜索当前类里面是否能够处理这个异常。

**4.在Advice中查找是否有能处理的异常处理器**

到这一步成功了，在缓存的Advice中确实找到了我定义的异常处理器，并且正常处理返回了预期的结果给客户端。

（上面虽然总结成4步，其实是省略了一大堆细节，比如解析器first win之类的）

这就很尴尬了，为什么没有出现问题？

我还是老老实实打开原来的环境，再次进入debug。等的真够久的，早知道当初用`@Profile`把几个重头戏标注出来了。

这次debug直接就找到原因了。就是我们标题所说的，切面！！！

在上面的流程中切面的处理是处在2和3之间的。

**2.5.切面处理异常**

在Log4j2的配置中我创建了一个切面来记录各种日志信息，其中就包括了对异常信息的追踪和记录。

坑就坑在这里！！！

异常在被切面处理完之后，就没了！！！

在原本的环境下debug的结果，只有1到2.5这三个步骤。所以原因很明显，被堵塞了。

### 问题原因
***

我们先来看看这个切面具体什么样吧。

```java
@Component
@Aspect
public class LogAspect {

    private static Logger logger = LoggerFactory.getLogger(LogAspect.class.getName());

    @Pointcut("execution(* path.*.*.*(..))")
    public void toPage(){}
    
    @Around("toPage()")
    public Object logPages(ProceedingJoinPoint point){
        Object o = null;
        try {
            StringBuilder param = new StringBuilder("Param: ");
            for (int i = 0; i < point.getArgs().length; i++) {
                param.append(point.getArgs()[i].toString()).append(';');
            }
            String param2String = param.toString().trim().equals("Param:") ? 
                    "":param.toString();
            logger.info("START - {} {} {}", point.getTarget().getClass().getName(), 
                    point.getSignature().getName(), param2String);
            o = point.proceed();
            logger.info("END - " + point.getTarget().getClass().getName()  
                    + " " +point.getSignature().getName());
        } catch (Throwable e) {
            logger.error("异常 - {} {}", point.getTarget().getClass().getName(),
                    point.getSignature().getName(),e);
        }
        return o;
    }
}
```

写的不是很整洁...

这里有两个重点，是导致这个问题的最根本原因。

**1.使用了`@Around`注解**

**2.堵塞了异常**

这两个原因是递进的。因为我使用了`@Around`注解，而我没有对异常做处理，导致堵塞了。

`@Around`注解是一个很方便的东西，但是一定程度上容易导致问题。因为在这个方法里面，目标方法被作为一个参数传递了进来，从此目标方法的控制权就掌握在了`@Around`注解的方法手中。生杀予夺一念之差啊。

`@Around`注解方法好比一个圆圈，目标方法在圆圈之内，是被隔绝的状态。我在写这个切面的时候考虑到了目标方法的返回值需要传递出去，这好比在圆圈之中打开了一个通道，虽然一切都在掌控之下，但是目标方法可以和外界取得一些联系了——返回值可以被传递出去了。

但是想到了开头的我并没有想到结尾。

```java
        } catch (Throwable e) {
            logger.error("异常 - {} {}", point.getTarget().getClass().getName(), 
                    point.getSignature().getName(),e);
        }
```

这一块在对异常做完记录之后...然后就没有然后了。可想而知，记录完信息之后，切面返回了一个空对象，隐藏了发生了异常的事实。

这就是使用`@Around`时必须考虑的问题了。（想说缺点来着，其实想一想还是自己的逻辑不够严谨）

上面的代码修改一下就没有问题了。

```java
@Component
@Aspect
public class LogAspect {

    private static Logger logger = LoggerFactory.getLogger(LogAspect.class.getName());

    @Pointcut("execution(* path.*.*.*(..))")
    public void toPage(){}
    
    @Around("toPage()")
    public Object logPages(ProceedingJoinPoint point) throws Throwable{ // 抛出
        Object o = null;
        try {
            StringBuilder param = new StringBuilder("Param: ");
            for (int i = 0; i < point.getArgs().length; i++) {
                param.append(point.getArgs()[i].toString()).append(';');
            }
            String param2String = param.toString().trim().equals("Param:") ? 
                    "":param.toString();
            logger.info("START - {} {} {}", point.getTarget().getClass().getName(), 
                    point.getSignature().getName(), param2String);
            o = point.proceed();
            logger.info("END - " + point.getTarget().getClass().getName()  
                    + " " +point.getSignature().getName());
        } catch (Throwable e) {
            logger.error("异常 - {} {}", point.getTarget().getClass().getName(),
                    point.getSignature().getName(),e);
            throw e; // 处理完之后将异常抛出
        }
        return o;
    }
}
```

但是将方法隔绝总归是有风险的。可能下次就从那个角落里面出现了奇怪的问题了呢？而且将三个log事件拼凑在一个方法里面平白提升了方法的复杂度，何必呢？

所以，还是分开写吧。下面将三个log事件分开了，个人认为这样反而逻辑更清晰了。

```java
@Component
@Aspect
public class LogAspect {

    private static Logger logger = LoggerFactory.getLogger(LogAspect.class.getName());

    @Pointcut("execution(* path.*.*.*(..))")
    public void toPage(){}
    
    @Before("toPage()")
    public void beforePerform(JoinPoint point) {
        StringBuilder param = new StringBuilder("Param: ");
        for (int i = 0; i < point.getArgs().length; i++) {
            param.append(point.getArgs()[i].toString()).append(';');
        }
        String param2String = param.toString().trim().equals("Param:") ? 
                "":param.toString();
        logger.info("START - {} {} {}", point.getTarget().getClass().getName(), 
                point.getSignature().getName(), param2String);
    }

    @After("toPage()")
    public void afterPerform(JoinPoint point) {
        logger.info("END   - {} {}", point.getTarget().getClass().getName(), 
                point.getSignature().getName());
    }

    @AfterThrowing(throwing = "e",pointcut = "toPage()")
    public void logException(JoinPoint point, Throwable e){
        logger.error("异常 - {} {}", point.getTarget().getClass().getName(), 
                point.getSignature().getName(),e);
    }

}
```

### 吃一堑长一智吧...怎么感觉最近是吃撑了？







