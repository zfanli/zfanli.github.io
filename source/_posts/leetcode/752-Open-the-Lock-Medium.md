---
date: '2021-06-21T15:36:05.550Z'
tags:
  - BFS
title: 752. Open the Lock (Medium)
categories:
  - leetcode
---

圆盘锁有 4 个，每个锁上有 0 ～ 9 共十个数字，换个角度我们需要求出一个 10000 个节点的图中从 `0000` 出发到目标节点的最短路径，并且要避开给定的死路。总结一下已知的情报。

- 每个锁每次操作可以 +1 or -1；
- 当前状态的下一步操作有 4 \* 2 = 8 中选择；
- 要求最少步数，需要穷尽每一步的所有选择 -> 确定 BFS 应用场景；
- 为避免重复搜索，准备一个 `seen` 数组进行剪枝；
  - 已知圆盘锁的值都为数字且不重复，`seen` 数组可以初始化为长度为 10000 的布尔值 or 0/1 数组；
  - `deadends` 可以视作已经处理过的组合，可以将其对应的 `seen` 数组的元素设为 true；
- 为了方面计算，先将不好处理的特殊场景排除在外，这题有 2 个特殊场景：
  - 当目标等于初始值时，直接返回 0；
  - 当初始值被标记为死路时，直接返回 -1；
- 开始实现算法。

```python
class Solution:
    def openLock(self, deadends: List[str], target: str) -> int:
        if target == '0000':
            return 0

        depth, queue, seen, target = 0, [0], [0] * 10000, int(target)

        for d in deadends:
            seen[int(d)] = 1

        if seen[0]:
            return -1

        while len(queue) > 0:
            n, depth = len(queue), depth + 1
            for i in range(n):
                first = queue.pop(0)
                for k in range(4):
                    base = first // 10 ** k % 10
                    for d in (-1, 1):
                        # first - base * 10 ** k -> get the base number with target digit reset to 0.
                        # ~ + (base + d) % 10 * 10 ** k -> add back the caculated target digit.
                        nxt = first - base * 10 ** k + (base + d) % 10 * 10 ** k
                        if nxt == target:
                            return depth
                        if seen[int(nxt)]:
                            continue
                        seen[int(nxt)] = 1
                        queue.append(nxt)
        return -1
```
