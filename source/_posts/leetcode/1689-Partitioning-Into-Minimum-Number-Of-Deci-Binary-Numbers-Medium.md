---
date: '2021-08-02T15:36:05.600Z'
excerpt:
tags:
  - Greedy
  - String
title: 1689. Partitioning Into Minimum Number Of Deci-Binary Numbers (Medium)
---

## Before diving into the Solution

给定一个字符串格式的十进制整数 `n`，要求你分析最少需要多少个“二进制式十进制数”（Deci-Binary）求和可以得到这个给定的数 `n`。

“二进制式十进制数”的定义：一个十进制的整数，并且每一位数都只能是 `0` 或 `1`，不能有前置 `0`。比如 `101` 和 `1100` 符合要求，但是 `112` 和 `3001` 不符合要求。

> 这道题确定不是脑筋急转弯吗？！

<!-- more -->

???Medium??? Seriously?!

解释一句，仔细观察你会发现，由于二进制式十进制数每一位最大值是 `1`，想要从 `0` 开始用最少数量的二进制式十进制数来求和得到 `n`，你只需要知道 `n` 每一位数字的最大值即可，所以答案会在 `1-9` 之间。

```java
class Solution {
    public int minPartitions(String n) {
        int ans = 0;
        for (char c : n.toCharArray()) {
            if (c - '0' > ans) ans = c - '0';
            if (ans == 9) return ans;
        }
        return ans;
    }
}
```

```python
class Solution:
    def minPartitions(self, n: str) -> int:
        return max(int(x) for x in n)
```
