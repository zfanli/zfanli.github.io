---
date: '2021-06-11T15:36:05.539Z'
tags:
  - Array
  - Math
title: 667. Beautiful Arrangement II （Medium）
---

给定两个数 `n` 和 `k`，你需要构建一个数组包含从 `1` 到 `n` 的正整数，并且相邻两个数的差组成的数组必须要有 `k` 个不重复的元素。

<!-- more -->

## Understanding the Problem

With solutions both in Python and Java.

先读题：

> Given two integers `n` and `k`, you need to construct a list which contains `n` different positive integers ranging from 1 to `n` and obeys the following requirement:
>
> Suppose this list is `[a1, a2, a3, ... , an]`, then the list `[|a1 - a2|, |a2 - a3|, |a3 - a4|, ... , |an-1 - an|]` has exactly `k` distinct integers.
>
> If there are multiple answers, print any of them.

简而言之，我们要根据两个整数参数 `n` 和 `k`，来输出一个从 1 开始到 `n` 的整数数组，并且这个数组中，所有相邻的两个整数之间的差，其绝对值要凑齐 `k` 个不同的整数。

来看看例子。

Example 1:

```
Input: n = 3, k = 1
Output: [1, 2, 3]
Explanation: The [1, 2, 3] has three different positive integers ranging from 1 to 3, and the [1, 1] has exactly 1 distinct integer: 1.
```

输出结果为整数 1 ～ 3，相邻整数的差为 [1, 1]，去重后长度为 1，满足 `k = 1` 的需求。

Example 2:

```
Input: n = 3, k = 2
Output: [1, 3, 2]
Explanation: The [1, 3, 2] has three different positive integers ranging from 1 to 3, and the [2, 1] has exactly 2 distinct integers: 1 and 2.
```

输出结果为整数 1 ～ 3，相邻整数的差为 [2, 1]，满足 `k = 2` 的需求。

## Submission

先贴一下我自己独立完成的结果，防止剧透，具体代码会贴在最后。

我的代码中，空间复杂度还需要研究一下，目前还没找到提升的思路。

**Python**

|         | Result  | Beats  |
| ------- | ------- | ------ |
| Runtime | 40 ms   | 96.55% |
| Memory  | 15.1 MB | 50.34% |

## 思路

这道题偏重考验观察。我们要做的是观察并找到数组排列的规律，用算法实现出来。

已知条件：

- 输出数组包含 1 ～ n 的整数
- 需要做的是调整数组中数字出现的顺序，致使相邻的两个数之间的差不同
- 相邻两个数的差只考虑绝对值
- 相邻两个数的差的绝对值构成的数组长度为 k
- 由于不关注具体的差的值，所以有不同解法，只需要找出一种

先硬算几个例子来找找规律。

(因为懒，这里我直接贴讨论帖中的例子，UAADs 指的是唯一绝对相邻数差，贴主原文全称是 Unique Absolute Adjacent Difference，为了方便理解，后面我们就称之为“相邻数差”。)

```console
For eg.
1. let n = 10, k = 4
permutation => [1, 5, 2, 4, 3, 6, 7, 8, 9, 10]
UAADs       => [X, 4, 3, 2, 1, 3, 1, 1, 1, 1]


2. n = 10, k = 5
permutation => [1, 6, 2, 5, 3, 4, 7, 8, 9, 10]
UAADs       => [X, 5, 4, 3, 2, 1, 3, 1, 1, 1]


3. n = 9, k = 8
permutation => [1, 9, 2, 8, 3, 7, 4, 6, 5]
UAADs       => [X, 8, 7, 6, 5, 4, 3, 2, 1]
```

题目不关注相邻数差的具体数值，所以正确的排列方式不止一种，这里我们只讨论可以相对直观理解的一种。

观察上面例子可以了解到：

- 输出的数组从 1 开始
- 第二个数是 k + 1
- 要求 k 个不同相邻数差会影响 k 个元素
- 不受 k 影响的数按自然顺序排序

