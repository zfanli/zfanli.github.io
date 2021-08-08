---
date: '2021-05-08T15:36:05.496Z'
excerpt: ''
tags:
  - Stack
  - Tree
  - DFS
  - Binary Tree
title: 145. Binary Tree Postorder Traversal (Easy)
categories:
  - leetcode
---

遍历树通常有三种方法，分别是前序遍历（pre-order traversal）、中序遍历（in-order traversal）和后序遍历（post-order traversal）。这道题是后序遍历。

思路 1，递归

三种递归遍历方式的区别仅在于处理的顺序。

```python
class Solution:
    def postorderTraversal(self, root: TreeNode) -> List[int]:
        ans = []

        def traverse(node):
            if node is None:
                return
            traverse(node.left)
            traverse(node.right)
            ans.append(node.val)

        traverse(root)
        return ans
```

思路 2，迭代遍历

后序遍历按照 left -> right -> root 的顺序遍历树，你会发现这和前序遍历相似，我们只需要将前序遍历方法中左右子节点的遍历顺序对调，并将其结果颠倒一下顺序，即可得到后序遍历的结果。

但是这样不够优雅。

我们延续 stack 的思路，通过观察我们知道要完成后序遍历，每次迭代过程中我们可以把当前节点、右节点、左节点按顺序放入 stack 中，针对当前节点，需要将其左右子节点置空表示已经遍历过。

我们的 Base Case 的条件是当前节点没有左右子节点，这表示该节点是叶子节点，或是已经遍历过的节点，针对这两种情况我们直接记录它的值。

重复这个过程，直到完成遍历。

```python
class Solution:
    def postorderTraversal(self, root: TreeNode) -> List[int]:
        ans, stack = [], [root]

        while len(stack) > 0:
            curr = stack.pop()
            if not curr:
                continue
            left, right = curr.left, curr.right
            if not left and not right:
                ans.append(curr.val)
                continue
            curr.left, curr.right = None, None
            stack.append(curr)
            stack.append(right)
            stack.append(left)

        return ans
```

思路 3，迭代遍历，基于中序迭代遍历优化

由于 root 的值是最后记录的，在当前节点存在右节点的情况，还需要将当前节点的右节点置空，重新存入 stack。在空间复杂度上比思路 2 而言没有太大优化。

这个思路下，我们先到达左节点的最下层左节点（即最后一个左节点，该节点的左节点为空），然后根据右节点发生下面分支：

- 右节点不存在：The Base Case，这个节点是叶子节点或访问过的节点，记录它的值；
- 右节点存在：置空当前节点的右节点并存入 stack，将右节点标记为当前节点进入下一个迭代过程。

```python
class Solution:
    def postorderTraversal(self, root: TreeNode) -> List[int]:
        ans, stack, curr = [], [], root

        while curr or len(stack) > 0:
            while curr:
                stack.append(curr)
                curr = curr.left
            curr = stack.pop()
            if curr.right:
                stack.append(curr)
                # 置空当前节点的右节点，标记右节点为当前节点
                curr.right, curr = None, curr.right
                continue
            ans.append(curr.val)
            # 节点已经遍历完成，注意需要清空指针
            curr = None

        return ans
```
