---
date: "2021-05-26T15:36:05.518Z"

tags:
  - Math
title: 453. Minimum Moves to Equal Array Elements (Easy)
---

题目要求每次给 `n - 1` 个元素加 1，重复这个步骤直到数组所有元素相等。我们不应该给 `max` 加 1，所以这一步实际上是给最大值以外的所有元素加 1，其等价于最大值减去 1。

一旦在脑子中把这个思路捋顺了，方案就简单了。实际上我们要找到的是每一个元素减到最小值需要减去的次数。

算法已经浮出水面，我们先找到最小值，然后计算每个元素和最小值的差的和，这个和就是答案。

> 这是数学法，也称“感觉智商丢掉”法。

```python
class Solution:
    def minMoves(self, nums: List[int]) -> int:
        m, ans = min(nums), 0
        for n in nums:
            ans += n - m
        return ans
```

基于这个思路，实际上我们把最小值减去了 `n` 次，那么找到最小值之后，我们对数组求和之后再减去数组长度乘以最小值，得到的结果就是答案。

```python
class Solution:
    def minMoves(self, nums: List[int]) -> int:
        return sum(nums) - min(nums) * len(nums)
```
