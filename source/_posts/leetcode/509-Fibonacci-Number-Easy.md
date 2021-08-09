---
date: '2021-05-30T15:36:05.523Z'
tags:
  - Math
  - DP
  - Recursion
  - Memoization
title: 509. Fibonacci Number (Easy)
categories:
  - leetcode
---

先读题。

> The Fibonacci numbers, commonly denoted `F(n)` form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is,
>
> - F(0) = 0, F(1) = 1
> - F(n) = F(n - 1) + F(n - 2), for n > 1.
> - Given n, calculate F(n).

斐波那契数列的问题，Hello World 级别的问题，难点是对时间和空间复杂度的控制。

> 官解也比较变态。

不多说，上正文。

### 思路 & Solutions

**方法一，递归（不推荐）**

实现一个 `F(n) = F(n - 1) + F(n - 2)`，缺点就是时间复杂度是 O(2^n)。

**方法二，递归+DP**

实现一个 `F(n) = F(n - 1) + F(n - 2)`，但是每次计算结果缓存起来，不再重复相同的计算。

跳过。

**方法三，Bottom-Up**

抛开递归，记录前一个值，按照斐波那契数列的规律计算到 n 为止。

```python
class Solution:
    def fib(self, n: int) -> int:
        if n < 2:
          return n
        else:
            pre = 0
            ans = 1
            for _ in range(2, n+1):
                ans, pre = ans + pre, ans
            return ans
```

> 官解给出了矩阵幂和黄金比例的方法，跳过...
