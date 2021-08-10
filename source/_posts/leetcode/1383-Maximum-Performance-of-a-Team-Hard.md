---
date: '2021-07-23T15:36:05.585Z'
tags:
  - Array
  - Greedy
  - Sorting
  - Heap (Priority Queue)
title: 1383. Maximum Performance of a Team (Hard)
---

你需要从 `n` 个工程师中选择最多 `k` 位构成一个小组，并保证获得最好的绩效表现。

你有两个数组 `speed` 和 `efficiency` 分别表示每个工程师的速度和效率。

小组的绩效表现计算方法：小组所有成员的速度之和乘以小组成员效率的最小值。由于结果数组可能会非常大，将结果和 `10^9 + 7` 取模作为答案返回。

工程师的速度和效率是捆绑的，所以要知道答案，我们只能尝试将每一位工程师编入小组，可以使用贪心算法解决问题。

<!-- more -->

## 思路

解题思路是先计算局部最优解，再计算全局的最优解，是典型的贪心算法的应用场景。但这道题困难之处在于需要保持两个排序，而意识到这个解决方案需要一定的直觉。

读完题我们可以了解到团队的表现计算公式为：`sum(speeds) * min(efficiencies)`，这里的细节是选择的团队成员最多可以达到`k`位，意味着当团队人数少于`k`能取得更好的表现时的结果可以作为局部最优解。

据此我们开始思考，暴力解法最大的问题在于做了很多没有意义的运算，如果能找到一个方法对暴力算法进行剪枝，我们就能更快的得到答案。这道题的瓶颈在于 `efficiency` 取其最小值，而换句话来说，如果我们指定了一个队员的 `efficiency` 为最小值，那么此时的局部最优解将会是所有效率高于这个队员的人之中速度最快的前 `k-1` 个人加上这个队员的速度（我们一共选了 `k` 个人），将结果乘以这个队员的效率（因为这个队员是最小值）。

要实现这个思路需要保持 2 个排序：

- `efficiency` 降序：将队员按照效率以降序排序，这样遍历的时候当前的队员永远是效率低于前面队员的；
- `speed` 动态排序：按照效率遍历，每次挑选一个队员，动态计算出速度的排序，还需要关注几个细节：
  - `speed` 排序元素的长度达到 `k` 时意味着接下来如果我们加了一个队员，就一定要放走一个已有的队员，我们放走速度最慢的队员；
  - 堆的数据结构非常适合 `speed` 排序，我们可以将新的值丢入堆中，每次从堆顶移出一个最小值。

```python
class Solution:
    def maxPerformance(self, n: int, speed: List[int], efficiency: List[int], k: int) -> int:
        es = sorted(zip(efficiency, speed), key=lambda x: -x[0])
        ans, total, q = 0, 0, []
        for e, s in es:
            total, ans = total + s, max(ans, (total + s) * e)
            heapq.heappush(q, s)
            if len(q) == k:
                total -= heapq.heappop(q)
        return ans % (10 ** 9 + 7)
```
