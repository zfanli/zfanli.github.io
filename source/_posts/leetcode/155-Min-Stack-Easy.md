---
title: 155. Min Stack (Easy)
tags:
  - Stack
  - Design
date: "2021-09-23T14:20:18.210Z"
---

设计一个栈数据结构，需要支持入栈、出栈、查看栈顶和常量时间内获取最小值的操作。

> Implement the `MinStack` class:
>
> - `MinStack()` initializes the stack object.
> - `void push(val)` pushes the element val onto the stack.
> - `void pop()` removes the element on the top of the stack.
> - `int top()` gets the top element of the stack.
> - `int getMin()` retrieves the minimum element in the stack.

<!-- more -->

## 思路：栈 + 小根堆

看上去这道题要实现一个栈和小根堆结合的一个数据结构，数据的添加和删除是基于栈的后进先出的原则，与此同时每次数据操作我们更新一个小根堆来对这些数据进行排序，来确定最小数据的位置。

```python
class MinStack:

    def __init__(self):
        self.stack = []
        self.heap = []


    def push(self, val: int) -> None:
        self.stack.append(val)
        self.heap.append(val)
        for i in range(len(self.heap) - 1, 0, -1):
            if self.heap[i] < self.heap[i - 1]:
                self.heap[i], self.heap[i - 1] = self.heap[i - 1], self.heap[i]
            else:
                break


    def pop(self) -> None:
        val = self.stack.pop()
        self.heap.pop(self.heap.index(val))


    def top(self) -> int:
        return self.stack[-1]


    def getMin(self) -> int:
        return self.heap[0]
```

## 思路：单独的栈 + (val, min) pairs

另一个思路，我们只要保证每一个元素加入栈时的最小值即可，换一句话说，就是我们每次添加一个元素时拿到上一个最小值比较，检查最小值是否变化即可，这样就算移出一个元素，上一轮计算的最小值还是有效的。

要完成这个思路，我们将栈设计为每次储存一个元组，第一个元素为原始的值，第二个元素为最小值。每次添加新元素，取上次最小值判断。这个思路在时间复杂度上比上一个思路要高效，因为计算量上我们省去了排序的步骤。

```python
class MinStack:

    def __init__(self):
        self.stack = []


    def push(self, val: int) -> None:
        curr_min = self.getMin()
        self.stack.append((val, val if curr_min is None else min(curr_min, val)))


    def pop(self) -> None:
        self.stack.pop()


    def top(self) -> int:
        if len(self.stack) == 0:
            return None
        return self.stack[-1][0]


    def getMin(self) -> int:
        if len(self.stack) == 0:
            return None
        return self.stack[-1][1]
```

## 思路：单独的栈，2 倍长度

上面的思路中栈每次存入一个元组依然会造成更多的空间使用，这次我们每次加入元素时向栈中加入 2 个值，第一次我们放入最小值，第二次放入原始值。然后为了方便起见，我们根据题目的约束删掉一些不必要的空值 check。

这个思路可以有效优化空间复杂度，相对使用元组每次储存 2 个值，在一个数组中依次存入 2 个值会使用更少的空间。毕竟，元组本身也会占据内存空间。

```python
class MinStack:

    def __init__(self):
        self.stack = []


    def push(self, val: int) -> None:
        if len(self.stack) > 0:
            self.stack.append(min(self.stack[-2], val))
        else:
            self.stack.append(val)
        self.stack.append(val)


    def pop(self) -> None:
        self.stack.pop()
        self.stack.pop()


    def top(self) -> int:
        return self.stack[-1]


    def getMin(self) -> int:
        return self.stack[-2]
```
