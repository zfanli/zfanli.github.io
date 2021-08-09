---
date: "2021-04-18T15:36:05.473Z"

tags:
  - String
  - DP
title: 97. Interleaving String (Medium)
---

思路 1，2D 数组动态规划。这题乍一看用快慢指针可以解出来，但是这是个陷阱，设想如果下一个字符可以同时从 `s1` 和 `s2` 中取得，如果使用快慢指针这里如何处理？可以考虑回溯算法，但是这变成了暴力破解，无法在时限内通过测试 case。

DP 相关的题目对思路和直觉有要求，为了方便后面的计算，我们先把一个特殊 case 排除在外：

- 如果 `s1.length` + `s2.length` != `s3.length`，那就没有必要计算了，直接返回 `false`。

接下来分析 DP 的思路。

- 准备一个 `(m + 1)` \* `(n + 1)` 的 2D 数组；
  - `m`：`s1.length`；`n`：`s2.length`；
  - \+ 1 的原因是要留出第一个字符不选 `s1` 或 `s2` 的空间；
- 初始化 `dp[0][0]` 为 `true` or 1，这个坐标意味长度为 0 的场景；
- 接下来要做的事情就是遍历 `dp` 的所有元素，计算对应下标的元素的值；
- 如果最后一个元素 `dp[-1][-1]` 的值为 `true` or 1，则 `s1` 和 `s2` 可以交替构成 `s3`。

我们可以用示例画出对应的表格来帮助理解。

s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"

| n \ m |  0  | 1(a) | 2(a) | 3(b) | 4(c) | 5(c) |
| :---: | :-: | :--: | :--: | :--: | :--: | :--: |
|   0   |  1  |  1   |  1   |  0   |  0   |  0   |
| 1(d)  |  0  |  0   |  1   |  0   |  0   |  0   |
| 2(b)  |  0  |  0   |  1   |  1   |  0   |  0   |
| 3(b)  |  0  |  0   |  1   |  0   |  0   |  0   |
| 4(c)  |  0  |  0   |  1   |  1   |  1   |  0   |
| 5(a)  |  0  |  0   |  0   |  0   |  1   |  1   |

可以观察到，从 （0， 0） 开始，我们行走的方向只有向右和向下。

- 向右：选择使用 `s1` 的字符，如果下一个字符匹配 `s3[row + col - 1]` 则设其值为 1；
- 向下：选择使用 `s2` 的字符，如果下一个字符匹配 `s3[row + col - 1]` 则设其值为 1。

换言之，要计算当前位置的值时，需要先检查上面一个和左边一个值是否被选用。

```python
class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        if len(s1) + len(s2) != len(s3):
            return False

        m, n = len(s1), len(s2)

        dp = [[False] * (n + 1) for _ in range(m + 1)]
        dp[0][0] = True

        for i, j in itertools.product(range(m + 1), range(n + 1)):
            k, top, left = i + j - 1, False, False
            if i != 0:
                top = s3[k] == s1[i - 1] and dp[i - 1][j]
            if j != 0:
                left = s3[k] == s2[j - 1] and dp[i][j - 1]
            if i + j > 0:
                dp[i][j] = top or left

        return dp[-1][-1]
```

思路 2，1D 数组动态规划。

通过观察可以知道上面方法每次最多只看到上一行，那么实际上我们没必要准备一个全量的 2D 数组，一个 1D 数组足够处理这些数据了。

```python
class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        if len(s1) + len(s2) != len(s3):
            return False

        m, n = len(s1), len(s2)

        dp = [False] * (n + 1)
        dp[0] = True

        for i, j in itertools.product(range(m + 1), range(n + 1)):
            k, top, left = i + j - 1, False, False
            if i != 0:
                top = s3[k] == s1[i - 1] and dp[j]
            if j != 0:
                left = s3[k] == s2[j - 1] and dp[j - 1]
            if i + j > 0:
                dp[j] = top or left

        return dp[-1]
```
