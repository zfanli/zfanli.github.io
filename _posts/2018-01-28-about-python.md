---
layout:     post
title:      "关于 Python 的一些事"
subtitle:   "之前一直想接触 Python，现在终于有机会了，全面了解了一下它，果然是很强大的语言。"
date:       2018-01-28 20:54:03 +0800
author:     "Rick"
header-img: "img/post-bg/sunshine-dog.jpg"
catalog:    true
class:      "study"
tags:
    - Python
    - 学习笔记
---

### 这两周的总结
***

> 人生苦短，我用 Python。

经常在各个地方看到上面这句话，让我对 Python 产生了强烈的兴趣。

这次全面接触下来，果然名副其实。

在掌握了静态语言 Java 和动态语言 JavaScript 的基础上，很多概念已经驾轻就熟，这些特性在 Python 中也都得到了印证。

但在那些老生常谈的特性之外，Python 还有很多让人惊叹的特性。

比如方便实用为王道的列表生成式。

```python
>>> [x * x for x in range(1, 11) ]  # 生成 [1x1, 2x2, 3x3...10x10] 的 list
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```


还有懒惰却奇妙的生成器（generator）。

```python
>>> li = [' Abc', 'blue ', ' red ']
>>> gen = (x.strip() for x in li)  # 生成器，去除 li 中各项的首尾空格
>>> gen
<generator object <genexpr> at 0x0000028AAD415BA0>
>>> next(gen)  # 生成下一个元素
'Abc'
>>> next(gen)  # 生成下一个元素
'blue'
>>> next(gen)  # 生成下一个元素
'red'
>>> next(gen)  # 结束
Traceback (most recent call last):
  File "...interactiveshell.py", line 2862, in run_code
    exec(code_obj, self.user_global_ns, self.user_ns)
  File "<ipython-input-360-8a6233884a6c>", line 1, in <module>
    next(gen)
StopIteration
```


下面是功能更强大的生成器的写法。

```python
>>> def fib(max):  # 创建一个斐波那契数列的生成器
...     n, a, b = 0, 0, 1
...     while n < max:
...         yield b  # yield 关键字创建生成器
...         a, b = b, a + b
...         n = n + 1
...     return 'done'
...
>>> f = fib(6)
>>> f
<generator object fib at 0x0000028AAD415410>
>>>  for i in f:  # 对生成器直接使用 for 迭代
...      print(i)
...      
1
1
2
3
5
8
```


此外还有装饰器（decorator），协程（coroutine）等。

这些还仅仅是 Python 语言的特性。

Python 的真正强大之处在于功能强大的各种第三方类库。

例如要生成下面这个可交互的 SVG 图表的话，仅需要几行代码就可实现。

<embed src="/img/post-img/svg/dot_chart.svg" />

代码实现如下：

```python
import pygal
from random import randint


def get_random_data(s=10):
    """Random data generator."""
    result = []
    for i in range(s):
        result.append(randint(10, 200))
    return result


def dot_chart():
    dot = pygal.Dot(x_label_rotation=30)
    dot.title = 'DOT CHART TEST'
    dot.x_labels = ['DOT TARGET {}'.format(x) for x in range(10)]
    for i in range(3):
        dot.add('Item {}'.format(i), get_random_data(size))
    dot.add('Neg exists', [x - 100 for x in get_random_data()])
    dot.render_to_file('DOT_CHART_TEST.svg')


if __name__ == '__main__':
    dot_chart()

```

除去假数据的生成之外，真正生成图表的代码只有从14行到20行几句。

在 Python 的生态环境中，有大量的实用类库可以免去我们造车轮的烦恼，生成上面这个分析图表我们不必从创造生成工具 pygal 开始，我们只需要知道 pygal 暴露给我们的接口，藉此我们可以只关注我们想做的事情。

**当然并不是提倡拿来主义。**

在 Java 中也能做到这一切，或许没有适合的库直接生成吧，但我们关门造两个月轮子，怎么也能实现了吧？

下面再贴一张图表吧。

<embed src="/img/post-img/svg/half_solid_gauge_chart.svg" />

酷炫吧？

还有很多有趣的图表，这是我看官方文档时做的笔记，可以生成一批各种样式的图表。

[first_pygal_test.py](https://github.com/CRitsu/python.test/tree/master/rick/pygal_test/first_pygal_test.py)


### 关于爬虫
***

一周左右基本了解了 Python，又一周时间我写出了第一个爬虫。

查找了很多资料，翻阅了很多教程，原理和思路捋顺之后，放下资料对着电脑就撸出来了。

爬的是豆瓣电影排名Top 250，页面结构简单，总体难度不大。

为了练习，我爬取了几乎所有信息（每个电影的介绍部分所有的文字），然后分门别类存入了 MySQL 中。

全程几乎没有难点，但是遇到一个问题，爬取外文名称之后没有给内容转义，由于外文名中偶尔出现的单引号让最后拼出来的 SQL 执行报错了。

这个问题在对爬取的内容转义之后得到了解决。

还是很顺利的实现。但这仅仅是初级简单的页面。

下面是这个爬虫的代码实现。

爬虫本体：

[crawler_douban.py](https://github.com/CRitsu/python.test/blob/master/crawler/crawler_douban/crawler_douban.py)

数据库链接工具：

[db_connector.py](https://github.com/CRitsu/python.test/blob/master/crawler/crawler_douban/db_connector.py)

用装饰器做的简单 log 工具：

[simple_logger.py](https://github.com/CRitsu/python.test/blob/master/crawler/crawler_douban/simple_logger.py)


### 最后
***

做完爬虫之后，由于想利用手里的数据做一个分析的图表，遂去翻阅了一番生成分析图表的类库和文档，体验了一把 Python 强大的生态圈。

接下来打算爬一下社交网站的数据，丰富数据库。

然后，前段时间一直在考虑前端的 web 应用用什么做后台，学习了 Python 之后果断觉得，node.js 什么的还是拖迟一下吧，Python 就很不错！

Java 的后端这里框架基本定好了，RESTFul API，服务的提供者。

前端 app 用 Python 做一个消费者，听上去不错！

所以，埋头继续写代码去。

