---
date: '2021-06-17T15:36:05.546Z'
tags:
  - Trie
title: 745. Prefix and Suffix Search (Hard)
---

字典树题目。实现一个字典根据指定的前缀和后缀来定位单词，如果存在多个单词则返回最大的下标位置，如果不存在单词则返回 -1。

测试 case 中单词最大数量为 15000，查询次数最大为 15000，查询性能不够的话会遇到超时问题。

字符串索引问题是字典树（Trie）的应用场景，我们用字典树来解决这道题。

<!-- more -->

## 思路，然而并没有用 Trie

用 Hash Table + Memoization 方法。

根据后缀长度，将每个单词截取后缀长度的 substring，加上 `#` 拼上原字符作为一个索引列表。

比如后缀长度为 3 时，将 `abcdefg` 处理为 `efg#abcdefg` 储存到长度为 3 的索引。

这样我们可以将给定的后缀拼上 `#` 再拼上前缀，使用字符串的 `startsWith` 方法进行匹配。

出于效率考虑我们将每次计算的结果储存到 `memo` 中，方便遇到相同的查询直接返回结果。

> 这一步是避免算法超时的关键，实际上换一个不存在重复数据的测试集就会超时。
>
> 这道题考察的是 Trie 的应用。应用字典树的情况下测试集不会对结果有太大影响。
>
> 字典树构建流程并不复杂，但是细节处理需要小心注意，TODO

```java
class WordFilter {

    private Map<Integer, String[]> index = new HashMap<>();
    private int len;
    private String[] reversed;
    private Map<String, Integer> memo = new HashMap<>();

    public WordFilter(String[] words) {
        this.len = words.length;
        Collections.reverse(Arrays.asList(words));
        this.reversed = words;
    }

    public int f(String prefix, String suffix) {
        String query = suffix + "#" + prefix;
        Integer ans = memo.get(query);
        if (ans != null) {
            return ans;
        }

        memo.put(query, -1);
        int l = suffix.length();

        String[] arr = index.get(l);

        if (arr == null) {
            arr = new String[len];
            for (int i = 0; i < arr.length; i++) {
                String w = reversed[i];
                arr[i] = w.substring(w.length() - l) + "#" + w;
                // System.out.println(arr[i]);
            }
            index.put(l, arr);
        }


        for (int i = 0; i < arr.length; i++) {
            if (arr[i].startsWith(query)) {
                ans = len - 1 - i;
                memo.put(query, ans);
                return ans;
            }
        }

        return -1;
    }
}

/**
 * Your WordFilter object will be instantiated and called as such:
 * WordFilter obj = new WordFilter(words);
 * int param_1 = obj.f(prefix,suffix);
 */
```
