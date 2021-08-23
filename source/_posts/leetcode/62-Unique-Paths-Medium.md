---
date: '2021-04-04T15:36:05.459Z'
tags:
  - Math
  - DP
  - Combinatorics
title: 62. Unique Paths (Medium)
categories:
  - leetcode
---

组合问题。机器人在矩阵的左上角需要去矩阵的右下角，且机器人只能向下和向右行动。

你需要实现一个程序计算机器人有多少条路径到达右下角。

<!-- more -->

## 思路 DP

```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        dp = [[1]*n] * m
        for x in range(1, m):
            for y in range(1, n):
                dp[x][y] = dp[x-1][y] + dp[x][y-1]
        return dp[m-1][n-1]
```
