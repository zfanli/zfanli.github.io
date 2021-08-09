---
date: '2021-06-29T15:36:05.558Z'
excerpt: ''
tags:
  - String
  - Array
  - Hash Table
title: 890. Find and Replace Pattern (Medium)
categories:
  - leetcode
---

## Before diving into the Solution

给定一组字符串和一个模式（pattern），返回字符串中所有匹配这个模式的对象。

这里的模式（pattern）描述字母如何重复，即如果模式匹配，那么将模式中的字母替换成映射的字母，就可以还原成目标字符串。

使用字符串映射，或者码表来解决这道题。

<!-- more -->

## 思路 1，先计算 `pattern` 的排列码表

使用这个码表来过滤输入数据。简单来说，我们这样做。

- 计算 `pattern` 的排列码表
  - 用一个计数器将 `pattern` 中的字符按出现顺序编码；
  - 相同字符的编码保持不变，比如 `abba` 转化为排列码表为 `[0, 1, 1, 0]`。
- 对输入数据中每一个字符串进行检查
  - 用一个计数器将目标中的字符按出现顺序编码；
  - 相同字符的编码保持不变；
  - 计算完每一个字符的编码后，与排列码表相同下标的元素进行比对，结果不一致时直接返回 `false`；
  - 顺利匹配完成时，返回 `true`。

```python
class Solution:
    def findAndReplacePattern(self, words: List[str], pattern: str) -> List[str]:
        ptn, tbl, c = [], {}, 0

        for i in pattern:
            if i not in tbl:
                tbl[i] = c
                c += 1
            ptn.append(tbl[i])

        def match(w):
            tbl.clear()
            c = 0
            for i in range(len(w)):
                if w[i] not in tbl:
                    tbl[w[i]] = c
                    c += 1
                if tbl[w[i]] != ptn[i]:
                    return False
            return True

        # print(ptn)
        return filter(match, words)
```

## 思路 2，双射（bijection）

用两个哈希表分别映射 `pattern` 字符和目标字符，检查映射结果是否一致。

- 用 `m1` 储存目标字符到 `pattern` 字符的映射，比如字符 `x` -> `a`;
- 用 `m2` 储存 `pattern` 字符到目标字符的映射，比如字符 `a` -> `x`；
- 作为判断条件，当下面条件任意一个满足，则表示目标字符与 `pattern` 不匹配：
  - `m1` 中字符 `x` 对应的字符与当前 `pattern` 相对下标的字符不匹配；或，
  - `m2` 中字符 `a` 对应的字符与当前目标字符串相对下标的字符不匹配。
- 如果到最后一个字符依然匹配，则目标字符匹配 `pattern`。

```java
class Solution {
    private Map<Character, Character> m1 = new HashMap<>();
    private Map<Character, Character> m2 = new HashMap<>();
    public List<String> findAndReplacePattern(String[] words, String pattern) {
        List<String> ans = new ArrayList<>();
        for (String w : words) {
            if (match(w, pattern)) ans.add(w);
        }
        return ans;
    }
    private boolean match(String w, String ptn) {
        m1.clear(); m2.clear();
        for (int i = 0; i < w.length(); i++) {
            char c = w.charAt(i);
            char p = ptn.charAt(i);
            if (!m1.containsKey(c)) m1.put(c, p);
            if (!m2.containsKey(p)) m2.put(p, c);
            if (m1.get(c) != p || m2.get(p) != c) return false;
        }
        return true;
    }
}
```

## 思路 3，单哈希表

在双射的思路里我们用到了 2 个哈希表，这里还有优化的空间，我们考虑一下只使用一个哈希表时需要处理的问题。

- 首先按照思路 2 准备好哈希表，这次我们仅作目标字符到 `pattern` 字符的映射；
- 第一个错误条件是目标字符在哈希表中对应的 `pattern` 字符和当前不匹配：
  - 如果目标字符重复之前出现过的字符，而 `pattern` 字符是未出现过的，则哈希表中对应字符和当前 `pattern` 字符必定不匹配。
- 第二个错误条件是目标字符都不重复时，会将多个不同字符映射到 `pattern` 的同一个字符：
  - 这时哈希表会顺利完成，我们需要对哈希表的值集合进行进一步的检查，如果出现重复字符则返回 `false`。
- 最终顺利完成检查的返回 `true`。

```java
class Solution {
    private Map<Character, Character> m1 = new HashMap<>();
    public List<String> findAndReplacePattern(String[] words, String pattern) {
        List<String> ans = new ArrayList<>();
        for (String w : words) {
            if (match(w, pattern)) ans.add(w);
        }
        return ans;
    }
    private boolean match(String w, String ptn) {
        m1.clear();
        for (int i = 0; i < w.length(); i++) {
            char c = w.charAt(i);
            char p = ptn.charAt(i);
            if (!m1.containsKey(c)) m1.put(c, p);
            if (m1.get(c) != p) return false;
        }

        boolean[] test = new boolean[26];
        for (char v : m1.values()) {
            if (test[v - 'a']) {
                return false;
            } else {
                test[v - 'a'] = true;
            }
        }
        return true;
    }
}
```

```js
/**
 * @param {string[]} words
 * @param {string} pattern
 * @return {string[]}
 */
var findAndReplacePattern = function (words, pattern) {
  return words.filter((w) => {
    const map = {};
    for (let i = 0; i < w.length; i++) {
      const c = w.charAt(i),
        p = pattern.charAt(i);
      if (!map[c]) map[c] = p;
      if (p !== map[c]) return false;
    }
    const test = [];
    for (let v of Object.values(map)) {
      if (test.indexOf(v) > -1) {
        return false;
      } else {
        test.push(v);
      }
    }
    return true;
  });
};
```
