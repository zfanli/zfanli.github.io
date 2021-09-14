---
date: '2021-05-22T15:36:05.514Z'
tags:
  - Bit Manipulation
  - Array
  - String
title: 318. Maximum Product of Word Lengths (Medium)
---

字符串问题。给定一个字符串数组，求数组中字符串 A 和字符串 B 的长度的最大乘积，其中 A 和 B 中不能有任何相同的字母存在。

应用位掩码解决这个问题。

<!-- more -->

## 思路 1，暴力法

找到所有组合求最大值，用一个帮助函数 `pair` 来帮助我们判断是否需要进行相乘。

```python
class Solution:
    def maxProduct(self, words: List[str]) -> int:
        def pair(w1, w2):
            for w in w1:
                if w in w2:
                    return False
            return True

        ans, n = 0, len(words)
        for i in range(n):
            for j in range(i + 1, n):
                if pair(words[i], words[j]):
                    ans = max(ans, len(words[i]) * len(words[j]))
        return ans
```

## 思路 2，位掩码

英文小写字母只有 26 位，设想我们有一个长度为 26 的二进制数字，按照顺序将每一位映射成一个字母，0 表示有这个字母，1 则表示没有，这就是位掩码。判断相同字符串经常用到位掩码操作，在计算机中位操作往往有更好的效率。要判断两个字符串是否有共同的字母，只需要将他们的位掩码进行 `&` 操作，这样相同位存在 1 的情况就会让结果大于 0，相反如果没有任何一位存在两边都为 1 的情况，则结果一定是 0。所以我们仅在结果为 0 的时候去计算长度相乘。

```python
class Solution:
    def maxProduct(self, words: List[str]) -> int:
        bitmasks, ans = {}, 0
        for w in words:
            bitmask = 0
            for c in w:
                bitmask |= 1 << (ord(c) - ord('a'))
            for k, v in bitmasks.items():
                if not bitmask & k:
                    ans = max(ans, len(w) * v)
            bitmasks[bitmask] = max(len(w), bitmasks.get(bitmask, 0))
            # print(bitmask, ans)
        return ans
```

另一种位掩码的实现，按照下标映射位掩码，省去了 HashMap。

```java
class Solution {
    public int maxProduct(String[] words) {
        int[] bitmasks = new int[words.length];
        for (int i = 0; i < words.length; i++) {
            for (char c : words[i].toCharArray()) {
                bitmasks[i] |= 1 << (c - 'a');
            }
        }
        int ans = 0;
        for (int i = 0; i < words.length; i++) {
            for (int j = i + 1; j < words.length; j++) {
                if ((bitmasks[i] & bitmasks[j]) == 0) {
                    ans = Math.max(ans, words[i].length() * words[j].length());
                }
            }
        }
        return ans;
    }
}
```
