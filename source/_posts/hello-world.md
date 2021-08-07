---
title: Hello World
tags:
  - tag test
  - apple
  - orange
  - bear
  - peach
---

Welcome to [Hexo](https://hexo.io/)! This is your very first post. Check [documentation](https://hexo.io/docs/) for more info. If you get any problems when using Hexo, you can find the answer in [troubleshooting](https://hexo.io/docs/troubleshooting.html) or you can ask me on [GitHub](https://github.com/hexojs/hexo/issues).

## Quick Start

### Create a new post

```bash
$ hexo new "My New Post"
```

More info: [Writing](https://hexo.io/docs/writing.html)

### Run server

```bash
$ hexo server
```

More info: [Server](https://hexo.io/docs/server.html)

### Generate static files

```bash
$ hexo generate
```

More info: [Generating](https://hexo.io/docs/generating.html)

### Deploy to remote sites

```bash
$ hexo deploy
```

More info: [Deployment](https://hexo.io/docs/one-command-deployment.html)

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
