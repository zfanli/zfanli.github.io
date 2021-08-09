---
date: "2021-07-13T15:36:05.571Z"

tags:
  - Array
  - Hash Table
  - Two Pointers
  - String
  - DP
title: 1048. Longest String Chain (Medium)
---

## Before diving into the Solution

给定一个由英文小写字母组成的字符串数组 `words`，你需要从中挑选单词构成满足下面定义的词汇链（word chain），找到能构成的最长词汇链，返回其长度。

- 词汇链（word chain）指一个字符串数组中，每个字符串都是后一个字符串的前置（predecessor），如果数组只有一个字符串，这个词汇链长度为 `1`；
- 前置（predecessor）指一个字符串 A 满足仅向其中添加一个字符可以构成字符串 B 的条件，此时字符串 A 称之为字符串 B 的前置。
  - 比如 `"abc"` 是 `"abac"` 的前置, 而 `"cba"` 不是 `"bcad"` 的前置。

我们用 DFS 和 DP 两个思路解决这个问题。

<!-- more -->

## 思路 1，hash table + memoization

明确一下要找出最长的链，我们需要完成下面的步骤才能最终确认：

- 遍历所有 word，找到所有可能的 predecessor
- 遍历所有的 predecessor，找到它的所有可能的 predecessor；如此反复

我们可以观察到如果有两个词找到同一个词能作为它的 predecessor，这个被找到的对象就发生了重复计算。我们可以用 memoization 解决这个问题。

此外，寻找 predecessor 的过程也可以用 Hash Table 来进行加速。具体的做法是，我们使用一个 Map 来做 memoization，用 word 作为 key，value 储存它的 predecessor 的数量。

针对每一个词，我们枚举出它的所有可能的 predecessor，到 Hash 表中进行匹配，如果值在表中存在则用这个词继续进行枚举过程。

```python
class Solution:
    def longestStrChain(self, words: List[str]) -> int:
        memo = {}
        for w in words:
            memo[w] = -1

        def dfs(w):
            if memo[w] != -1:
                return memo[w]
            c = 0
            for i in range(len(w)):
                _w = w[:i] + w[i+1:]
                if _w in memo:
                    c = max(c, dfs(_w))
            memo[w] = c + 1
            return memo[w]

        for w in words:
            dfs(w)

        # print(memo)
        return max(memo.values())
```

## 思路 2，DP

思路 1 的非递归版本。

```python
class Solution:
    def longestStrChain(self, words: List[str]) -> int:
        words.sort(key=lambda x: len(x))
        dp = {}
        for w in words:
            c = 1
            for i in range(len(w)):
                _w = w[:i] + w[i+1:]
                if _w in dp:
                    c = max(c, 1 + dp[_w])
            dp[w] = c
        return max(dp.values())
```

此外还有按长度分组 Hash 等方法，但性能上比上面两个思路没有优势，逻辑还更加复杂了，就不讨论了。
