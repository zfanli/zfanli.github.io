---
date: '2021-04-16T15:36:05.471Z'
tags:
  - Tree
  - Stack
  - DFS
  - Binary Tree
title: 94. Binary Tree Inorder Traversal (Easy)
categories:
  - leetcode
---

遍历树的方法通常有三种，分别是前序遍历 pre-order traversal、中序遍历 in-order traversal 和后序遍历 post-order traversal。这道题是中序遍历。

难度上来说，前序最简单，中序和后序遍历会复杂一点。

思路 1，递归

```python
class Solution:
    def inorderTraversal(self, root: TreeNode) -> List[int]:
        ans = []

        def traverse(node):
            if node is None:
                return
            traverse(node.left)
            ans.append(node.val)
            traverse(node.right)

        traverse(root)
        return ans
```

思路 2，遍历

基于前序遍历的方案做的修改，可以解决问题，但是在空间复杂度上有优化余地，为了储存 stack 使用了额外的 2n 的空间。

```python
class Solution:
    def inorderTraversal(self, root: TreeNode) -> List[int]:
        ans, stack = [], [root]

        while len(stack) > 0:
            node = stack.pop()
            if node is None:
                continue
            if type(node) == int:
                ans.append(node)
            else:
                stack.append(node.right)
                stack.append(node.val)
                stack.append(node.left)

        return ans
```

思路 3，遍历，优化版本

中序遍历要先遍历左节点，所以先抵达最左路径的最后一个节点，从这个节点开始回溯，重复检查左节点，本体和右节点的顺序。

这其实是思路 1 递归的扁平化处理，使用 stack 来替代递归过程。时间复杂度和空间复杂度均为 O(n)。

```python
class Solution:
    def inorderTraversal(self, root: TreeNode) -> List[int]:
        ans, stack, curr = [], [], root

        while curr or len(stack) > 0:
            # find the leftmost node
            while curr:
                stack.append(curr)
                curr = curr.left
            curr = stack.pop()
            # record its value
            ans.append(curr.val)
            # start the next turn with its right node
            curr = curr.right

        return ans
```

思路 4，莫里斯遍历 Morris Traversal

也叫线索二叉树（Threaded Binary Tree），修改树的结构，让其“穿起来”成为一条线，整个遍历过程重复修改结构 -> 遍历数据的过程。

具体做法如下：

- 当前节点不存在左节点时
  - 记录当前节点值
  - 将右节点标记为当前节点
- 当前节点存在左节点时
  - 将当前节点挂在左节点的最后一个右节点上
  - 将左节点标记为当前节点
- 重复这个过程直到不存在当前节点

```python
class Solution:
    def inorderTraversal(self, root: TreeNode) -> List[int]:
        ans, curr = [], root

        while curr:
            if curr.left is None:
                ans.append(curr.val)
                curr = curr.right
            else:
                pre = curr.left
                while pre.right:
                    pre = pre.right
                pre.right = curr
                curr.left, curr = None, curr.left

        return ans
```

抄一个 Threaded Binary Tree 的解释方便理解。

> For example:
>
> ```
>          1
>        /   \
>       2     3
>      / \   /
>     4   5 6
> ```
>
> First, 1 is the root, so initialize 1 as current, 1 has left child which is 2, the current's left subtree is
>
> ```
>         2
>        / \
>       4   5
> ```
>
> So in this subtree, the rightmost node is 5, then make the current(1) as the right child of 5. Set current = cuurent.left (current = 2). The tree now looks like:
>
> ```
>         2
>        / \
>       4   5
>            \
>             1
>              \
>               3
>              /
>             6
> ```
>
> For current 2, which has left child 4, we can continue with thesame process as we did above
>
> ```
>        4
>         \
>          2
>           \
>            5
>             \
>              1
>               \
>                3
>               /
>              6
> ```
>
> then add 4 because it has no left child, then add 2, 5, 1, 3 one by one, for node 3 which has left child 6, do the same as above. Finally, the inorder traversal is [4,2,5,1,6,3].
