---
title: 279. Perfect Squares (Medium)
tags:
  - Math
  - DP
  - BFS
date: "2021-09-18T14:07:39.661Z"
---

给你一个数 `n`，你需要计算出最少需要多少个**完全平方数**可以组成 `n`。

**完全平方数**是指数字本身是另一个数的平方，比如 `1`、`4`、`9` 是完全平方数，因为它们分别是 `1`、`2`、`3` 的平方，但是 `3`、`11` 不是完全平方数。

<!-- more -->

## BFS 思路

要找到一个数最少需要多少个完全平方数组成，我们可以使用宽度优先的搜索算法来实现。比如当 `n = 12` 时，我们可以像下面的流程图实例的步骤这样，每一层枚举出所有可能的完全平方数，直到某一层数值归零，则这一层的层数就是最少需要的完全平方数的个数。

<pre class="text-center"><code class="d-inline-block mt-0 mb-3 text-start">
                                                 n = 12
                  +-------------------------------------------------------------+
                  |                                 |                           |
             11(12-1^2)                         <span class="text-danger">8(12-2^2)</span>                   3(12-3^2)
      +----------------------+            +------------------+                  -
      |           +          |            |                  |                  +
 10(11-1^2)  7(11-2^2)  2(11-3^2)     7(8-1^2)            <span class="text-danger">4(8-2^2)</span>           2(3-1^2)
  +-------+    +---+        -        +---------+        +----------+            -
  |   +   |    |   |        +        |         |        |          |            +
     ...        ...        ...   6(7-1^2)  3(7-2^2)  3(4-1^2)   <span class="text-danger">0(4-2^2)</span>     1(2-1^2)
   +-----+       -          -      +--+        +        -                       -
   |     |       +          +      |  |        |        +                       +
     ...        ...        ...     ...        ...      ...                   0(1-1^2)
</code><div>BFS while n = 12</div></pre>

我们使用队列来完成这个算法。

```python
class Solution:
    def numSquares(self, n: int) -> int:

        q = deque([n])
        step = 0
        while q:
            step += 1
            for i in range(len(q)):
                curr = q.popleft()
                j, val = 1, curr - 1
                while val >= 0:
                    if val == 0:
                        return step
                    q.append(val)
                    j, val = j + 1, curr - j ** 2
```

## DP 思路

用动态规划分别求出需要多少个完全平方数构成 `1` 到 `n` 为止的所有数字。我们从 `1` 开始计算，每次计算下一个数时，由于差值为 `1`，所以一定能得到这个数需要由多少个完全平方数组成的值。

```python
class Solution:
    def numSquares(self, n: int) -> int:
        dp = [math.inf] * (n + 1)
        # base case
        dp[0] = 0

        for i in range(1, n + 1):
            minval = math.inf
            j = 1
            while i - j ** 2 >= 0:
                minval = min(minval, dp[i - j ** 2] + 1)
                j += 1
            dp[i] = minval

        return dp[n]
```

算法完成了，但是使用 Python 时会遇到超时报错，这是由于 Python 属于高级语言，执行效率相对较慢。我们换 Java 尝试实现一样的算法。这个算法可以通过所有测试 case，并且效率良好。

```java
class Solution {
    public int numSquares(int n) {
        int[] dp = new int[n + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;

        for (int i = 1; i <= n; i++) {
            int min = Integer.MAX_VALUE;
            int j = 1;
            while (i - j * j >= 0) {
                min = Math.min(min, dp[i - j * j] + 1);
                j++;
            }
            dp[i] = min;
        }

        return dp[n];
    }
}
```

## DP 思路：静态优化

观察上面的算法，我们会发现如果测试集中存在 `100` 和 `200` 的话，计算前者时我们会从 `1` 到 `100` 分别计算最少完全平方数，计算后者时从 `1` 到 `200` 分别计算最少完全平方数。发现了什么？是的，`1` 到 `100` 这个区间的数被重复计算了，作为优化，可以考虑使用全局变量或者静态变量来存储这些结果来避免重复计算。比如上面的 Java 算法我们将 `dp` 变量变成静态之后，从结果来看，测试数据集的处理效率有了很大提升。

```java
class Solution {
    private static List<Integer> dp = new ArrayList<>(Arrays.asList(0));

    public int numSquares(int n) {

        for (int i = dp.size(); i <= n; i++) {
            int min = Integer.MAX_VALUE;
            int j = 1;
            while (i - j * j >= 0) {
                min = Math.min(min, dp.get(i - j * j) + 1);
                j++;
            }
            dp.add(min);
        }

        return dp.get(n);
    }
}
```

我们尝试对之前的 Python 算法进行修改，将 `dp` 提升为全局变量，结果以较好的效率通过测试 case。

```python
dp = [0]

class Solution:
    def numSquares(self, n: int) -> int:

        for i in range(len(dp), n + 1):
            minval = math.inf
            j = 1
            while i - j ** 2 >= 0:
                minval = min(minval, dp[i - j ** 2] + 1)
                j += 1
            dp.append(minval)

        return dp[n]
```
