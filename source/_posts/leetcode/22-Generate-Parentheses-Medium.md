---
date: "2021-03-21T15:36:05.446Z"

tags:
  - String
  - Backtracking
title: 22. Generate Parentheses (Medium)
---

把括号转换成数字，我们可以观察到其中的规律。转数字的方法在于对括号嵌套的层级进行计数，比如 `((()))` 一共嵌套了 3 层，所以转化为数字为 `123`，而 `()(())` 可以转化为 `112`。

> Input: n = 3
>
> Output: ["((()))","(()())","(())()","()(())","()()()"]

> Layout: [123, 122, 121, 112, 111]

规律在答案中的所有组合都属于 `1..n` 到 `1..1` 的枚举。比如 `123, 122, 121` 的过程中最高位 3 被枚举到 1，而下一个数第二位 2 降为 1，第三位从第二位原本的值开始继续枚举到 1。

我们可以将其转化为算法，计算出所有可能的嵌套布局，然后用一个 `draw` 方法来将布局转化为实际的括号字符串。转化过程有三种模式：

- 对排列的最后一个元素的处理：插入一对括号，然后关闭其他所有括号；
- 对当前元素 >= 下一个元素的处理：插入一对括号，关闭到下一个元素为止层级的括号；
- 对当前元素 < 下一个元素对处理：插入左半边括号。

```python
class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        ans = []
        def generate(layout:[int] = [1]):
            if len(layout) == n:
                ans.append(draw(layout))
                return
            for i in range(int(layout[-1]) + 1, 0, -1):
                generate(layout + [i])

        def draw(layout:[int]):
            res = ""
            for i in range(n):
                if i == n - 1:
                    # Add a left parentheses and close all others.
                    res += "("  + ")" * layout[i]
                elif layout[i] >= layout[i + 1]:
                    # Add a left parentheses and close all others.
                    res += "("  + ")" * (layout[i] - layout[i + 1] + 1)
                else:
                    # Add a left parentheses only.
                    res += "("
            return res

        generate()
        return ans
```

上面的思路只是找到了题目的答案，但是算不上优雅。对字符串的编辑可以在计算布局的适合完成，或者说，一旦我们知道了布局的规律，我们就可以完全没有额外操作的找到所有组合。

但是在编辑字符串的适合很容易陷入到对多种情况的考虑，但是只要换一个角度想想问题就可以解决：括号会出现在哪里？

实际上合理的括号只会出现在两个位置：当前括号的里面（嵌套变深），当前括号的右边（非嵌套）。

下一个问题是，哪些括号放在里面，哪些放在右边呢？答案是，从 `n` 到 `1` 遍历，当前的 `index` 在括号里面，`n - index` 在括号的右边，当然反之亦然，影响的只是答案中每个元素出现的顺序而已。

```python
class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        if n == 0:
            return ['']
        ans = []
        for i in range(n):
            for left in self.generateParenthesis(i):
                for right in self.generateParenthesis(n - 1 - i):
                    ans.append(f"({left}){right}")
        return ans
```
