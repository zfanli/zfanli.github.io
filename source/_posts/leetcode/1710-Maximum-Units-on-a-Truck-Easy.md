---
date: '2021-08-08T15:36:05.609Z'
tags:
  - Greedy
  - Sort
title: 1710. Maximum Units on a Truck (Easy)
categories:
  - leetcode
---

## Before diving into the Solution

卡车装箱问题。你有一辆卡车，和一个货物清单（2D 数组），货物清单每个项目列出了这种货物的数量和每个货物所占的容量。需要求出给定尺寸的卡车最多能装下多少个货物。这道题运用贪心算法。

<!-- more -->

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
