---
date: '2021-07-07T15:36:05.565Z'
excerpt: ''
tags:
  - Hash Table
  - Math
title: 970. Powerful Integers (Medium)
categories:
  - leetcode
---

## Before diving into the Solution

给定 3 个整数 `x`， `y`， `bound`，求所有小于等于 `bound` 的强整数（Powerful Integers）。

强整数（Powerful Integers）指一个数可以用 `x^i + y^j` 的形式表现，其中 `i` 和 `j` 均大于等于 0。

答案无所谓排序，但是不能有重复的值。需要用到一些数学方法来解决这道题。

<!-- more -->

## 思路

先找到指数的边界，然后枚举所有可能的结果。

使用一个 `set` 来进行去重。

```python
class Solution:
    def powerfulIntegers(self, x: int, y: int, bound: int) -> List[int]:
        a = 0 if x == 1 else int(log(bound, x))
        b = 0 if y == 1 else int(log(bound, y))

        ans = set()

        for i in range(a + 1):
            left = x ** i
            for j in range(b + 1):
                r = left + y ** j
                if r <= bound:
                    ans.add(r)

        return list(ans)
```
