---
date: '2021-06-27T15:36:05.556Z'
tags:
  - String
  - Backtracking
title: 816. Ambiguous Coordinates (Medium)
---

模棱两可的平面坐标。你需要从一个删除了逗号、空格和小数点的平面坐标中还原它的所有可能的坐标值。

> For example, "(1, 3)" becomes s = "(13)" and "(2, 0.5)" becomes s = "(205)".

结果坐标值不会有多余的前置 0，并且小数点后的数字不会以 0 结尾。还原后的坐标的两个值应该用逗号和一个空格隔开。

我们讨论用正则和回溯算法来解决这道题。

<!-- more -->

## 思路 1，正则

偷懒用正则检查字符串。

```python
class Solution:
    def ambiguousCoordinates(self, s: str) -> List[str]:

        def isvalid(s):
            ptn = r"^(([1-9]+\d*|0)\.\d*[1-9]|([1-9]+\d*|0))$"
            return re.match(ptn, s) is not None

        def makenumberstr(s):
            ret = []
            for i in range(len(s)):
                _s = s
                if i + 1 < len(s):
                    _s = s[:i + 1] + '.' + s[i + 1:]
                if isvalid(_s):
                    ret.append(_s)
            return ret

        s = s[1:-1]

        ans = []

        for i in range(1, len(s)):

            n = makenumberstr(s[:i])
            m = makenumberstr(s[i:])

            for _n in n:
                for _m in m:
                    ans.append(f"({_n}, {_m})")

        return ans
```

## 思路 2，回溯算法

老老实实拼正确的字符串，跳过检查。其实正确字符串规则只有 2 个，无论对整数还是浮点数来说，整数部分只能是 0 或 0 以上，所以判断这部分只要判断是否有前缀 0，以及是否为 0。

- 浮点数：
  - 左边只能是 0 或大于 0 的数；
  - 右边末位不能是 0。
- 整数：
  - 只能是 0 或大于 0 的数。

```python
class Solution:
    def ambiguousCoordinates(self, s: str) -> List[str]:

        def makenumberstr(s):
            ret = []
            for i in range(1, len(s) + 1):
                left, right = s[:i], s[i:]
                if (not left.startswith('0') or left == '0') and not right.endswith('0'):
                    ret.append(left + ('.' if right != '' else '') + right)
            return ret

        s, ans = s[1:-1], []

        for i in range(1, len(s)):

            n = makenumberstr(s[:i])
            m = makenumberstr(s[i:])

            for _n in n:
                for _m in m:
                    ans.append(f"({_n}, {_m})")

        return ans
```
