---
date: '2021-08-02T15:36:05.600Z'
excerpt: '???Medium??? Seriously?!'
tags:
  - Greedy
title: 1689. Partitioning Into Minimum Number Of Deci-Binary Numbers (Medium)
categories:
  - leetcode
---

???Medium??? Seriously?!

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
