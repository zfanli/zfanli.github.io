---
date: '2021-05-02T15:36:05.487Z'
tags:
  - Array
  - Hash Table
  - Union Find
title: 128. Longest Consecutive Sequence (Medium)
---

你有一个未排序的整数数组 `nums`，你要在 O(n) 时间复杂度内找到最长的连续子序列，返回其长度

`nums` 数组的元素可以构成诺干个连续的子数组，我们需要找到最大的子数组，返回其长度。

## 思路

要找到最大的子数组，首先我们要找到子数组的第一个元素，可以将 `nums` 转成一个 HashSet，然后遍历它：

- 查询每个元素的前一个值（`n - 1`）是否存在；
  - 存在则表示这个元素不是子数组的最小值，直接跳过；
  - 不存在时，循环查询这个值的下一个值是否存在（`n + 1`），直到下一个值不存在为止；
  - 在查询下一个值的过程中保持一个计数器，一直计数到不存在下一个值；
  - 将其和全局变量取一个最大值；
- 返回全局最大值。

因为我们只在子数组的最小值开始遍历，所以能避免不需要的运算，让时间复杂度在 O(n)。

```python
class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        ans, nums = 0, set(nums)
        for n in nums:
            if n - 1 not in nums:
                count = 1
                while n + 1 in nums:
                    n, count = n + 1, count + 1
                ans = max(ans, count)
        return ans
```
