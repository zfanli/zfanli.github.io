---
date: '2021-03-29T15:36:05.453Z'
tags:
  - Array
  - Math
  - Matrix
title: 48. Rotate Image (Medium)
categories:
  - leetcode
---

```python
class Solution:
    def rotate(self, m: List[List[int]]) -> None:
        """
        Do not return anything, modify matrix in-place instead.
        """
        sz = len(m)

        for i in range(sz // 2 + sz % 2):
            for j in range(sz // 2):
                m[i][j], m[j][~i], m[~i][~j], m[~j][i] = m[~j][i], m[i][j], m[j][~i], m[~i][~j]
```
