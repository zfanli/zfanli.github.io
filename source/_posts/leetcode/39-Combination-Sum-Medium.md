---
date: "2021-03-25T15:36:05.449Z"
excerpt: ""
tags:
  - Array
  - Backtracking
title: 39. Combination Sum (Medium)
---

先读题，这种题真是脑细胞的初见杀。

> Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.
>
> The same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.
>
> It is guaranteed that the number of unique combinations that sum up to target is less than 150 combinations for the given input.

### 思路 & Solutions

Backtrack

```javascript
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function (candidates, target) {
  const ans = [];
  const sz = candidates.length;
  candidates.sort((a, b) => a - b);

  const dfs = (c, tar, comb, begin) => {
    if (tar === 0) ans.push(comb);

    for (let i = begin; i < sz; i++) {
      if (tar < c[i]) break;
      dfs(c, tar - c[i], [...comb, c[i]], i);
    }
  };

  dfs(candidates, target, [], 0);

  return ans;
};
```

```java
class Solution {
    private List<List<Integer>> ans = new ArrayList<>();
    private int sz;

    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        sz = candidates.length;
        Arrays.sort(candidates);
        dfs(candidates, target, new ArrayList<Integer>(), 0);
        return ans;
    }

    private void dfs(int[] c, int tar, List<Integer> comb, int begin) {
        if (tar == 0) ans.add(new ArrayList<>(comb));

        for (int i = begin; i < sz; i++) {
            if (tar < c[i]) break;
            comb.add(c[i]);
            dfs(c, tar - c[i], comb, i);
            comb.remove(comb.size() - 1);
        }
    }
}
```
