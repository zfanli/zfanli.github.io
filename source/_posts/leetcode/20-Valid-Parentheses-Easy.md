---
title: 20. Valid Parentheses (Easy)
tags:
  - String
  - Stack
date: '2021-09-24T15:16:09.972Z'
categories:
  - leetcode
---

给你一个字符串仅由 `'('`、`')'`、`'{'`、`'}'`、`'['` 和 `']'` 组成。你需要判断这个字符串是否是有效的。

字符串如果满足下面两个条件则判断为有效的字符串。

- 所有开始的括号必须有相同类型的括号闭合；
- 所有开始的括号和闭合的括号需要按照正确的顺序排列。

有效的例子：

`"()"`, `"()[]{}"`, `"{[]}"`

无效的例子：

`"(]"`, `"([)]"`

<!-- more -->

## 思路：栈

这道题很适合使用栈来解决，我们遇到开始的括号直接放入栈中，遇到结束的括号时比对是否和栈顶的开始括号属于同一类型。如果不属于同一类型则匹配失败，直接放回否。所有字符遍历结束后判断栈是否清空，清空时表示所有括号都闭合了，否则就表示无效。

```python
B = {'(': ')', '[': ']', '{': '}'}

class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        for x in s:
            if x in B:
                stack.append(x)
            elif len(stack) == 0 or x != B[stack.pop()]:
                return False
        return len(stack) == 0
```
