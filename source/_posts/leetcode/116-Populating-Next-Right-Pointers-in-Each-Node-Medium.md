---
title: 116. Populating Next Right Pointers in Each Node (Medium)
tags:
  - Tree
  - Binary Tree
  - DFS
  - BFS
date: '2021-08-19T08:43:50.536Z'
categories:
  - leetcode
---

你需要给一棵完全二叉树的每个一节点添加一个 `next` 指针，指向同一层的右边一个节点。

题目中完全二叉树的定义：所有叶子节点都在同一层，除了叶子节点外所有节点都拥有左右子节点，节点的数据结构如下：

```c++
struct Node {
  int val;
  Node *left;
  Node *right;
  Node *next;
}
```

目标是给所有节点的 `next` 赋值，如果不存在则为空，默认为空。

<!-- more -->

## 思路 1，BFS

我们需要知道每一层有多少节点才能完成这道题的目标，一个简单的宽度优先的层序遍历算法可以解决这道题。

具体可以参考 `No.102`，我们用一个 Stack 存每一层的节点，每一次迭代遍历完这一层的节点，同时放入下一层的节点。

这个简单的算法在时间复杂度上还有优化的空间，因为我们并未将完全二叉树这个特性纳入考虑的范围。

```python
class Solution:
    def connect(self, root: 'Node') -> 'Node':
        if not root:
            return

        stack = [root]
        while stack:
            for i in range(len(stack), 0, -1):
                node = stack.pop(0)
                if i != 1:
                    node.next = stack[0]
                if node.left:
                    stack.append(node.left)
                if node.right:
                    stack.append(node.right)

        return root
```

## 思路 2，DFS

DFS 的思路中，我们只要知道 2 个相邻的节点，就能对所有节点进行遍历。

比如我们知道当前节点 `curr` 和它的下一个节点 `next`，要保证当前的节点和其子节点相互连接：

- 需要将 `curr.next` 设置为 `next`；
- 需要将 `curr.left` 和 `curr.right` 作为参数继续递归；
- 需要将 `curr.right` 和 `next.left` 作为参数继续递归；
- 如果 `next` 不存在，需要将 `curr.right` 和 `None` 作为参数继续递归（因为需要递归子节点）。

```python
class Solution:
    def connect(self, root: 'Node') -> 'Node':

        def dfs(curr, nxt):
            if not curr:
                return
            curr.next = nxt
            dfs(curr.left, curr.right)
            dfs(curr.right, nxt.left if nxt else None)
            return curr

        return dfs(root, None)
```

## 思路 3，BFS 空间优化

思路 1 和思路 2 效率上相差无几，区别仅在于遍历的顺序。但是使用 Stack 的 BFS 和使用递归调用栈的 DFS 算法都使用了额外的 O(n) 的空间。

由于树的节点多了一个 `next` 属性，让我们能知道当前节点的层级中下一个节点是谁，相当于每一层的节点连城一个链表，这个数据结构让我们可以避免使用 Stack 也能完成层序遍历。

具体的思路就是，只要我们知道 2 个父节点，我们就可以知道这一层的所有节点。

- 从 `root` 的子节点开始迭代，我们先保留 `root.left` 的引用，这将作为下一层的开始位置；
- 根据完全二叉树的特性，我们判断当前节点和其左节点存在才进行遍历；
- 如果存在，现将当前节点的左右子节点关联，然后将右节点和当前节点的 `next.left` 关联；
- 将 `next` 设为当前节点继续遍历，直到不再存在 `next`；
- 这一层遍历节点，将最初保存的下一层开始位置设为当前节点继续迭代。

```python
class Solution:
    def connect(self, root: 'Node') -> 'Node':
        curr = root
        while curr:
            # start point of the next level
            nxt = curr.left
            # because its a perfect binary tree,
            # only connect its children if any of them exists
            while curr and curr.left:
                curr.left.next = curr.right
                curr.right.next = curr.next.left if curr.next else None
                curr = curr.next
            # set up the start point of the next level
            curr = nxt
        return root
```

## 总结

思路 1 和思路 2 在时间复杂度和空间复杂度上相似，LeetCode 的测试集的结果也不相上下。

思路 3 优化了空间复杂度，在同样测试集下平均结果要比前两者稍好，但是目测测试集的数据量不会很大，所以根据系统资源情况执行结果偶尔会有波动。