> 可能 `要求 k 个不同相邻数差会影响 k 个元素` 不是很直观，我们通过分解上面的例子来理解。
>
> 下面结论中，1 一直处于固定位置，高亮出来的部分是排序受到 k 影响的数，而剩余的数（如果有的话）将按照递增排序。
>
> n = 10, k = 4 => [1, `5, 2, 4, 3,` 6, 7, 8, 9, 10]
>
> n = 10, k = 5 => [1, `6, 2, 5, 3, 4,` 7, 8, 9, 10]
>
> n = 9, k = 8 => [1, `9, 2, 8, 3, 7, 4, 6, 5`]

设定好了前提，接下来我们需要关注的问题变成了观察并理解“受到 k 影响的元素应该如何排序”。

多看几眼上面的例子，我们可以直观的意识到规律：为了满足 k 个不同的相邻数差，我们将排序靠后的数依次插入到 `1, 2, 3, ..., n` 之间，来制造不同的绝对差。

了解规律之后，可以开始实现算法了，这是一些对于时间复杂度和空间复杂度的考虑。

- 避免使用尾递归
- 控制循环次数
- 不使用非必要的变量

## Solutions

### Python

```python
class Solution:
    def constructArray(self, n: int, k: int) -> List[int]:
        # 初始化一个数组，由于前两个值是已知的，所以直接写入字面量
        ans = [1, k + 1]
        # 以 k 为基准进行循环
        for x in range(1, k):
            # 取倒数第二个值为计算基数，根据当前 index 决定做递增或递减
            ans.append(ans[-2] + (1 if x % 2 == 1 else -1))
        # 按自然顺序填充剩下的元素
        ans += range(k + 2, n + 1)
        return ans
```

结果如下。

|         | Result  | Beats  |
| ------- | ------- | ------ |
| Runtime | 40 ms   | 96.55% |
| Memory  | 15.1 MB | 50.34% |

### Java

由于先做出了 Python 版本，相同思路转换成 Java 代码结果很糟糕。

这里根据讨论帖的提示完成了一个较优的方案。

```java
class Solution {
    public int[] constructArray(int n, int k) {
        int[] ans = new int[n];
        // l 为递增初始值，r 为递减初始值，用 i 来保存 index
        int l = 1, r = k + 1, i = 0;
        // 执行一个步长为 2 的循环来填充数组直到满足 k 个相邻数差
        while (i < k) {
            ans[i++] = l++;
            ans[i++] = r--;
        }
        // 由于数组以1起始，故当 k 为偶数时做 2 步长的循环将漏掉一个数
        if (l == r) ans[i++] = r;
        // 依序填充自然递增的数直到填至 n 为止
        while (i < n) ans[i++] = i;
        return ans;
    }
}
```

结果如下。

|         | Result  | Beats   |
| ------- | ------- | ------- |
| Runtime | 0 ms    | 100.00% |
| Memory  | 39.1 MB | 73.71%  |

> 受 Java 版本思路启发，我修改了一下 Python 的算法，在空间复杂度上得到一些提升。
>
> ```python
> class Solution:
>    def constructArray(self, n: int, k: int) -> List[int]:
>        ans = [1, k + 1]
>        # 执行一个步长为 2 的循环来制造不同的相邻数差
>        for x in range(2, k, 2):
>            ans.append(ans[x-2] + 1)
>            ans.append(ans[x-1] - 1)
>        # 补充 k 为偶数时漏掉的数
>        if ans[-1] -2 == ans[-2]: ans.append(ans[-1] - 1)
>        ans += range(len(ans) + 1, n + 1)
>        return ans
> ```
>
> 结果如下。
>
> |         | Result  | Beats  |
> | ------- | ------- | ------ |
> | Runtime | 40 ms   | 96.55% |
> | Memory  | 15.1 MB | 82.76% |

## 官方 Solution

来学习一下官方答案的思路。这个问题官方给出了 2 个方案。

### Approach #1: Brute Force [Time Limit Exceeded]

顾名思义，这个方法是暴力枚举所有排列，直到找到合适的排列。具体做法是准备一个检查唯一相邻数差数量的函数，然后对 1 ～ n 的数组排列进行枚举，直到找到该函数返回的唯一相邻数差的数量匹配 k 的值...

这个方法就不细说了，下面的代码看看就好。

