---
date: '2021-05-20T15:36:05.511Z'
tags:
  - Array
  - Design
  - Binary Indexed Tree
  - Segment Tree
title: 307. Range Sum Query - Mutable (Medium)
categories:
  - leetcode
---

你有一个整数数组 `nums`，你需要实现一个程序处理下面两种类型的多次查询：

- 更新：更新数组中某个字段的值；
- 求和：通过下标 `left` 和 `right` 查询区间 [`left`, `right`] 的和，其中 `left <= right`。

看到求和或许你开始思考能否用前缀和解题，但是题目要求能对原数组进行更新，显然前缀和不是最好的方案。这题可以运用线段树解决。

<!-- more -->

## 思路

给定数组，可以更新元素，还要快速查询范围内的和、最大最小值，这是典型的 Segment Tree （线段树）的应用场景。

线段树可以用数组和 TreeNode 的结构表达。这里需要构建一个和线段树，方便起见用数组来表达线段树。

### Build Tree

线段树是一个二叉树结构，在给定数组上构建一个线段树，最终节点数约等于原数组长度的 2 倍，所以我们准备一个原数组长度 2 倍的数组，将原数组的元素放在从 `n` 开始的后半段。

前半段从 `n - 1` 开始遍历到 `0`，每个位置的值等于 `2 * i` + `2 * i + 1`，即其左右节点的和。树的构建就完成了。

### Update Values

更新线段树时，只需要更新从目标叶子节点开始到根节点的路径。

我们从叶子节点出发，用下标除以 2，更新每一个途径的节点，直到根节点，我们一共更新 log n 个元素。

### Range Sum Query

查询给定范围的和，分左右边界进行讨论：

左边界：

- 如果左边元素属于节点的 right child，这意味着它的父节点包含一个值在查询的范围之外，所以我们仅加上左边元素的值本身，然后将边界向右移动一位；
- 如果左边元素属于节点的 left child，我们查询它的父元素即可。

右边界：

- 相反，如果右边元素属于节点的 left child，我们仅加上元素本身的值，将边界向左移动一位；
- 如果右边元素属于节点的 right child，我们查询它的父元素。

我们更新左右边界，重复这个过程直到左右边界接错开（left > right），这时我们得到了答案。

### Solution

```python
class NumArray:

    def __init__(self, nums: List[int]):
        n = len(nums)
        tree = [0] * 2 * n
        for i in range(n):
            tree[i + n] = nums[i]
        for i in range(n - 1, -1, -1):
            tree[i] = tree[i * 2] + tree[i * 2 + 1]

        self.n = n
        self.tree = tree


    def update(self, index: int, val: int) -> None:
        n, tree = self.n, self.tree
        index += n
        tree[index] = val
        while index != 0:
            index //= 2
            tree[index] = tree[2 * index] + tree[2 * index + 1]


    def sumRange(self, left: int, right: int) -> int:
        n, tree = self.n, self.tree
        left += n
        right += n
        ans = 0
        while left <= right:
            if left % 2 == 1:
                ans += tree[left]
                left += 1
            if right % 2 == 0:
                ans += tree[right]
                right -= 1
            left //= 2
            right //= 2
        return ans
```
