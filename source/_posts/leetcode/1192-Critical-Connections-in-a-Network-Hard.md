---
date: '2021-07-17T15:36:05.576Z'
excerpt: ''
tags:
  - DFS
  - Graph
  - Biconnected Component
title: 1192. Critical Connections in a Network (Hard)
categories:
  - leetcode
---

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
