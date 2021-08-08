---
date: '2021-04-10T15:36:05.464Z'
excerpt: ''
tags:
  - Backtracking
title: 77. Combinations (Medium)
categories:
  - leetcode
---

需要编辑的数组长度 `k` 是一个变量，看来这道题是一道典型的回溯算法题。

我们从 `1` 开始尝试往目标数组中放入包含 `1` 到包含 `n` 之间的值。

下一轮中我们尝试放入包含 `2` 到包含 `n` 之间的值。重复这个过程。

组合不在乎元素的排序，所以也许你会觉得算法会重复取值，这里的处理重点在于下一个值永远是大于上一个值的，所以我们没有必要考虑组合重复。

```python
class Solution:
    def combine(self, n: int, k: int) -> List[List[int]]:
        ans = []
        def search(pos, res):
            if len(res) == k:
                ans.append(res)
                return
            for i in range(pos, n + 1):
                search(i + 1, res + [i])
        search(1, [])
        return ans
```
