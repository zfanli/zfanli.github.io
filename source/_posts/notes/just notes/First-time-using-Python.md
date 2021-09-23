---
title: 关于 Python 的初体验感受
date: "2018-01-28T20:54:03Z"
tags:
  - Python
---

> 人生苦短，我用 Python。

搜集资料的时候，经常会在各个地方看到上面这句打趣的话，可见有一大批 Python 的拥趸是因为其非常完善的可用库而吹爆 Python 的。

这是让我对 Python 产生了兴趣的原因之一，当然还有其他原因，无非就是这个排行那个排行 Python 又上榜啦、这个网站那个网站又在刊登 Python 培训的广告啦，等等之类的。

这次对爬虫 🕷️ 有了需求，也是让我有了动机耐下心来研究了一番 Python，好好体会了一把 Python 语法的高明之处，和万能的可用库的方便之处。总体的印象是，果然盛名之下无虚士，除去性能这个高级语言很难避免的点不谈，剩下的就是——“Python 牛 X！”

<!-- more -->

由于个人经历，之前接触过静态语言 Java 和动态语言 JavaScript，在此基础上，Python 中用到的很多概念已经算是驾轻就熟，相互印证。

但在那些老生常谈的特性之外，Python 还有很多让人惊叹的特性。就比如方便实用为王道的列表生成式，这是我在以往接触过的语言中不曾有的。

```python
# 生成 [1x1, 2x2, 3x3...10x10] 的 list
>>> [x * x for x in range(1, 11) ]
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```

以同为动态语言的 JS 为例，要实现同样的效果可能会写成这样。

```js
>>> new Array(10).fill(1).map((_, i) => (i + 1) ** 2)
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```

从可读性上来看我认为还是 Python 看起来更舒服。

另一个例子 🌰 是懒惰的生成器（generator）。

```python
>>> li = [' Abc', 'blue ', ' red ']
# 生成器，去除 li 中各项的首尾空格
>>> gen = (x.strip() for x in li)
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

JS 甚至借鉴了 Python 的生成器的概念，在 ES6 中实现了 JS 版的生成器，上面这个逻辑在 JS 中实现如下，虽然在 JS 中没有列表生成器这种快速便捷的写法。

```js
>>> function* gen() {
    const li = [' Abc', 'blue ', ' red ']
    for (i of li) {
        yield i.trim()
    }
}
undefined
>>> const g = gen()
undefined
>>> g.next()
{value: "Abc", done: false}
>>> g.next()
{value: "blue", done: false}
>>> g.next()
{value: "red", done: false}
>>> g.next()
{value: undefined, done: true}
```

Python 中一个稍微复杂一些的生成器写法如下，这是一个斐波那契数列的生成器。

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

此外还有装饰器（decorator），协程（coroutine）等非常优秀的语言特性，已经被一些语言借（chao）鉴（xi）。

除了语言特性本身之外，Python 的真正强大之处在于功能强大的各种第三方类库。例如要生成下面这个可交互的 SVG 图表的话，使用第三方库 `pygal` 仅需要几行代码就可实现。

<embed src="/img/python-svg/dot_chart.svg" type="image/svg+xml" />

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

除去假数据的生成之外，真正生成图表的代码只有从 14 行到 20 行几句。

这些就完全不能用 JS 来改写了吧？因为据我所知，啊不对我还没接触过类似的 JS 库，emmm，不行我得去搜索一番...（搜索 ing）...啊，有了，下面这个库可以生成差不多的图表 📈，风格有些不一样，用法差不多简洁...好像，貌似，Python 也不能算唯一的选择吧 XD。

[https://github.com/gionkunz/chartist-js](https://github.com/gionkunz/chartist-js)

上面只是一个例子 🌰，在 Python 的生态环境中，还有大量的实用类库可以免去我们造车轮的烦恼，生成上面这个分析图表我们不必从创造生成工具 pygal 开始，我们只需要知道 pygal 暴露给我们的接口，藉此我们可以只关注我们想做的事情。

下面再贴一张图表。

<embed src="/img/python-svg/half_solid_gauge_chart.svg" />

酷炫吧？

还有很多有趣的图表，这是我看官方文档时做的笔记，可以生成一批各种样式的图表。

[first_pygal_test.py](https://github.com/CRitsu/python.test/tree/master/rick/pygal_test/first_pygal_test.py)

### 关于爬虫

花费了一周左右基本了解了 Python，又花费了一周的业余时间我写出了第一个爬虫。

其实时间主要都花在了查找资料，翻阅教程上了，等到原理和思路捋顺之后，放下资料对着电脑就撸出来了。爬的是豆瓣电影排名 Top 250，页面结构简单，总体难度不大。为了练习，我爬取了几乎所有信息（每个电影的介绍部分所有的文字），然后分门别类存入了 MySQL 中。

全程几乎没有难点，但是遇到一个问题，爬取外文名称之后没有给内容转义，由于外文名中偶尔出现的单引号让最后拼出来的 SQL 执行报错了。这个问题在对爬取的内容转义之后得到了解决。

还是很顺利的实现。但这仅仅是初级简单的页面。下面是这个爬虫的代码实现。

爬虫本体：

[crawler_douban.py](https://github.com/zfanli/practice-archived/tree/master/python/crawler/crawler_douban/crawler_douban.py)

数据库链接工具：

[db_connector.py](https://github.com/zfanli/practice-archived/tree/master/python/crawler/crawler_douban/db_connector.py)

用装饰器做的简单 log 工具：

[simple_logger.py](https://github.com/zfanli/practice-archived/tree/master/python/crawler/crawler_douban/simple_logger.py)

### 思考

Python 拥有很有特色的语言特性，拥有丰富的生态系统，目前在人工智能领域比较受到推崇。但是目前我接触不到 AI 领域的东西，就一个 Web 应用开发者的角度来看，Python 吸引我的主要还是语法特点。

就这篇文章提出的几个例子来说，生成 SVG 的可交互图表，Python 使用第三方库确实能很快的制作出一张精美的图表 📈，但是限制也是很大的，比如生成的结果可定制可格式化的选项看上去不是很多，但是在处理 SVG 方面，基于浏览器出生的 JS 几乎是有着天然的优势——SVG 就是发明来给浏览器用的！

而在爬虫方面，Python 和 Node.js 相比个人感觉旗鼓相当，而 Node.js 除了对占用内存的限制之外，对于轻量级的爬虫来说，天生和网页打交道的 JS 岂不是天选之子？而 Python 可能在并发等方面才能击败 JS 吧...

不过毕竟我接触 Python 的时间不是很长，目前的了解可能也只是一己之偏见，至少我认同 Python 的价值，并且会继续使用下去，来看看将来我会对 Python 有哪些改观吧！
