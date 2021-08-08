---
date: '2021-07-29T15:36:05.595Z'
excerpt: 连续几天 Hard 题目突然蹦出来一道 Easy 还有点不适应，提交之前都在想肯定没这么简单，有那里没考虑到，结果就 Accepted 了。
tags:
  - Array
title: 1480. Running Sum of 1d Array (Easy)
categories:
  - leetcode
---

Topics:

Array.

连续几天 Hard 题目突然蹦出来一道 Easy 还有点不适应，提交之前都在想肯定没这么简单，有那里没考虑到，结果就 Accepted 了。

简直 leetcode pstd。

```python
class Solution:
    def runningSum(self, nums: List[int]) -> List[int]:
        for i in range(1, len(nums)):
            nums[i] += nums[i - 1]
        return nums
```
