---
date: "2021-06-23T15:36:05.552Z"

tags:
  - Binary Search
  - Heap
  - DFS
  - Union Fold
title: 778. Swim in Rising Water (Hard)
---

这是一道求最合适路径的题目，可以应用图论中的 Dijkstra 算法。

> Dijkstra‘s Algorithm 适用于求**权重不为负数的加权图**起点到终点的最优路径。

这道题的 input 是一个 `n * n` 的矩阵，可以将其视作所有元素都与其上下左右相互连接的一张无向图，每个顶点的数值表示到达这个顶点的边的权重，我们需要求的是从起点 `(0, 0)` 到终点 `(n, n)` 的最优路径。这道题要求我们计算的是这条路径上权重最大值，所以我们用一个变量来保持每一次选择后的权重最大值。

下面是算法：

- 从 `(0, 0)` 开始，将四个方向能访问的顶点加权后放入小根堆：
  - 根据题目的限制，`n <= 50`，所以我们留出 2 进制 6 位（`2^6=64`）便足够放下下标的长度来；
  - 加权后的值 = `(grid[x][y] << 12) + (x << 6) + y`;
- 选择小根堆中的最小值继续往下走：
  - 现在我们选了一个新的值，用其和全局最大值再取一次最大值，更新全局变量；
  - 从加权后的值中恢复这个值的 `x, y` 下标；
- 重复这个过程直到终点 `(n, n)`。

```python
moves = ((-1, 0), (0, -1), (1, 0), (0, 1))
mask = (1 << 6) - 1

class Solution:
    def swimInWater(self, grid: List[List[int]]) -> int:
        n, ans, i, j, q = len(grid) - 1, grid[0][0], 0, 0, []
        while i < n or j < n:
            for a, b in moves:
                _i, _j = i + a, j + b
                if _i < 0 or _i > n or _j < 0 or _j > n or grid[_i][_j] == math.inf:
                    continue
                heapq.heappush(q, (grid[_i][_j] << 12) + (_i << 6) + _j)
                grid[_i][_j] = math.inf
            nxt = heapq.heappop(q)
            ans = max(ans, nxt >> 12)
            i, j = (nxt >> 6) & mask, nxt & mask
        return ans
```

Java 版用 PriorityQueue 实现小根堆。

```java
class Solution {
    private int[][] moves = new int[][] {
        {0, 1}, {1, 0}, {0, -1}, {-1, 0}
    };
    private int mask = (1 << 6) - 1;

    public int swimInWater(int[][] grid) {
        int ans = grid[0][0];
        int n = grid.length - 1;
        Queue<Integer> pq = new PriorityQueue<>();
        int i = 0, j = 0;
        while (i != n || j != n) {
            for (int[] m : moves) {
                int mi = i + m[0], mj = j + m[1];
                if (mi < 0 || mi > n || mj < 0 || mj > n
                    || grid[mi][mj] == Integer.MAX_VALUE) {
                    continue;
                }
                pq.add((grid[mi][mj] << 12) + (mi << 6) + mj);
                grid[mi][mj] = Integer.MAX_VALUE;
            }
            int next = pq.poll();
            ans = Math.max(ans, next >> 12);
            i = (next >> 6) & mask;
            j = next & mask;
        }
        return ans;
    }
}
```
