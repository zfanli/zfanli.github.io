---
date: '2021-07-29T15:36:05.595Z'
tags:
  - Array
  - Prefix Sum
title: 1480. Running Sum of 1d Array (Easy)
categories:
  - leetcode
---

求动态和，也就是前缀和。让你熟悉一下什么是前缀和。

给定一个数组，根据下标遍历，将每个位置 `n` 的值更新为原数组位置 `0` 到 `n` 的和。

连续几天 Hard 题目突然蹦出来一道 Easy 还有点不适应，提交之前都在想肯定没这么简单，有那里没考虑到，结果就 Accepted 了。

<!-- more -->

## 简直 leetcode pstd。

```python
class Solution:
    def runningSum(self, nums: List[int]) -> List[int]:
        for i in range(1, len(nums)):
            nums[i] += nums[i - 1]
        return nums
```
