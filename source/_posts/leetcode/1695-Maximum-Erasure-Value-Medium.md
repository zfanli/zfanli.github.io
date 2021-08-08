---
date: '2021-08-04T15:36:05.604Z'
excerpt: >
  双指针 Sliding Window + nmap。入参数值上限 10^4，所以我们可以准备一个能容纳最大数字的数组来储存每个数字出现的次数。

  双指针方法，准备 `left`、`right` 两个指针，`right` 指针遍历整个数组，每次迭代计算合计值和最大值，当数字出现次数超过 1 时，迭代
  `left` 指针直到数字出现次数回到 1，迭代过程中将移出窗口的数字从合计值中减去。重复这个过程直到 `right` 到达终点。
tags:
  - Two Pointers
title: 1695. Maximum Erasure Value (Medium)
categories:
  - leetcode
---

双指针 Sliding Window + nmap。入参数值上限 10^4，所以我们可以准备一个能容纳最大数字的数组来储存每个数字出现的次数。

双指针方法，准备 `left`、`right` 两个指针，`right` 指针遍历整个数组，每次迭代计算合计值和最大值，当数字出现次数超过 1 时，迭代 `left` 指针直到数字出现次数回到 1，迭代过程中将移出窗口的数字从合计值中减去。重复这个过程直到 `right` 到达终点。

```python
class Solution:
    def maximumUniqueSubarray(self, nums: List[int]) -> int:
        score, left, total, mask = 0, 0, 0, [0] * 10001
        for right in nums:
            mask[right] += 1
            total += right
            while mask[right] > 1:
                mask[nums[left]] -= 1
                total -= nums[left]
                left += 1
            score = max(score, total)
        return score
```

```java
class Solution {
    public int maximumUniqueSubarray(int[] nums) {
        int[] map = new int[10001];
        int score = 0, left = 0, total = 0;
        for (int right : nums) {
            total += right;
            map[right]++;
            while (map[right] > 1) {
                total -= nums[left];
                map[nums[left++]]--;
            }
            score = Math.max(score, total);
        }
        return score;
    }
}
```
