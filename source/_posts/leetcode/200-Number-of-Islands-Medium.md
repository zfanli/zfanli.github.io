---
title: 200. Number of Islands (Medium)
tags:
  - Array
  - DFS
  - BFS
  - Union Find
  - Matrix
date: "2021-09-09T13:17:38.415Z"
---

有一个 `m x n` 的 2D 数组 `grid`，其中每个元素的值为 `'1'` 时表示土地，为 `'0'` 时表示海水。你需要找到一共存在多少个小岛。小岛的定义：小岛由相邻的土地构成，四面环海。土地相邻表示相互共有一条边。

<!-- more -->

## 思路 BFS + 追踪已访问元素

这个思路偏重不去修改输入数据，所以我们需要准备一个 `visited` 2D 数组来追踪遍历的状态，来避免重复遍历相同的元素。

主要的计算过程在于我们依次遍历 2D 输入数据，使用一个 `search` 辅助方法来搜索并标记所有已经遍历过的元素。`search` 做的事情实际上是使用 BFS 算法每次将所有相邻的土地放入队列，重复直到不存在相邻的陆地为止，细节可以参考代码注释。

```python
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        q, ans = deque(), 0
        m, n = len(grid), len(grid[0])
        visited = [[False] * n for _ in range(m)]

        def search(i, j):
            visited[i][j] = True

            # 如果目标并非陆地则直接返回找到 0 个小岛
            if grid[i][j] != "1":
                return 0

            # 初始化队列准备开始 BFS
            q.append([i, j])

            while q:
                # 拿到下一个坐标
                x, y = q.popleft()
                # 遍历 4 个方向的坐标
                for dx, dy in [(1, 0), (0, 1), (-1, 0), (0, -1)]:
                    # 计算相邻坐标
                    x1, y1 = x + dx, y + dy
                    # 如果相邻坐标不存在或已经遍历过则跳过
                    if x1 < 0 or x1 == m or y1 < 0 or y1 == n or visited[x1][y1]:
                        continue
                    # 检查是否存在相邻的陆地
                    if grid[x1][y1] == "1":
                        q.append([x1, y1])
                    # 标记已遍历
                    visited[x1][y1] = True

            # 所有小岛范围的陆地遍历结束，返回找到 1 个小岛
            return 1

        for i in range(m):
            for j in range(n):
                if not visited[i][j]:
                    ans += search(i, j)

        return ans
```

## 思路 BFS + 优化空间复杂度

这个版本在上一个思路上直接修改输入数据来优化额外的空间使用。具体看代码注释。

```python
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        q, ans = deque(), 0
        m, n = len(grid), len(grid[0])

        def search(i, j):
            # 标记已遍历
            grid[i][j] = ""
            # 初始化 BFS 队列
            q.append([i, j])
            while q:
                # 拿到下一个坐标
                x, y = q.popleft()
                # 遍历 4 个方向的坐标
                for dx, dy in [(1, 0), (0, 1), (-1, 0), (0, -1)]:
                    # 计算相邻坐标
                    x1, y1 = x + dx, y + dy
                    # 如果相邻坐标不存在或不为陆地则跳过
                    if x1 < 0 or x1 == m or y1 < 0 or y1 == n or grid[x1][y1] != "1":
                        continue
                    # 保存坐标进行下一轮搜索
                    q.append([x1, y1])
                    # 标记已遍历
                    grid[x1][y1] = ""

        for i in range(m):
            for j in range(n):
                if grid[i][j] == "1":
                    ans += 1
                    search(i, j)

        return ans
```

Python 的成绩不是很理想，尝试用 Java 实现这个算法。结果还是很糟糕。

```java
class Solution {
    private static final int[][] MATRIX = new int[][] {
        new int[] {1, 0}, new int[] {0, 1},
        new int[] {-1, 0}, new int[] {0, -1}
    };

    public int numIslands(char[][] grid) {
        int ans = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == '1') {
                    ans++;
                    search(grid, i, j);
                }
            }
        }
        return ans;
    }

    private void search(char[][] grid, int i, int j) {
        grid[i][j] = '0';
        Queue<int[]> q = new LinkedList<>();
        q.offer(new int[] {i, j});
        while (q.size() > 0) {
            int[] idx = q.poll();
            for (int[] delta : MATRIX) {
                int x = idx[0] + delta[0];
                int y = idx[1] + delta[1];
                if (x < 0 || y < 0 || x == grid.length || y == grid[0].length) {
                    continue;
                } else if (grid[x][y] == '1') {
                    grid[x][y] = '0';
                    q.offer(new int[] {x, y});
                }
            }
        }
    }
}
```

## 思路 DFS

DFS 思路比较简洁明了，`search` 中如果发现当前坐标是陆地，则继续向四个方向搜索。从结果上来看这道题的 DFS 的效率与 BFS 相差无几。

```python
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        m, n, ans = len(grid), len(grid[0]), 0

        def search(i, j):
            if i < 0 or j < 0 or i == m or j == n or grid[i][j] != "1":
                return

            grid[i][j] = ""
            search(i + 1, j)
            search(i - 1, j)
            search(i, j + 1)
            search(i, j - 1)

        for i in range(m):
            for j in range(n):
                if grid[i][j] == "1":
                    ans += 1
                    search(i, j)

        return ans
```

```java
class Solution {
    private int m;
    private int n;

    public int numIslands(char[][] grid) {
        int ans = 0;
        m = grid.length;
        n = grid[0].length;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                ans += search(grid, i, j);
            }
        }

        return ans;
    }

    private int search(char[][] grid, int i, int j) {
        if (i < 0 || j < 0 || i == m || j == n || grid[i][j] != '1')
            return 0;

        grid[i][j] = '0';

        search(grid, i + 1, j);
        search(grid, i - 1, j);
        search(grid, i, j + 1);
        search(grid, i, j - 1);

        return 1;
    }
}
```

## 思路 Union-Find

并查集的思路在于准备一个 1D 数组，每次查找到一个陆地则将其索引对应的位置设为陆地的起始值，这样连成一个小岛的陆地对应的数据都指向同一个值。这样当我们搜索完 2D 数组之后，对这个 1D 数组计算不重复的元素数量即为答案。

```python
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        m, n = len(grid), len(grid[0])
        par = [-1] * (m * n)

        def find(x):
            """查找并更新起始位置"""
            if par[x] == x:
                return x
            par[x] = find(par[x])
            return par[x]

        def union(x, y):
            """合并2个集合"""
            f1, f2 = find(x), find(y)
            if f1 != f2:
                par[f1] = par[f2]

        for i in range(m):
            for j in range(n):
                if grid[i][j] == "1":
                    par[i * n + j] = i * n + j
                    if i - 1 >= 0 and grid[i - 1][j] == "1":
                        union(i * n + j, (i - 1) * n + j)
                    if j - 1 >= 0 and grid[i][j - 1] == "1":
                        union(i * n + j, i * n + j - 1)

        res = set()
        for i in range(len(par)):
            if par[i] != -1:
                res.add(find(i))

        return len(res)
```

## 总结

或许这道题是经典题目，上面几个思路的算法结果来看效率相差不大，但是成绩不是很理想。猜测是同样算法提交了很多次，根据解题机器的负载情况对成绩有一定影响，或许多跑几次会得到一个好成绩吧。
