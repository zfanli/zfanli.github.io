---
date: '2021-03-29T15:36:05.453Z'
tags:
  - Array
  - Math
  - Matrix
title: 48. Rotate Image (Medium)
---

矩阵问题。旋转图片 90 度。

图片本身是一组储存了颜色信息的矩阵数据，旋转一张图片即将矩阵中对应的颜色值移动到对应的位置上。

<!-- more -->

## 思路

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
