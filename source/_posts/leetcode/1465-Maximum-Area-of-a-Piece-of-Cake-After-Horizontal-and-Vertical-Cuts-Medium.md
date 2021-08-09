---
date: "2021-07-27T15:36:05.592Z"

tags:
  - Array
  - Greedy
  - Sorting
title: 1465. Maximum Area of a Piece of Cake After Horizontal and Vertical Cuts (Medium)
---

## Before diving into the Solution

切蛋糕问题。给你一个尺寸为 `h` x `w` 的矩形蛋糕，还有两个数组 `horizontalCuts` 和 `verticalCuts` 分别表示水平方式切的位置和垂直方向切的位置。

- 水平切面的值从蛋糕的最上边开始计算；
- 相同的，垂直切面的值从蛋糕的最左边开始计算。

求蛋糕切分之后的单块蛋糕的最大面积。因为结果可能是一个很大的数字，将其和 `109 + 7` 取模之和作为答案返回。

实际上是求两个数组的最大差之积，需要考虑的细节是四条边的值不在数组中，如果漏掉它们将不能得到正确答案。

<!-- more -->

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
