---
date: "2021-07-17T15:36:05.576Z"

tags:
  - DFS
  - Graph
  - Biconnected Component
  - Need Review
title: 1192. Critical Connections in a Network (Hard)
---

## Before diving into the Solution

图论问题。一共有 `n` 台服务器，我们将存在于任意 2 台服务器之间链接定义为边，可以构成一张无向图。

给定一个 `connections` 数组定义这个服务器网络的所有链接（边），在这个网络上任何节点都可以直接或间接的相互访问。

关键链接指的是这个网络中的某一个节点如果被移除，将导致一部分服务器无法访问到另一部分。

要求找到所有关键链接。

<!-- more -->

## 思路

> 解题思路需要 review 和重新记录。理论上思路是依次尝试移除一个链接，然后检查所有服务器是否还能互联。

```python
class Solution:
    def criticalConnections(self, n: int, connections: List[List[int]]) -> List[List[int]]:
        # make adjacency-list of connections
        adj = defaultdict(list)
        for u, v in connections:
            adj[u].append(v)
            adj[v].append(u)

        # define dfs
        def dfs(u, prev, id, ids, ans):
            ids[u] = id
            for v in adj[u]:
                if v == prev:
                    continue
                elif ids[v] == -1:
                    ids[u] = min(ids[u], dfs(v, u, id+1, ids, ans))
                else:
                    ids[u] = min(ids[u], ids[v])

            if id != 0 and ids[u] == id:
                ans.append([u, prev])

            return ids[u]

        ans = []
        ids = [-1] * n
        dfs(0, -1, 0, ids, ans)

        return ans
```
