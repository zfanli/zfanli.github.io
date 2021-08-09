---
date: "2021-06-01T15:36:05.524Z"
excerpt: ""
tags:
  - String
title: 583. Delete Operation for Two Strings (Medium)
---

Topics:

String.

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
