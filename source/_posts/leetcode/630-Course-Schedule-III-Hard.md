---
date: '2021-06-07T15:36:05.534Z'
tags:
  - Array
  - DFS
  - Graph
  - BFS
title: 630. Course Schedule III (Hard)
categories:
  - leetcode
---

Topics:

Greed, graph, dfs, bfs.

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

Ver 2.0, using max heap.

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
