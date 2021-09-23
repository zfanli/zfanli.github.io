---
date: '2021-08-06T15:36:05.607Z'
tags:
  - Array
  - DP
  - Queue
  - Sliding Window
  - Heap (Priority Queue)
  - Monotonic Queue
title: 1696. Jump Game VI (Medium)
categories:
  - leetcode
---

跳跃游戏问题。你有一个数组 `nums` 和一个步数 `k`，最初你站在 0 的位置。游戏每一回合你可以向前跳最多 `k` 步，你的得分就是向前跳的步数对于 `nums` 中的值。求你可以获得的最大得分。

<!-- more -->

## 思路 1，DP + Heap

这道题很容易想到用 DP 来解决，我们记录 k 步以内的值，每一次用最大值来计算下一个值，可以用 O(n\*k) 的复杂度完成计算，但是可惜 k 的最大值能到 10^5，O(n\*k) 无法通过测试 case。

我们需要减少计算最大值的次数，可以考虑用大根堆数据结构来处理最大值的计算，但是这道题的复杂度在于我我们需要根据下标来判断这个值能不能选用，毕竟如果下标不在跳跃的范围内，这个最大值对我们来说就失效了。

为了处理这个问题，我们在创建大根堆的时候以 `(value, index)` 形式将值和下标建立联系。在每次迭代过程中，我们将失效的最大值从堆中移出掉，再去计算当前应该放入堆中的值。

使用 Python 时需要注意 heapq 没有原生提供大根堆的支持，我们可以在存值的使用使用负号颠倒一下值的大小，达到大根堆的效果。

```python
class Solution:
    def maxResult(self, nums: List[int], k: int) -> int:
        ans, q = nums[0], [(-nums[0], 0)]
        for i in range(1, len(nums)):
            while i - q[0][1] > k:
                heappop(q)
            ans = nums[i] - q[0][0]
            heappush(q, (-ans, i))
        return ans
```
