---
tags:
  - Tree
  - BFS
  - DFS
  - Binary Tree
title: 101. Symmetric Tree (Easy)
date: '2021-08-12T08:42:51.663Z'
categories:
  - leetcode
---

检查给定的二叉树是否对称。如果 root 的左右子树互为镜像，那么这棵树是一棵对称树。

这道题实际上需要我们同时遍历两棵树，来判断它们是否对称。

我们尝试从递归、迭代以及 DFS 和 BFS 等角度来尝试解决这道题。

<!-- more -->

## 思路 1，递归，

Top-Down 做法。

实际上我们需要对两棵子树同时进行前序遍历，而要确认它们是否对称，需要我们对遍历顺序做一点修改：

- 左子树：root -> left -> right
- 右子树：root -> right -> left

由于遍历过程是同步的，在每一次遍历中我们都要进行下面的操作以确定当前是否依然对称：

- 当前 2 个节点的值是否相等；
- 左左节点和右右节点是否相等；
- 左右节点和右左节点是否相等。

上述步骤中从上至下，一旦遇到 False，程序就会一步一步退出递归流程，给出结果。

这是一个 DFS 算法，我们会一条路径一条路径的检查整棵树。

```python
class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:

        def dfs(left, right):
            # if one of the nodes does not exist
            if not left or not right:
                return left == right
            # if nodes are not equal
            if left.val != right.val:
                return False
            # check their children symmetrically
            return dfs(left.left, right.right) and dfs(left.right, right.left)

        return dfs(root.left, root.right)
```

## 思路 2，迭代

使用 Stack 数据结构，我们可以把递归过程改成迭代过程。

和递归过程每次传递 2 个参数类似，迭代过程我们用 Stack 每次保存俩个需要对比的节点。

与递归过程的差异体现在 False 的处理，迭代过程中一旦遇到失败的情况，我们可以直接返回结果。

```python
class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        stack = [[root.left, root.right]]

        while len(stack) > 0:
            left, right = stack.pop()
            if not left and not right:
                continue
            if not left or not right:
                return False
            if left.val != right.val:
                return False
            stack.append([left.left, right.right])
            stack.append([left.right, right.left])

        return True
```

## 思路 3，BFS

不同的算法针对不同的数据存在不同的效率。如果两棵树的层级数不同，或者靠下层的数据出现差异时，使用 DFS 是高效的，因为每次我们会遍历一整条路径，一旦层级和叶子节点有差异，我们可以快速得到结果并结束程序。

另一方面，如果两棵树的结构没有差异，数据的差异可能出现在树的中段位置，那么相对来说 BFS 会更加高效。

从我提交的结果来看，目前这道题的测试数据是偏向于 BFS 的，Python3 实现的 BFS 平均在 24ms 左右，而 DFS 在 36ms 左右。

下面是 BFS 实现的思路，与之前相同，我们同时遍历两棵树，仅在遍历顺序上做出一点修改。

```python
class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        ltree, rtree = [root.left], [root.right]

        while ltree and rtree:
            if len(ltree) != len(rtree):
                return False
            for i in range(len(ltree)):
                left, right = ltree.pop(0), rtree.pop(0)
                if not left and not right:
                    continue
                if not left or not right:
                    return False
                if left.val != right.val:
                    return False
                ltree.append(left.left)
                ltree.append(left.right)
                rtree.append(right.right)
                rtree.append(right.left)

        return True
```
