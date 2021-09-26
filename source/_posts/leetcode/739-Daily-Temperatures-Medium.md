---
title: 739. Daily Temperatures (Medium)
tags:
  - Array
  - Stack
  - Monotonic Stack
date: '2021-09-26T07:10:12.381Z'
categories:
  - leetcode
---

你有一个数组 `temperatures` 表示每一天的气温，你需要返回一个相同长度的数组，每一个元素表示相同下标对应的日期之后需要多少天气温才会回暖，如果后续气温一直没有回暖则保持该位置的值为 `0`。

这道题用暴力法（每个元素往后搜索，时间复杂度 O(n^2)）会遇到超时报错，我们需要想办法优化时间复杂度。

<!-- more -->

## 思路：单调栈 Monotonic Stack

单调栈是普通的栈结构，但是里面的元素是单调递增或递减的。单调栈在数组的范围查询问题中可以有效优化时间复杂度，每个元素只会进入单调栈一次，时间复杂度为 O(n)。

在这道题中我们在遍历每日气温数组寻找气温回暖天数时维护一个递减的单调栈，在遍历气温的过程中检查当前气温的数值可以更新递减单调栈上多少个日期的答案。

```python
class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        ans, stack = [0] * len(temperatures), []

        for i in range(len(temperatures)):
            while stack and temperatures[stack[-1]] < temperatures[i]:
                prev = stack.pop()
                ans[prev] = i - prev
            stack.append(i)

        return ans
```

## 思路：从右往左，优化暴力法

另一个思路是从右向左来计算气温回暖天数。我们保持一个当前遇到的最大值 `right_max` 来判断是否存在未来回暖的日子，然后仅在存在这样的日期时才进行搜索，以避免无意义的计算。其次，由于我们按照从右向左的顺序计算，未来的日期以及计算完毕，所以我们可以参考这些计算结果来跳跃式的搜索最近的回暖日期，这一步可以进一步避免重复的计算。

从时间复杂度上来看这个思路的计算量相比有减少（重复计算部分），空间复杂度是 O(1)，相比上一个思路 O(n) 理论上应该表现更好，但是实际上在 LeetCode 的测试数据集上表现不如上个思路。

```python
class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        n, right_max = len(temperatures), temperatures[-1]
        ans = [0] * n

        for i in range(n - 1, -1, -1):
            # if the current value is equal to or greater than the max
            # it means no possible future day could get warmer
            if right_max <= temperatures[i]:
                right_max = temperatures[i]
            else:
                days = 1
                # keep searching the nearest bigger value
                while temperatures[i + days] <= temperatures[i]:
                    days += ans[i + days]
                ans[i] = days

        return ans
```
