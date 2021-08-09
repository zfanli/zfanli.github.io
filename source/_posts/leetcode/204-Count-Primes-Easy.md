---
date: "2021-05-14T15:36:05.504Z"

tags:
  - Math
  - Hash Table
title: 204. Count Primes (Easy)
---

Topics:

Hash table, math.

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
