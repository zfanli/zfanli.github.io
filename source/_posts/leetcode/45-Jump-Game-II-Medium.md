---
date: '2021-03-27T15:36:05.451Z'
tags:
  - Array
  - Greedy
title: 45. Jump Game II (Medium)
categories:
  - leetcode
---

Topics:

Array, greedy.

```python
class Solution:
    def jump(self, nums: List[int]) -> int:
        n, ans, curr, nxt = len(nums), 0, 0, 0
        # No need of the last iteration so skip it here by `n - 1`.
        for i in range(n - 1):
            nxt = max(nxt, i + nums[i])
            if i == curr:
                curr = nxt
                ans += 1
            i += 1
        return ans
```

```java
class Solution {
    public int jump(int[] nums) {
        int n = nums.length, ans = 0, curr = 0, next = 0;
        for (int i = 0; i < n - 1; i++) {
            next = Math.max(next, i + nums[i]);
            if (i == curr) {
                curr = next;
                ans++;
            }
        }
        return ans;
    }
}
```

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var jump = function (nums) {
  let n = nums.length,
    curr = 0,
    next = 0,
    ans = 0;
  for (let i = 0; i < n - 1; i++) {
    next = next < i + nums[i] ? i + nums[i] : next;
    if (curr === i) {
      curr = next;
      ans++;
    }
  }
  return ans;
};
```
