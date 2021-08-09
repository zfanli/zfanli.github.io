---
date: "2021-04-22T15:36:05.478Z"

tags:
  - Tree
  - BFS
  - DFS
  - Binary Tree
title: 104. Maximum Depth of Binary Tree (Easy)
---

求二叉树的最大深度。

思路 1，Top-Down，递归

在递归过程中，我们先根据当前层的深度更新结果，然后针对子节点进行递归调用，重复这个过程直到遍历完整棵树。这是从上至下的解题方法，顺序体现在我们何时处理当前节点的值。

这个思路可以解决问题，但是从逻辑上来说，如果存在子节点，那么当前节点的深度肯定不是最终答案，Top-Down 方法或许不是最符合这道题目逻辑的方法。

```python
class Solution:
    def maxDepth(self, root: TreeNode) -> int:
        ans = 0

        def traverse(node, depth):
            if not node:
                return
            nonlocal ans
            ans = max(ans, depth)
            traverse(node.left, depth + 1)
            traverse(node.right, depth + 1)

        traverse(root, 1)
        return ans
```

思路 2，Bottom-Up，递归

在从下至上的方法中，我们先去计算以当前节点开始其子节点的最大深度，在结果的基础上 +1 作为当前节点的深度结束递归过程。

```python
class Solution:
    def maxDepth(self, root: TreeNode) -> int:

        def traverse(node):
            if not node:
                return 0
            return 1 + max(traverse(node.left),
                           traverse(node.right))

        return traverse(root)
```
