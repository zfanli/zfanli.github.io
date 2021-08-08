---
date: "2021-05-06T15:36:05.493Z"
excerpt: ""
tags:
  - Stack
  - Tree
  - DFS
  - Binary Tree
title: 144. Binary Tree Preorder Traversal (Easy)
---

遍历树有三种方法，分别是前序 pre-order、中序 in-order 和后序 post-order 遍历。这道题是前序遍历。

前序遍历的递归写法没有难度。

思路 1，递归

```python
class Solution:
    def preorderTraversal(self, root: TreeNode) -> List[int]:
        ans = []

        def traverse(node):
            if node is None:
                return
            ans.append(node.val)
            traverse(node.left)
            traverse(node.right)

        traverse(root)
        return ans
```

思路 2，遍历

使用 stack 或队列按顺序记录需要检查的节点，需要关注的是：

- stack 是先进后出，要保证先左后右的顺序，需要先放入右 child，再放入左 child；
- 队列是先进先出，按正常顺序放入左右 child 即可。

```python
class Solution:
    def preorderTraversal(self, root: TreeNode) -> List[int]:
        ans, stack = [], [root]

        while len(stack) > 0:
            node = stack.pop()
            if node is None:
                continue
            ans.append(node.val)
            stack.append(node.right)
            stack.append(node.left)

        return ans
```
