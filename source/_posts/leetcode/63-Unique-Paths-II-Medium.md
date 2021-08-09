---
date: '2021-04-06T15:36:05.461Z'
excerpt: ''
tags:
  - Array
  - DP
  - Matrix
title: 63. Unique Paths II (Medium)
categories:
  - leetcode
---

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
