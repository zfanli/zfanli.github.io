---
date: '2021-07-11T15:36:05.569Z'
tags:
  - String
  - Stack
title: 1047. Remove All Adjacent Duplicates In String (Easy)
categories:
  - leetcode
---

给定一个由英文小写字母组成的字符串 `s`，要求去重并返回结果。去重的条件是 2 个字符必须接邻且相等。

这道题的难点在于去重之后的字符串可能会产生新的重复。使用 Stack 可以方便的解决这道题。

<!-- more -->

## 思路

用 Stack 依次确认每一个字符。

```python
class Solution:
    def removeDuplicates(self, s: str) -> str:
        stack = []
        for c in s:
            if len(stack) != 0 and stack[-1] == c:
                stack.pop()
            else:
                stack.append(c)
        return "".join(stack)
```
