---
title: 622. Design Circular Queue (Medium)
tags:
  - Array
  - Linked List
  - Design
  - Queue
date: '2021-09-07T09:24:50.312Z'
---

设计并实现一个循环队列。循环队列是一个线性数据结构，遵循先进先出原则，队列头尾相互连接形成一个环，也叫做环形缓冲区（Ring Buffer）。

在常规队列中，一旦队列满了也就无法再添加元素入列，就算队列头前面存在空位。但是使用循环队列，无论空位在队列头的前面还是后面，只要存在空位就可以被利用上。

这道题要求实现的循环队列要有下面的方法：

- `MyCircularQueue(k)` 以指定值 `k` 初始化队列大小
- `int Front()` 返回队列头的元素，如果队列为空则返回 `-1`
- `int Rear()` 返回队列尾的元素，如果队列为空则返回 `-1`
- `boolean enQueue(int value)` 添加新的元素入列，如果成功则返回 `true`
- `boolean deQueue()` 让队列头元素出列，如果成功则返回 `true`
- `boolean isEmpty()` 检查队列是否为空
- `boolean isFull()` 检查队列是否已满

<!-- more -->

## 思路

按照每个方法分别讨论一下思路，这道题的注意点在于索引是循环的，我们通过取模来保证索引不会超过数组长度。

### `MyCircularQueue(k)`

初始化时只需要准备一个指定长度的数组，初始化队列头尾的指针即可。将 `k` 的值保留，后续需要使用它来取模。

### `int Front()`

对于返回队列头的逻辑，我们只需要判断当前队列是否为空：为空时返回 `-1`；否则返回队列头指针对应的元素。

### `int Rear()`

对于返回队列尾的逻辑，我们只需要判断当前队列是否为空：为空时返回 `-1`；否则返回队列尾指针对应的元素。

### `boolean enQueue(int value)`

入列逻辑需要考虑几个条件。

- 如果当前队列已满直接返回 `False`；
- 继续判断如果队列为空则将值放在 `0` 位置，将队列头尾指针都置为 `0`；
- 否则给队列尾指针右移一个位置，将新的值放在对应位置。
  - 指针向右移动时给尾指针的值 `+1`，这可能会造成指针的值超过数组长度，所以还需将其与 `k` 取模。

### `boolean deQueue()`

出列逻辑相似。

- 如果当前队列为空直接返回 `False`；
- 继续判断如果当前头尾指针指向同一个元素，则将 2 个指针都置为 `-1`；
- 否则将头指针向右移一个位置。
  - 指针向右移动时给头指针的值 `+1`，这可能会造成指针的值超过数组长度，所以还需将其与 `k` 取模。

### `boolean isEmpty()`

检查队列是否为空我们只需要检查 2 个指针是否为 `-1`。实际上如果一个指针为 `-1` 时，另一个同样也必须为 `-1`，所以实际上我们只需要判断头指针是否为 `-1`。

### `boolean isFull()`

检查队列是否已满我们可以判断尾指针与头指针是否相差 1 个单位。可以手动计算尾指针加 1 后的值是够等于头指针，需要注意指针的值增加可能会导致超过长度 `k`，所以在对比头指针之前还需要做取模操作。

```python
class MyCircularQueue:

    def __init__(self, k: int):
        self.queue = [None] * k
        self.front = self.rear = -1
        self.k = k

    def enQueue(self, value: int) -> bool:
        if self.isFull():
            return False

        if self.isEmpty():
            self.front = self.rear = 0
        else:
            self.rear += 1
            self.rear %= self.k

        self.queue[self.rear] = value
        return True

    def deQueue(self) -> bool:
        if self.isEmpty():
            return False
        self.queue[self.front] = None
        if self.front == self.rear:
            self.front = self.rear = -1
        else:
            self.front += 1
            self.front %= self.k
        return True

    def Front(self) -> int:
        if self.front == -1:
            return -1
        return self.queue[self.front]

    def Rear(self) -> int:
        if self.rear == -1:
            return -1
        return self.queue[self.rear]

    def isEmpty(self) -> bool:
        return self.front == -1

    def isFull(self) -> bool:
        return (self.rear + 1) % self.k == self.front
```
