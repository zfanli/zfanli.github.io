---
date: '2021-03-31T15:36:05.455Z'
tags:
  - Backtracking
title: 51. N-Queens (Hard)
---

> Tips
>
> Queen 可以在行、列、对角线和反对角线这四条线上随意行动，我们在放 Queen 时要保证这四个方向上没有 Queen 存在。

这是一个典型回溯法的应用场景，即我们需要尝试把 Queen 放在这一行的每个位置之后，才能知道所有可能的摆法。

比较容易忽视的点是，虽然我们可以轻松观察得知一行只有一个 Queen，所以行是不需要判断的，只需要判断列、对角线和反对角线上是否存在 Queen，但是这三条线是需要分开判断的。

我们需要准备 3 个 set 来保存已经使用过的列、对角线和反对角线。逻辑比较简单，我们通过代码和注释来理解。

```python
class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        # Prepare the answer list and an empty board in the required format.
        ans, board = [], [['.'] * n for _ in range(n)]

        def format(res):
            """Produce the output to meet to required format."""
            out = []
            for row in res:
                out.append(''.join(row))
            return out

        def solve(row, cols, diag, anti, res):
            """Solve recursively."""
            # The base case that we know we've got a right answer.
            if row == n:
                ans.append(format(res))

            # Try each position at this row.
            for q in range(n):
                # Calculate the top point of diagonal and anti-diagonal.
                d, a = q - row, q + row

                # Check if the current place can place a Queen.
                if q not in cols and d not in diag and a not in anti:
                    cols.add(q)
                    diag.add(d)
                    anti.add(a)
                    res[row][q] = 'Q'

                    solve(row + 1, cols, diag, anti, res)

                    # Backtracking.
                    cols.remove(q)
                    diag.remove(d)
                    anti.remove(a)
                    res[row][q] = '.'

        solve(0, set(), set(), set(), board)
        return ans
```
