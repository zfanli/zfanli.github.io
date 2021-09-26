---
date: '2021-05-10T15:36:05.499Z'
tags:
  - Array
  - Math
  - Stack
title: 150. Evaluate Reverse Polish Notation (Medium)
categories:
  - leetcode
---

演算反向波兰表示法。反向波兰表示法是一种为减少内存访问的使用 Stack 的演算表达法，这种方法按照先操作对象后操作符的方式表达算术运算。

所以我们讨论如何使用 Stack 解决这道题。

<!-- more -->

## 思路

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

用 Java 实现相同的算法。

```java
class Solution {
    public int evalRPN(String[] tokens) {
        Deque<Integer> stack = new LinkedList<>();
        for (String t : tokens) {
            if ("+".equals(t)) {
                stack.offerLast(stack.pollLast() + stack.pollLast());
            } else if ("-".equals(t)) {
                stack.offerLast(-stack.pollLast() + stack.pollLast());
            } else if ("*".equals(t)) {
                stack.offerLast(stack.pollLast() * stack.pollLast());
            } else if ("/".equals(t)) {
                Integer right = stack.pollLast(), left = stack.pollLast();
                stack.offerLast(left / right);
            } else {
                stack.offerLast(Integer.valueOf(t));
            }
        }
        return stack.peek();
    }
}
```
