---
date: '2021-07-09T15:36:05.567Z'
excerpt: ''
tags:
  - Array
  - Binary Search
  - Sliding Window
  - Prefix Sum
title: 1004. Max Consecutive Ones III (Medium)
categories:
  - leetcode
---

思路 1，滑动窗口。

提示说的很清楚，题目要求找出最长的连续出现的 `1`，那么用 2 个指针实现一个滑动窗口是一个合适的选择。

用一个数组储存所有遇到 `0` 的位置，当数组长度超过 `k`，将左边指针设为第一个 `0` 位置的下一位，并将第一个 `0` 从数组删除。

每一步都保存一下当前连续的最大值。

```python
class Solution:
    def longestOnes(self, nums: List[int], k: int) -> int:
        ans, i, zeros = 0, 0, []
        for j in range(len(nums)):
            if nums[j] == 0:
                zeros.append(j)
                if len(zeros) > k:
                    i = zeros.pop(0) + 1
            ans = max(ans, j - i + 1)
        return ans
```

思路 2，滑动窗口+内存优化。

我们可以优化思路 1 的数组方法，仅使用一个计数器来提醒我们是否需要将左边的指针移动到下一个位置。

```python
class Solution:
    def longestOnes(self, nums: List[int], k: int) -> int:
        ans, i = 0, 0
        for j in range(len(nums)):
            if nums[j] == 0:
                if k == 0:
                    while nums[i] != 0:
                        i += 1
                    i += 1
                else:
                    k -= 1
            ans = max(ans, j - i + 1)
        return ans
```
