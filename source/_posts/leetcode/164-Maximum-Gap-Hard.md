---
date: "2021-05-12T15:36:05.501Z"

tags:
  - Sort
title: 164. Maximum Gap (Hard)
---

桶排序实现常数 n 的 O(n)复杂度。

桶排序是指将数据划分为诺干子数组，称之为桶，在桶内使用一般排序算法（比如 O(n^2)的插入排序等）排序，等到每一个桶就完成各自的排序之后，将所有桶按照顺序组合起来，获得最终排序完成的数组。

这样做的优势，通过一个例子可以清晰的明白：我们有一个长度为 10 的数组需要排序；

- 使用插入排序，O(n^2)的情况下最差的情况将进行 10\*10=100 次操作；
- 使用桶排序，选择最大的桶将数组分为两个长度为 5 的子数组，分别应用排序，最差情况将进行 10（分桶）+5\*5（插入排序）\*2（2 个桶） =60 次操作。

但是桶的尺寸为 2 对于这个场景并不是最优的选择，这个例子解释了就算用极限分桶，也比单独使用插入排序高效。

桶排序的重点在于决定桶的尺寸，这直接影响到排序效率，对于这道题来说，通过数学归纳可以得知，最大间距的最小可能应该是间距的平均值，而当所有数的间隔都是平均分布的时候才会遇到这个场景，比如 `[0, 5, 10, 15]`，其中总间距为最大值减去最小值，即 `15-0=15`，通过观察得知间距的数量为数组长度减去 `1`，即 `4-1=3`，那么平均间距为 `15/3=5`，对于这个数组来说，平均间距就是最大间距，但是一旦其中任何一个值变大或变小任意长度，比如 `[0, 4, 10, 15]`，第一个间距从 `5` 变为 `4`，就必定意味着第二个间距从 `5` 变为 `6`。

```python
class Solution:
    def maximumGap(self, nums: List[int]) -> int:
        ans, n, hi, lo = 0, len(nums), max(nums), min(nums)
        if n < 2: return 0
        # Set 1 for case that max gap less than its length.
        bsize = (hi - lo) // (n - 1) or 1
        buckets = [[-1, -1] for _ in range((hi - lo) // bsize + 1)]
        for x in nums:
            b = (x - lo) // bsize
            buckets[b][0] = min(buckets[b][0], x) if buckets[b][0] != -1 else x
            buckets[b][1] = max(buckets[b][1], x)
        prev = buckets[0][1]
        for i in range(1, len(buckets)):
            if buckets[i][0] == -1:
                continue
            ans = max(ans, buckets[i][0] - prev)
            prev = buckets[i][1]
        return ans
```
