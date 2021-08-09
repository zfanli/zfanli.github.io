---
date: '2021-06-15T15:36:05.543Z'
tags:
  - String
title: 709. To Lower Case (Easy)
categories:
  - leetcode
---

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
