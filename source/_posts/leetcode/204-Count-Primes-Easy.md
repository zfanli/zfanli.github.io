---
date: '2021-05-14T15:36:05.504Z'
tags:
  - Array
  - Math
  - Enumeration
  - Number Theory
title: 204. Count Primes (Easy)
categories:
  - leetcode
---

计算所有小于非负整数 `n` 的质数的数量。

> 质数（Prime）： 只能被 1 和其本身整除的数。

可以暴力、枚举解题，也可以找到一定规律优化一下暴力算法。

<!-- more -->

## 思路 Sieve of Eratosthenes

埃拉托色尼筛法。

准备一个长度为 `n` 的数组并且用 1 填充。

思路在于从 2 开始到 `n` 的平方根为止，将每个值到 `n` 为止的倍数作为下标，将数组中的值标记为 0，即非质数。

最终将数组求和，剩下的 1 都是质数。注意 0 和 1 不是质数，需要将其从结果中排除。

```python
class Solution:
    def countPrimes(self, n: int) -> int:

        isprime = [1] * n

        for i in range(2, int(math.sqrt(n)) + 1):
            if isprime[i] != 0:
                for j in range(i ** 2, n, i):
                    isprime[j] = 0

        # 0 and 1 are not prime.
        ans = sum(isprime) - 2
        return ans if ans > 0 else 0
```
