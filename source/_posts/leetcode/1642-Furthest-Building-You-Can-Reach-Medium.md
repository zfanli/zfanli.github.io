---
date: '2021-07-31T15:36:05.597Z'
tags:
  - Array
  - Greedy
  - Heap (Priority Queue)
title: 1642. Furthest Building You Can Reach (Medium)
categories:
  - leetcode
---

## Before diving into the Solution

爬楼游戏。给你一个数组 `heights` 表示你面前的大楼的高度，你从 `0` 出发，你有一些砖块的梯子。当你从当前位置爬到下一个位置时需要满足下面的条件。

- 如果当前楼层高度**大于或等于**下一个大楼的高度，你可以直接过去，不需要使用砖块或梯子；
- 如果当前楼岑高度**小于**下一个大楼的高度，你可以选择使用 1 个梯子，或者两栋楼高度差数量的砖块过去。

重点在于梯子可以爬任意高度，砖块则需要消耗高度差的数量。求你可以到达的最远距离。贪心算法和优先队列可以解决这个问题。

<!-- more -->

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
