---
date: "2021-07-11T15:36:05.569Z"
excerpt: ""
tags:
  - String
  - Stack
title: 1047. Remove All Adjacent Duplicates In String (Easy)
---

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
