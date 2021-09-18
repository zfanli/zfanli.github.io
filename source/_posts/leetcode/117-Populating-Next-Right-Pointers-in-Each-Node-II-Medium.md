---
title: 117. Populating Next Right Pointers in Each Node II (Medium)
tags:
  - Tree
  - Binary Tree
  - DFS
  - BFS
date: "2021-08-19T09:58:41.739Z"
---

在 `No.116` 中我们解决了在完全二叉树的情况下将每一层的节点向右关联的需求，这道题需要解决同样的需求，但是 `input` 不再确保是完全二叉树了。也就是说，当前节点可能不存在左节点、右节点或者左右节点都不存在，它的相邻节点也是一样，甚至所谓“相邻”其实也隔了好几个分支。

我们需要加入更多条件分歧来解决这道题。

<!-- more -->

## 思路 1，迭代 BFS

尝试空间复杂度 O(1) 的算法解决这道题。

首先这道题虽然和 `No.116` 需求一致，但是由于数据的变化，我们需要先抛开它的解题思路，换一个角度思考一下这个问题。

这里有一个思考陷阱：不要去找下一个存在的节点。

或许你会拓展 116 的思路，在知道当前存在的节点的情况下，尝试寻找它的 `next` 应该是谁。但是这中间存在太多条件，与其穷举这些条件，不如换个思路：去“找”上一个存在的节点。

- 实现一个 BFS 算法，我们按层序遍历，因为存在 `next` 属性绑定，省去 Stack 操作；
- 遍历这层每一个节点，如果其存在子节点；
  - 检查 `prev` 是否存在，如果存在则将当前子节点设置为它的 `next`；
  - 将当前子节点为 `prev`，最为后面节点的前置；
- 用一个变量保存每一层的第一个节点 `head`，如果这一层遍历结束，将 `head` 作为下一层迭代的开始。

```python
class Solution:
    def connect(self, root: 'Node') -> 'Node':
        head, prev, curr = None, None, root

        while curr:
            while curr:
                if curr.left:
                    if prev:
                        # connect currrent node with previous one
                        prev.next = curr.left
                    else:
                        # or set current one as the first one
                        head = curr.left
                    prev = curr.left

                if curr.right:
                    if prev:
                        # connect currrent node with previous one
                        prev.next = curr.right
                    else:
                        # or set current one as the first one
                        head = curr.right
                    prev = curr.right

                # iterate the next node
                curr = curr.next
            # setup the next level
            curr = head
            head = prev = None

        return root
```

## 思路 2，DFS

等等，题目提示递归是 OK 的， 对这道题我们可以不考虑调用栈的内存占用，“找下一个”的方法是可以实现的，何不试试这个方法？

对于每个跟节点我们需要处理：

- 如果左节点存在：
  - 如果右节点存在，连接它们；
  - 如果右节点不存在，连接左节点和下一个存在的节点；
- 接着接触如果右节点存在：
  - 将右节点和下一个存在的节点连接；
- 对右节点递归，顺序很重要：
  - 从上至下、从右往左遍历才能保证 `next` 被引用时指向正确的节点；
- 对左节点递归。

```python
class Solution:
    def connect(self, root: 'Node') -> 'Node':

        def find(node):
            if not node:
                return None
            if node.left:
                return node.left
            if node.right:
                return node.right
            return find(node.next)

        def dfs(node):
            if not node:
                return

            if node.left:
                if node.right:
                    node.left.next = node.right
                else:
                    node.left.next = find(node.next)

            if node.right:
                node.right.next = find(node.next)

            dfs(node.right)
            dfs(node.left)

        dfs(root)
        return root
```
