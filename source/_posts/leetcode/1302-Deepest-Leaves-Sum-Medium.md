---
date: '2021-07-19T15:36:05.580Z'
tags:
  - Tree
  - DFS
  - BFS
  - Binary Tree
title: 1302. Deepest Leaves Sum (Medium)
categories:
  - leetcode
---

求二叉树最深层的所有节点的值之和。二叉树层序遍历的应用场景。

虽然题目的 tag 包含 DFS，但是感觉用 DFS 思路比 BFS 还要复杂并且低效，所以这题我们只讨论 BFS 思路。

<!-- more -->

## 思路

计算每一层的和，直到最后一层完成计算，返回计算的和。

```python
class Solution:
    def deepestLeavesSum(self, root: TreeNode) -> int:
        queue = [root]
        ans = 0

        while len(queue) > 0:
            size = len(queue)
            ans = 0
            for x in range(size):
                node = queue.pop(0)
                ans += node.val
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)

        return ans
```
