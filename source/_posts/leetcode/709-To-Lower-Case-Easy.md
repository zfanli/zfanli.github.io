---
date: '2021-06-15T15:36:05.543Z'
tags:
  - String
title: 709. To Lower Case (Easy)
---

字符串问题。将给定的字符串中的大写字母转换为小写字母并返回。

很简单的一道题目，考察点在于实现的思路。通过 ASCII 码可以简单的解决这道题。

<!-- more -->

## 思路

只要记得大写字母 `A-Z` 的 ASCII 码区间是 `65-90`，大写字母和小写字母的差值是 32，这道题就很好解决。

```python
class Solution:
    def toLowerCase(self, s: str) -> str:
        ans = ''
        for c in s:
            _c = ord(c)
            if _c >= 65 and _c <= 90:
                ans += chr(_c + 32)
            else:
                ans += c
        return ans
```

```java
class Solution {
    public String toLowerCase(String s) {
        char[] ans = s.toCharArray();
        for (int i = 0; i < ans.length; i++) {
            if (ans[i] >= 65 && ans[i] <= 90) {
                ans[i] += 32;
            }
        }
        return new String(ans);
    }
}
```
