---
date: '2021-04-06T15:36:05.461Z'
tags:
  - Array
  - DP
  - Matrix
title: 63. Unique Paths II (Medium)
categories:
  - leetcode
---

路径问题。一个机器人在 `m x n` 矩阵的左上角 (0, 0) 位置，矩阵中存在诺干障碍物，机器人只能向下或者向右移动，你需要实现一个程序计算机器人有多少条路径可以到达右下角的 (m, n) 位置。

这是典型的 DP 问题。

<!-- more -->

## 思路 DP

```python
class Solution:
    def uniquePathsWithObstacles(self, og: List[List[int]]) -> int:
        for x in range(len(og)):
            for y in range(len(og[0])):
                if x == 0 and y == 0:
                    up, left = 0, 1
                else:
                    up = og[x-1][y] if x > 0 else 0
                    left = og[x][y-1] if y > 0 else 0
                if og[x][y] == 0:
                    og[x][y] = up + left
                else:
                    og[x][y] = 0
        return og[-1][-1]
```
