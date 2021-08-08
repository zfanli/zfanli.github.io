---
date: '2021-05-24T15:36:05.516Z'
excerpt: ''
tags:
  - Stack
  - Tree
  - DFS
  - Design
  - Queue
  - Iterator
title: 341. Flatten Nested List Iterator (Medium)
categories:
  - leetcode
---

With solutions both in Python and JavaScript.

先读题：

> You are given a nested list of integers `nestedList`. Each element is either an integer or a list whose elements may also be integers or other lists. Implement an iterator to flatten it.
>
> Implement the `NestedIterator` class:
>
> - `NestedIterator(List<NestedInteger> nestedList)` Initializes the iterator with the nested list `nestedList`.
> - `int next()` Returns the next integer in the nested list.
> - `boolean hasNext()` Returns `true` if there are still some integers in the nested list and `false` otherwise.

题目比较明确，需要我们用迭代器接口来扁平化嵌套数组，需要实现 `next` 和 `hasNext` 接口。测试 Case 会调用 `hasNext` 来检查是否还有值没输出，然后调用 `next` 获取具体的值。

需求比较明确，例子看看就好。

Example 1:

```console
Input: nestedList = [[1,1],2,[1,1]]
Output: [1,1,2,1,1]
Explanation: By calling next repeatedly until hasNext returns false, the order of elements returned by next should be: [1,1,2,1,1].
```

Example 2:

```console
Input: nestedList = [1,[4,[6]]]
Output: [1,4,6]
Explanation: By calling next repeatedly until hasNext returns false, the order of elements returned by next should be: [1,4,6].
```

### Submissions

先贴一下我的结果，防止剧透，具体代码会贴在最后。

**Python**

|         | Result  | Beats  | Complexity |
| ------- | ------- | ------ | ---------- |
| Runtime | 60 ms   | 92.67% | O(n)       |
| Memory  | 17.5 MB | 89.70% | O(1)       |

**JavaScript**

|         | Result  | Beats   | Complexity                                        |
| ------- | ------- | ------- | ------------------------------------------------- |
| Runtime | 88 ms   | 100.00% | O(n) for initialization, O(1) for retrieve values |
| Memory  | 49.6 MB | 72.22%  | O(n)                                              |

### 思路 & Solutions

**Python**

先来说说 Python 方案，说到最优的迭代方法，这就不得不说 Python 的生成器机制了。

下面是我的代码，可以看到逻辑上只是一个简单的递归，但是使用了生成器，让时间复杂度可以控制在 O(n)，同时由于没有使用额外的变量，空间复杂度为 O(1)。

```python
class NestedIterator:
    _gen = None
    _next = None

    def __init__(self, nestedList: [NestedInteger]):
        def integer_retriever(l):
            for i in l:
                if i.isInteger():
                    yield i.getInteger()
                else:
                    for _i in integer_retriever(i.getList()):
                        yield _i

        self._gen = integer_retriever(nestedList)
        self._retrieve()

    def _retrieve(self):
        try:
            self._next = next(self._gen)
        except StopIteration:
            self._next = None

    def next(self) -> int:
        res = self._next
        self._retrieve()
        return res

    def hasNext(self) -> bool:
        return self._next is not None

```

结果如下。

|         | Result  | Beats  | Complexity |
| ------- | ------- | ------ | ---------- |
| Runtime | 60 ms   | 92.67% | O(n)       |
| Memory  | 17.5 MB | 89.70% | O(1)       |

**JavaScript**

再来看看一般思路。在初始化时将嵌套数组解构，然后每次从缓存中取值。

```javascript
/**
 * @constructor
 * @param {NestedInteger[]} nestedList
 */
var NestedIterator = function (nestedList) {
  this._list = [];
  const denest = (nl) => {
    for (nest of nl) {
      if (nest.isInteger()) {
        this._list.push(nest.getInteger());
      } else {
        denest(nest.getList());
      }
    }
  };
  denest(nestedList);
};

/**
 * @this NestedIterator
 * @returns {boolean}
 */
NestedIterator.prototype.hasNext = function () {
  return this._list.length > 0;
};

/**
 * @this NestedIterator
 * @returns {integer}
 */
NestedIterator.prototype.next = function () {
  return this._list.shift();
};
```

结果如下。

|         | Result  | Beats   | Complexity                                       |
| ------- | ------- | ------- | ------------------------------------------------ |
| Runtime | 88 ms   | 100.00% | O(n) for initialization, O(1) for retrieve value |
| Memory  | 49.6 MB | 72.22%  | O(n)                                             |
