---
date: '2021-06-01T15:36:05.524Z'
tags:
  - String
  - DP
title: 583. Delete Operation for Two Strings (Medium)
---

字符串问题。你有两个字符串，允许你每次在任意一个字符串上删除一个字符，求需要多少步才能让两个字符串相等。

使用 DP 解决这道题。

<!-- more -->

## 思路

```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        dp = {}

        for i in range(m + 1):
            for j in range(n + 1):
                if i == 0 or j == 0:
                    dp[i, j] = i + j
                elif word1[i - 1] == word2[j - 1]:
                    dp[i, j] = dp[i - 1, j - 1]
                else:
                    dp[i, j] = 1 + min(dp[i - 1, j], dp[i, j - 1])

        return dp[m, n]
```
