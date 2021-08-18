---
date: '2021-04-30T15:36:05.485Z'
tags:
  - Array
  - DP
title: 120. Triangle (Medium)
---

你有一个三角形形状的 2D 数组，你需要找到从最顶层走到最底层的最短路径。

限制是每一步你只能下一层，且每一步你只能选择下一层的同下标位置或者下标 +1 位置。

> Given a `triangle` array, return the minimum path sum from top to bottom.
>
> For each step, you may move to an adjacent number of the row below. More formally, if you are on index `i` on the current row, you may move to either index `i` or index `i + 1` on the next row.

看看例子才能更好理解题目，这题看上去需要计算所有可能才能知道答案，或许是 DP 的用武之地。

<!-- more -->

Example 1:

```
Input: triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]
Output: 11
Explanation: The triangle looks like:
   2
  3 4
 6 5 7
4 1 8 3
The minimum path sum from top to bottom is 2 + 3 + 5 + 1 = 11 (underlined above).
```

Example 2:

```
Input: triangle = [[-10]]
Output: -10
```

Constraints:

1 <= triangle.length <= 200
triangle[0].length == 1
triangle[i].length == triangle[i - 1].length + 1
-104 <= triangle[i][j] <= 104

## 思路 & Solutions

```python
class Solution:
    def minimumTotal(self, triangle: List[List[int]]) -> int:
        for depth in range(1, len(triangle)):
            lastsz = len(triangle[depth-1])
            for pos, x in enumerate(triangle[depth]):
                if pos == 0:
                    prev = triangle[depth-1][pos]
                elif pos == lastsz:
                    prev = triangle[depth-1][-1]
                else:
                    prev = min(triangle[depth-1][pos-1], triangle[depth-1][pos])
                triangle[depth][pos] = x + prev

        return min(triangle[-1])
```
