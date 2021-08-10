---
date: '2021-07-21T15:36:05.582Z'
tags:
  - Array
  - Heap (Priority Queue)
title: 1354. Construct Target Array With Multiple Sums (Hard)
---

构建目标数组问题。给你一个长度为 `n` 的目标数组 `target`，你需要从一个包含 `n` 个 `1` 的数组 `arr` 开始执行下面的过程：

- 设当前的 `arr` 数组的和为 `x`；
- 选择 `0` 到 `n` 之间的一个下标 `i`，让 `arr[i]` 等于 `x`；
- 重复这个过程。

判断最终能否构建出目标数组。

<!-- more -->

## Highlight:

- Backward from the max value
- Mod operation on max value with rest sum to get replacement value
- Push replacement value back to heap
- Repeat the procedure until the max value becomes to 1, which means succeed
- Or until the exception occurs and return `False`
  - when the rest sum is greater than the max value
  - when the rest sum less than 1

```python
class Solution:
    def isPossible(self, target: List[int]) -> bool:

        total = sum(target)
        # Transform min heap to max heap.
        heap = [-x for x in target]
        heapify(heap)

        # If the max value of heap is 1
        while -heap[0] != 1:
            # Get max value of current heap.
            num = -heap[0]
            # Get the rest sum except the max value.
            total += heappop(heap)
            # print(num, total, heap)
            if total >= num or total == 0:
                return False
            # Get last replacement value.
            # It's the point to reduce time complicity.
            # With using the mod operator, we avoid to iterate through every step.
            num %= total
            # Add up the replacement and add to heap.
            total += num
            heappush(heap, -num or -total)

        return True
```
