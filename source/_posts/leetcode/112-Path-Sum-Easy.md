---
tags:
  - Tree
  - DFS
  - Binary Tree
title: 112. Path Sum (Easy)
date: "2021-08-12T12:51:38.367Z"
---

二叉树问题。求是否存在和目标值一致的路径和。

路径和指的是从根节点到叶子节点的路径的值相加的结果。

看上去这道题适合 DFS 一条路径一条路径的遍历解决。

<!-- more -->

## 思路 1，递归，前序遍历

一层一层求和直到叶子节点，判断是否和目标一致。

```python
class Solution:
    def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:
        if not root:
            return False

        def dfs(node, curr):
            curr += node.val
            if not node.left and not node.right:
                return curr == targetSum
            if node.left and dfs(node.left, curr):
                return True
            if node.right and dfs(node.right, curr):
                return True
            return False

        return dfs(root, 0)
```

## 思路 2，另一种前序遍历写法

相同思路，另一种写法。这次我们用解题函数自身作为 DFS 函数，也不再进行求和判断，相反我们每次遍历从目标值中减去遇到的值。

这两种方法没有本质区别。

```python
class Solution:
    def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:
        if not root:
            return False

        if not root.left and not root.right and root.val == targetSum:
            return True
        if self.hasPathSum(root.left, targetSum - root.val):
            return True
        if self.hasPathSum(root.right, targetSum - root.val):
            return True

        return False
```

## 思路 3，迭代

有递归的地方就有 Stack，来试试用迭代的方式实现这个过程。

迭代的方式注意点在于我们需要同时保存节点和累积值。

这个思路的逻辑看上去要更简洁。

```python
class Solution:
    def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:
        if not root:
            return False

        stack = [(root, root.val)]
        while stack:
            node, val = stack.pop()
            if not node.left and not node.right and val == targetSum:
                return True
            if node.left:
                stack.append((node.left, node.left.val + val))
            if node.right:
                stack.append((node.right, node.right.val + val))

        return False
```
