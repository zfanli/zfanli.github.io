---
date: "2021-08-08T15:36:05.609Z"
excerpt: 将 `boxTypes` 按照 `units` 排序，从最大的 `units` 开始装入卡车，直到装满 `truckSize` 的数量。
tags:
  - Greedy
  - Sort
title: 1710. Maximum Units on a Truck (Easy)
---

将 `boxTypes` 按照 `units` 排序，从最大的 `units` 开始装入卡车，直到装满 `truckSize` 的数量。

```python
class Solution:
    def maximumUnits(self, boxTypes: List[List[int]], truckSize: int) -> int:
        boxTypes.sort(key=lambda x: x[1], reverse=True)
        ans = 0
        for nums, units in boxTypes:
            if truckSize <= nums:
                return ans + truckSize * units
            else:
                ans += nums * units
                truckSize -= nums
        return ans
```
