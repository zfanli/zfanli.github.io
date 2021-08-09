---
date: "2021-06-03T15:36:05.527Z"
excerpt: ""
tags:
  - Stack
  - Tree
  - DFS
title: 589. N-ary Tree Preorder Traversal (Easy)
---

> Given the root of an n-ary tree, return the preorder traversal of its nodes' values.
>
> Nary-Tree input serialization is represented in their level order traversal. Each group of children is separated by the null value (See examples)

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
