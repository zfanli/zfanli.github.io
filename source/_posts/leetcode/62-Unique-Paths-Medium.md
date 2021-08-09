---
date: '2021-04-04T15:36:05.459Z'
excerpt: ''
tags:
  - Math
  - DP
  - Combinatorics
title: 62. Unique Paths (Medium)
categories:
  - leetcode
---

```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        dp = [[1]*n] * m
        for x in range(1, m):
            for y in range(1, n):
                dp[x][y] = dp[x-1][y] + dp[x][y-1]
        return dp[m-1][n-1]
```
