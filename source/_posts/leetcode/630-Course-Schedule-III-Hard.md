---
date: '2021-06-07T15:36:05.534Z'
tags:
  - Array
  - Greedy
  - Heap (Priority Queue)
title: 630. Course Schedule III (Hard)
---

课程安排问题。一共有 `n` 门不同的在线课程，你会得到一个 `courses` 数组包含每门课程的持续时间和最后期限。

你将从第 1 天开始课程学习，你 1 天只能专注一门课程，不能多门课程同时进行。

计算出你最多能完成多少门课程。

<!-- more -->

## 思路 1，优先队列

虽然做出来了，但是成绩比较差，这一块需要研究一下。

```python
class Solution:
    def scheduleCourse(self, courses: List[List[int]]) -> int:
        c = [x for x in sorted(courses, key=lambda x: x[1])]
        heap = []
        time = 0
        for i, x in enumerate(c):
            if time + x[0] <= x[1]:
                time += x[0]
            elif len(heap) > 0 and heap[-1] > x[0] and time - heap[-1] + x[0] <= x[1]:
                time +=  - heap.pop() + x[0]
            else:
                continue

            heap.append(x[0])
            heap.sort()

        return len(heap)
```

## 思路 2, 大根堆

```python
class Solution:
    def scheduleCourse(self, courses: List[List[int]]) -> int:
        c = [x for x in sorted(courses, key=lambda x: x[1])]
        time, heap = 0, []

        for i, x in enumerate(c):
            if time + x[0] <= x[1]:
                time += x[0]
                heappush(heap, -x[0])
            elif heap:
                if -heap[0] > x[0]:
                    time += heappop(heap) + x[0]
                    heappush(heap, -x[0])

        return len(heap)
```
