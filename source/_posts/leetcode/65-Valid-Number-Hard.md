---
date: '2021-04-08T15:36:05.463Z'
tags:
  - Math
  - String
title: 65. Valid Number (Hard)
---

取巧使用正则，一行方案。

```python
class Solution:
    def isNumber(self, s: str) -> bool:
        ptn = r'^[+-]?(\d+\.|\d*\.\d+|\d+)([eE][+-]?\d+)?$'
        return re.match(ptn, s) is not None
```

使用数学归纳法的思路。先整理无效数字的模式。

- `+/-` 出现在数字之后
- `.` 重复或出现在 exp 之后
- `e/E` 重复或前面没数字

总结得知，我们需要对应是否为数字、小数、符号、指数设置 4 个 flag，然后依次迭代字符串的每一个字符，根据当前 flag 的值进行判断。

```js
/**
 * @param {string} s
 * @return {boolean}
 */
var isNumber = function (s) {
  let num, dec, sign, exp;
  for (let c of s.split("")) {
    // Check number.
    if (c >= "0" && c <= "9") num = true;
    // Check sign.
    else if (c === "+" || c === "-") {
      // If sign duplicated or appears after number or decimal.
      if (sign || num || dec) return false;
      sign = true;
    // Check decimal.
    } else if (c === ".") {
      // If duplicated or appears after exponent.
      if (dec || exp) return false;
      dec = true;
    // Check exponent.
    } else if (c === "e" || c === "E") {
      // If duplicated or no number before it.
      if (exp || !num)) return false;
      (exp = true), (num = false), (sign = false), (dec = false);
    // Failed.
    } else {
      return false;
    }
  }
  return !!num;
};
```
