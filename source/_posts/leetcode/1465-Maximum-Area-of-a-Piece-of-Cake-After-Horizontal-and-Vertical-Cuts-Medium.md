---
date: "2021-07-27T15:36:05.592Z"
excerpt:
  将横切和竖切排序，不要忘记加上最大的长宽 `h` 和 `w`，对每条切线求出实际长度（当前长度减去前一条线的长度），保留最大值。对取得的最大长宽求面积，结果用
  1e9 + 7 取模。
tags:
  - Array
title: 1465. Maximum Area of a Piece of Cake After Horizontal and Vertical Cuts (Medium)
---

将横切和竖切排序，不要忘记加上最大的长宽 `h` 和 `w`，对每条切线求出实际长度（当前长度减去前一条线的长度），保留最大值。对取得的最大长宽求面积，结果用 1e9 + 7 取模。

```python
class Solution:
    def maxArea(self, h: int, w: int, horizontalCuts: List[int], verticalCuts: List[int]) -> int:
        horizontalCuts.sort()
        horizontalCuts.append(h)
        verticalCuts.sort()
        verticalCuts.append(w)
        mh, mv = horizontalCuts[0], verticalCuts[0]
        for i in range(len(horizontalCuts) - 1, 0, -1):
            mh = max(mh, horizontalCuts[i] - horizontalCuts[i-1])
        for i in range(len(verticalCuts) - 1, 0, -1):
            mv = max(mv, verticalCuts[i] - verticalCuts[i-1])
        return (mh * mv) % (10**9 + 7)
```
