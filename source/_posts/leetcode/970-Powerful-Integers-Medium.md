---
date: "2021-07-07T15:36:05.565Z"
excerpt: ""
tags:
  - Hash Table
  - Math
title: 970. Powerful Integers (Medium)
---

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
