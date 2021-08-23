---
date: '2021-05-18T15:36:05.509Z'
tags:
  - Array
  - Design
  - Matrix
  - Prefix Sum
title: 304. Range Sum Query 2D - Immutable (Medium)
---

你有一个 2D 矩阵 `matrix`，你需要实现一个程序处理多次子矩阵求和的查询。

每次查询你会得到 2 个坐标，分别代表子矩阵的左上坐标和右下坐标，返回这个子矩阵的和。

典型的前缀和问题，所以我们讨论如何应用前缀和解决这道题。

<!-- more -->

## 思路

类似 1074，先求 Prefix Sum，然后计算子矩阵和。

```python
class NumMatrix:

    def __init__(self, matrix: List[List[int]]):
        m, n = len(matrix), len(matrix[0])

        for j in range(1, n):
            matrix[0][j] += matrix[0][j - 1]

        for i in range(1, m):
            for j in range(n):
                if j > 0:
                    matrix[i][j] += matrix[i][j - 1] - matrix[i - 1][j - 1]
                matrix[i][j] += matrix[i - 1][j]

        self._m = matrix


    def sumRegion(self, row1: int, col1: int, row2: int, col2: int) -> int:
        ans = self._m[row2][col2]
        if row1 > 0:
            ans -= self._m[row1 - 1][col2]
        if col1 > 0:
            ans -= self._m[row2][col1 - 1]
        if row1 > 0 and col1 > 0:
            ans += self._m[row1 - 1][col1 - 1]
        return ans

# Your NumMatrix object will be instantiated and called as such:
# obj = NumMatrix(matrix)
# param_1 = obj.sumRegion(row1,col1,row2,col2)
```
