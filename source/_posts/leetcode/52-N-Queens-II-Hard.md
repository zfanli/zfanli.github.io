---
date: '2021-04-02T15:36:05.457Z'
excerpt: ''
tags:
  - Backtracking
title: 52. N-Queens II (Hard)
categories:
  - leetcode
---

感觉在刷分 hhh。和 51 完全一样，不同之处在于这题只要计数。

```python
class Solution:
    def totalNQueens(self, n: int) -> int:
        self.ans = 0
        def place(pos, cols, diag, anti):
            if pos == n:
                self.ans += 1
            for i in range(n):
                d, a = i - pos, i + pos
                if i not in cols and d not in diag and a not in anti:
                    cols.add(i)
                    diag.add(d)
                    anti.add(a)
                    place(pos + 1, cols, diag, anti)
                    cols.remove(i)
                    diag.remove(d)
                    anti.remove(a)

        place(0, set(), set(), set())
        return self.ans
```
