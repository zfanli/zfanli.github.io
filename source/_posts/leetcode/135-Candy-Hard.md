---
date: "2021-05-04T15:36:05.490Z"

tags:
  - Array
  - Greedy
title: 135. Candy (Hard)
---

> 做完后才意识到是一道 hard 难度的题。

思路 1，~~野路子~~ 提取依赖。

最初的想法是根据左右位置的 `rating` 值决定当前位置的糖果数量，但是仅仅如此的话会由于无法预知后面的值是否被改变，从而造成漏算；要解决漏算，可以根据 `rating` 值计算出当前位置的糖果数量是否依赖左右的值，这样遍历一次列表之后我们就获得了所有位置的依赖。

接着我们准备一个递归函数来根据这些依赖，最终去计算糖果数量。

数据结构上，对于无依赖项，我们直接储存字面量（int），如果存在依赖则存入 list。

递归时，如果目标是字面量则直接返回，如果存在进一步的依赖则调用递归进一步计算。这样可以在 O(n) 时间内完成递归。

```python
class Solution:
    def candy(self, ratings: List[int]) -> int:
        n = len(ratings)
        c = [-1] * n
        for i in range(n):
            res = []
            if i > 0 and ratings[i - 1] < ratings[i]:
                res.append(i - 1)
            if i < n - 1 and ratings[i + 1] < ratings[i]:
                res.append(i + 1)
            c[i] = 1 if len(res) == 0 else res

        def cal(idx):
            if type(c[idx]) == int:
                return c[idx]
            res = []
            for x in c[idx]:
                res.append(cal(x) + 1)
            c[idx] = max(res)
            return c[idx]


        for i in range(n):
            cal(i)

        return sum(c)
```

思路 2，双列表。

换一个角度看下思路一，我们能发现从左到右遍历列表时，我们无法预知右边的值是否会变动，但是我们知道左边的值都是看过的，不会发生变动。于是，我们可以准备另一个列表从右到左的遍历一次列表，这样我们就获得了一个能确保右边值都考虑到了的数据。

要保证每个位置的糖果都符合题目要求，我们需要对两个列表相同位置的糖果取最大值，结果将是我们的答案。

```python
class Solution:
    def candy(self, ratings: List[int]) -> int:
        n = len(ratings)
        left, right = [1] * n, [1] * n

        for i in range(n):
            if i > 0 and ratings[i - 1] < ratings[i]:
                left[i] = left[i - 1] + 1

        for i in range(n - 1, -1, -1):
            if i < n - 1 and ratings[i + 1] < ratings[i]:
                right[i] = right[i + 1] + 1

        ans = 0
        for i in range(n):
            ans += max(left[i], right[i])

        return ans
```

思路 3，单列表。思路 2 的优化版本，使用双列表时，实际上我们没有同时使用到它们，所以优化的思路就是在第二次遍历时对列表进行更新，而不是重新准备一个列表。

这样完成第二次遍历之后，列表的和就是答案。

```python
class Solution:
    def candy(self, ratings: List[int]) -> int:
        n = len(ratings)
        c = [1] * n

        for i in range(n):
            if i > 0 and ratings[i - 1] < ratings[i]:
                c[i] = c[i - 1] + 1

        for i in range(n - 1, -1, -1):
            if i < n - 1 and ratings[i + 1] < ratings[i]:
                c[i] = max(c[i], c[i + 1] + 1)

        return sum(c)
```
