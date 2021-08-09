---
date: '2021-05-10T15:36:05.499Z'
excerpt: ''
tags:
  - Stack
title: 150. Evaluate Reverse Polish Notation (Medium)
categories:
  - leetcode
---

反向波兰表示法是一种使用 Stack 达到方便计算目的的一种数学方法。

使用递归或 Stack 都能简单的完成计算。使用 Stack 为例，算法过程如下：

- 遍历 tokens
  - 遇到数字则加到栈顶
  - 遇到操作符和取出栈顶的 2 个数字做运算，运算结果放回栈顶
- 最终栈中存在的元素就是答案

```python
class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        stack = []

        for t in tokens:
            if t not in {"+", "-", "*", "/"}:
                stack.append(int(t))
            else:
                right, left = stack.pop(), stack.pop()
                # print(left, t, right)
                if t == '+':
                    stack.append(left + right)
                elif t == '-':
                    stack.append(left - right)
                elif t == '*':
                    stack.append(left * right)
                else:
                    stack.append(trunc(left / right))

        return stack[0]
```
