---
date: "2021-07-31T15:36:05.597Z"
excerpt: Binary search (what?), heap.
tags:
  - Binary Search
  - Heap
title: 1642. Furthest Building You Can Reach (Medium)
---

Topics:

Binary search (what?), heap.

```python
class Solution:
    def furthestBuilding(self, h: List[int], bricks: int, ladders: int) -> int:
        lv = []

        for x in range(1, len(h)):
            gap = h[x] - h[x-1]
            if gap <= 0:
                continue
            lv.append(gap)
            if gap <= bricks:
                bricks -= gap
                continue
            elif ladders != 0:
                lv.sort()
                ladders -= 1
                bricks += lv.pop() - gap
                continue
            else:
                return x - 1

        return len(h) - 1
```

Ver 2.0 using max heap.

```python
class Solution:
    def furthestBuilding(self, heights: List[int], bricks: int, ladders: int) -> int:
        heap = []

        for i in range(1, len(heights)):
            if heights[i] > heights[i - 1]:
                h = heights[i] - heights[i - 1]
                heappush(heap, -h)
                bricks -= h
                if bricks >= 0:
                    continue
                elif ladders != 0:
                    bricks -= heappop(heap)
                    ladders -= 1
                else:
                    return i - 1

        return len(heights) - 1
```
