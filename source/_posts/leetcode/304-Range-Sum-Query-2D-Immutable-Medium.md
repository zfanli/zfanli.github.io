---
date: "2021-05-18T15:36:05.509Z"

tags:
  - DP
title: 304. Range Sum Query 2D - Immutable (Medium)
---

Topics:

DP.

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
