---
date: '2021-05-16T15:36:05.507Z'
tags:
  - Array
  - Design
  - Prefix Sum
title: 303. Range Sum Query - Immutable (Easy)
---

你有一个整数数组 `nums`，你需要实现一个程序处理范围求和的查询

每次查询得到两个下标 `left` 和 `right` 作为参数，查询区间 [`left`, `right`] 的和，其中 `left <= right`。

前缀和的教学题，我们讨论前缀和如何解决这道题。

<!-- more -->

## 思路

前缀和，然后查询区间，最右减去最左，注意一个 index 的 offset。

查询 0 开始的范围，需要减去 -1 下标的和，这不合理，所以遇到 -1 可以选择重置为 0，但这不优雅。

通过向数组左端添加一个 0，可以避免处理 query 范围左端为 -1 的场景。

```python
class NumArray:

    def __init__(self, nums: List[int]):
        self.q = [0]
        for n in nums:
            self.q.append(self.q[-1] + n)


    def sumRange(self, left: int, right: int) -> int:
        return self.q[right + 1] - self.q[left]
```
