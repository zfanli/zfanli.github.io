---
date: '2021-06-19T15:36:05.548Z'
tags:
  - Array
  - DP
title: 746. Min Cost Climbing Stairs (Easy)
---

爬楼梯游戏。你在爬一段楼梯，你会得到一个 `cost` 数组记录爬到每一级台阶的消耗。

一旦你付出当前台阶的消耗，你可以选择往上爬一级或两级台阶。另外，你可以选择从第一级台阶或第二级台阶开始游戏。

求爬到顶部的最小消耗。这是一道 DP 应用的简单题目。

<!-- more -->

## 思路 1，DP

仔细观察能发现每一步的 `cost` 都取前两步 `cost` 的最小值，那么我们可以准备一个数组来存计算过的最小 `cost`。

话虽如此，这道题叙述有些模糊，经过尝试可以明确以下信息：

- 下标 0 和 1 的 `cost` 都为 0，因为第一步最大可以走到下标 1 的位置，而第一步是没有 `cost` 的；
- 最后一步要超过最后一个元素，下标要达到数组长度。

```python
class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        n = len(cost)
        mincost = [0] * (n + 1)
        # 0，1 的 cost 都为 0，我们直接从 2 开始遍历，到 n （包含）结束。
        for i in range(2, n + 1):
            # 每一步 i 的 cost 都为前一步的值加上到达前一步的最小值。
            # 其中前一步可以选择 i - 1 和 i - 2。
            mincost[i] = min(
                mincost[i - 1] + cost[i - 1],
                mincost[i - 2] + cost[i - 2]
            )
        return mincost[-1]
```

## 思路 2，优化 DP

仔细一看发现我们每次只看 2 个值，那么可以优化 O(n) 空间复杂度到 O(1)。

```python
class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        st1 = st2 = 0
        for i in range(2, len(cost) + 1):
            # 按照从左到右的顺序依次是 st2、st1、st0，每一个迭代我们丢弃 st2 的值，
            # 将 st1、st0 作为下一次迭代的 st2、st1。
            st0 = min(st1 + cost[i - 1], st2 + cost[i - 2])
            st1, st2 = st0, st1
        return st1
```
