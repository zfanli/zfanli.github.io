---
date: '2021-04-02T15:36:05.457Z'
tags:
  - Backtracking
title: 52. N-Queens II (Hard)
categories:
  - leetcode
---

国际象棋问题。求在 `n x n` 的棋盘上摆放 Queen 棋子并让其不能相互攻击的布局数量。

和 51 是孪生问题，不再赘述。

<!-- more -->

## 思路

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
