---
date: '2021-06-13T15:36:05.541Z'
tags:
  - Array
  - DFS
  - BFS
  - Union Fold
  - Matrix
title: 695. Max Area of Island (Medium)
categories:
  - leetcode
---

给定一个尺寸为 `m x n` 的二进制值的矩阵。定义元素的值为 `1` 表示土地，元素值为 `0` 表示海水。

陆地由四边邻接的土地组合而成，陆地的面积是接邻的土地的数量。

求矩阵中的陆地的最大面积，如果不存在陆地则返回 0。

<!-- more -->

## 思路 1，递归

使用 DFS 搜索所有陆地（1），将搜索过的元素标注为 1 以外的数，避免重复计算，每次搜索到一个目标，保持一个最大结果作为答案。

```python
class Solution:
    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:
        m, n, ans = len(grid), len(grid[0]), 0

        def search(x, y):
            if x < 0 or x == m or y < 0 or y == n or grid[x][y] != 1:
                return 0
            grid[x][y]  = -1
            return 1 + search(x, y - 1) + search(x, y + 1) + search(x + 1, y) + search(x - 1, y)

        for i in range(m):
            for j in range(n):
                if grid[i][j] == 1:
                    ans = max(ans, search(i, j))

        return ans
```

## 思路 2，栈

用一个 set `seen` 储存遇到过的格子，避免重复计算。每当遇到陆地，新建一个栈，遍历这个栈，取出栈顶的格子，将其上下左右四个方向存在陆地的格子放到栈顶，重复这个过程直到栈清空，维持一个计数最大值作为答案。

```python
class Solution:
    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:
        m, n, ans, seen = len(grid), len(grid[0]), 0, set()
        for i in range(m):
            for j in range(n):
                if grid[i][j] != 1:
                    continue
                count, stack = 0, [(i, j)]
                while len(stack) > 0:
                    # print(stack)
                    x, y = stack.pop()
                    seen.add((x, y))
                    count += 1
                    for _x, _y in ((x-1, y), (x+1, y), (x, y-1), (x, y+1)):
                        if _x >= 0 and _x < m and _y >= 0 and _y < n and (_x, _y) not in seen:
                            if grid[_x][_y] == 1:
                                stack.append((_x, _y))
                                seen.add((_x, _y))
                ans = max(ans, count)
        return ans
```
