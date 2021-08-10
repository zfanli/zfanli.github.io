---
date: '2021-07-25T15:36:05.589Z'
tags:
  - Array
  - Sliding Window
  - Prefix Sum
title: 1423. Maximum Points You Can Obtain from Cards (Medium)
---

抽卡求最大得分问题。有一堆卡排成一行，每张卡的卡面有其对应的分值，你有 `k` 次机会抽取卡片，每次机会中你可以选择抽取最左边的一张卡，或者抽取最右边的一张卡。你所抽取的所有卡片的分值之和是你的得分。求你能获得的最大分数。

<!-- more -->

## 思路 1，滑动窗口

用滑动窗口检查 k 以外的连续元素的最小值，然后用数组和减去这个最小值。计算过程用 DP 简化，仅需计算数组前缀和。优势是思路简单，前缀和使用 in-place 不会占用额外空间。虽然思路简单，但是代码不算简洁。

```python
class Solution:
    def maxScore(self, cp: List[int], k: int) -> int:
        n = len(cp)

        # Calculate prefix sum.
        for i in range(1, n):
            cp[i] += cp[i - 1]

        if n == k:
            return cp[-1]

        sz = n - k
        m = cp[sz - 1]

        for i in range(sz, n):
            m = min(m, cp[i] - cp[i - sz])

        return cp[-1] - m
```

## 思路 2，滑动窗口 V2

就是直接按照提问的思路，计算所有组合并且求最大值，逻辑捋清楚之后也比较简单，这里只需要滑动窗口，每次减去离开窗口的值、加上进入窗口的值，然后取最大值。思路捋清楚后代码比较简洁.

```python
class Solution:
    def maxScore(self, cp: List[int], k: int) -> int:
        ans = curr = sum(cp[:k])
        # From k - 1 to 0
        for i in range(k - 1, -1, -1):
            curr += cp[i - k] - cp[i]
            ans = max(ans, curr)
        return ans
```
