---
date: "2021-03-23T15:36:05.448Z"
excerpt: ""
tags:
  - Hash Table
  - Backtracking
title: 37. Sudoku Solver (Hard)
---

数独问题，适合回溯算法。

```python
class Solution:
    def solveSudoku(self, board: List[List[str]]) -> None:
        """
        Do not return anything, modify board in-place instead.
        """

        # Save board for further use.
        self.board = board
        # print(self.solve())
        self.solve()

    def findEmptyCell(self):
        """
        Find the next place need to be filled.
        """
        for i in range(9):
            for j in range(9):
                if self.board[i][j] == ".":
                    return i, j
        return -1, -1

    def checkRow(self, row, num) -> bool:
        """
        Check if the target number is safe in row.
        """
        return num not in self.board[row]

    def checkCol(self, col, num) -> bool:
        """
        Check if the target number is safe in column.
        """
        for row in range(9):
            if self.board[row][col] == num:
                return False
        return True

    def checkSquare(self, row, col, num) -> bool:
        """
        Check if the target number is safe in the nearest square.
        We should find the first cell of the nearest square,
        just subtract the result of modulo 3 from col and row to get it.
        """
        sr, sc = row - row % 3, col - col % 3
        for i in range(sr, sr + 3):
            for j in range(sc, sc + 3):
                if self.board[i][j] == num:
                    return False
        return True

    def solve(self) -> bool:
        """
        The main body of our backtracking algorithm.
        """
        row, col = self.findEmptyCell()
        if row == -1 and col == -1:
            return True

        for num in [str(x) for x in range(1, 10)]:
            if (self.checkRow(row, num)
                and self.checkCol(col, num)
                and self.checkSquare(row, col, num)):
                self.board[row][col] = num
                if self.solve():
                    return True
                self.board[row][col] = "."
        return False
```
