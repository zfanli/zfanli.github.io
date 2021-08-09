---
date: "2021-06-17T15:36:05.546Z"

tags:
  - Trie
title: 745. Prefix and Suffix Search (Hard)
---

Trie

```java
class WordFilter {

    private Map<Integer, String[]> index = new HashMap<>();
    private int len;
    private String[] reversed;
    private Map<String, Integer> dp = new HashMap<>();

    public WordFilter(String[] words) {
        this.len = words.length;
        Collections.reverse(Arrays.asList(words));
        this.reversed = words;
    }

    public int f(String prefix, String suffix) {
        String query = suffix + "#" + prefix;
        Integer ans = dp.get(query);
        if (ans != null) {
            return ans;
        }

        dp.put(query, -1);
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
                dp.put(query, ans);
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
