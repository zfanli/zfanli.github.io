---
date: '2021-06-03T15:36:05.527Z'
tags:
  - Stack
  - Tree
  - DFS
title: 589. N-ary Tree Preorder Traversal (Easy)
---

N 叉树前序遍历问题。和二叉树前序遍历的区别在于...多了几个 child，仅此而已。

> Given the root of an n-ary tree, return the preorder traversal of its nodes' values.
>
> Nary-Tree input serialization is represented in their level order traversal. Each group of children is separated by the null value (See examples)

<!-- more -->

## 思路

```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children
"""

class Solution:
    def preorder(self, root: 'Node') -> List[int]:
        if root is None:
            return []

        ans, stack = [], [root,]

        while stack:
            top = stack.pop()
            ans.append(top.val)
            stack.extend(top.children[::-1])

        return ans


```