```python
class Solution(object):
    def constructArray(self, n, k):
        seen = [False] * n
        def num_uniq_diffs(arr):
            ans = 0
            for i in range(n):
                seen[i] = False
            for i in range(len(arr) - 1):
                delta = abs(arr[i] - arr[i+1])
                if not seen[delta]:
                    ans += 1
                    seen[delta] = True
            return ans

        for cand in itertools.permutations(range(1, n+1)):
            if num_uniq_diffs(cand) == k:
                return cand
```

### Approach #2: Construction [Accepted]

先看看官方原文，不过有些 LaTex 表达式不一定能正常显示，可以去 [原地址](https://leetcode.com/problems/beautiful-arrangement-ii/solution/) 查看。看完原文我们来分析和理解一下官方的思路。

> **Intuition**
>
> When \text{k = n-1}k = n-1, a valid construction is \text{[1, n, 2, n-1, 3, n-2, ....]}[1, n, 2, n-1, 3, > n-2, ....]. One way to see this is, we need to have a difference of \text{n-1}n-1, which means we need > \text{1}1 and \text{n}n adjacent; then, we need a difference of \text{n-2}n-2, etc.
>
> Also, when \text{k = 1}k = 1, a valid construction is \text{[1, 2, 3, ..., n]}[1, 2, 3, ..., n]. So we > have a construction when \text{n-k}n-k is tiny, and when it is large. This leads to the idea that we can > stitch together these two constructions: we can put \text{[1, 2, ..., n-k-1]}[1, 2, ..., n-k-1] first so > that \text{n}n is effectively \text{k+1}k+1, and then finish the construction with the first \text{"k = > n-1"}"k = n-1" method.
>
> For example, when \text{n = 6}n = 6 and \text{k = 3}k = 3, we will construct the array as \text{[1, 2, 3, > 6, 4, 5]}[1, 2, 3, 6, 4, 5]. This consists of two parts: a construction of \text{[1, 2]}[1, 2] and a > construction of \text{[1, 4, 2, 3]}[1, 4, 2, 3] where every element had \text{2}2 added to it (i.e. \text{> [3, 6, 4, 5]}[3, 6, 4, 5]).
>
> **Algorithm**
>
> As before, write \text{[1, 2, ..., n-k-1]}[1, 2, ..., n-k-1] first. The remaining \text{k+1}k+1 elements > to be written are \text{[n-k, n-k+1, ..., n]}[n-k, n-k+1, ..., n], and we'll write them in alternating > head and tail order.
>
> When we are writing the i^{th}i
> th
> element from the remaining \text{k+1}k+1, every even ii is going to be chosen from the head, and will > have value \text{n-k + i//2}n-k + i//2. Every odd ii is going to be chosen from the tail, and will have > value \text{n - i//2}n - i//2.

按照这个方案的思路，首先我们观察俩个极端：k 为最大值 n-1 时的结果；以及 k 为最小值 1 时的结果。

当 k = n - 1 时，这个时候数组根据数组序列（index）的奇偶性，出现奇数取头部（[1, 2, 3, ...]），偶数取尾部（[n, n-1, n-2, ...]）的规律。其最终结果如下。

`[1, n, 2, n-1, 3, n-2, ...]`

而当 k = 1 时，数组按照自然顺序递增排列。

`[1, 2, 3, ..., n]`

了解到这两个规律之后，我们可以将其结合：

- 将 n-k-1 的部分的数按照 k = 1 时的规律处理；
- 而剩下的 k + 1 个元素单独视作一个数组，采取 k = n - 1 时的处理。

这样就可以将处理划分为两类，用最简单的方法来构建这个数组。

- 首先构建 `[1, 2, ..., n-k-1]` 数组
- 从 n-k 开始的数根据 index 的奇偶性来取值
  - 当 index 为偶数时从头部取值，这时值为 n-k + i//2
  - 当 index 为奇数时从尾部取值，这时值为 n - i//2

参考代码。

```python
class Solution(object):
    def constructArray(self, n, k):
        ans = list(range(1, n - k))
        for i in range(k+1):
            if i % 2 == 0:
                ans.append(n-k + i//2)
            else:
                ans.append(n - i//2)

        return ans
```

## 总结

- 从代码上来看，先取 k = 1 的排序，再取 k = n - 1 的排序确实让代码逻辑更加简洁和易懂；
- 从结果上来看，这段代码在空间复杂度上有改善（beats 82.76%），但是时间复杂度上有上升（beats 86.21%）。
