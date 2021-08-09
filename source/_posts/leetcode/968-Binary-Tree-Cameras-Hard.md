---
date: '2021-07-05T15:36:05.564Z'
tags:
  - DP
  - Tree
  - DFS
  - Binary Tree
title: 968. Binary Tree Cameras (Hard)
categories:
  - leetcode
---

## Before diving into the Solution

在二叉树上安装摄像头，每个摄像头可以监控 +1 的距离，也就是它的父节点、子节点和自身。求最少需要安装多少摄像头才能监控整棵树。

这道题我们讨论贪心算法和 DP 的应用。

<!-- more -->

## 思路 1，贪心从下而上

这里能使用贪心算法是因为我们可以从叶子节点开始，给叶子节点的父节点安装摄像头，并一步步往上推出需要安装摄像头的最小数量。

解题思路的第一步是要推算一个节点能有多少种状态，这道题每个节点存在 3 种状态：

- `0`: 无摄像头覆盖
- `1`: 有摄像头覆盖
- `2`: 节点安装了摄像头

第二步是要处理父节点遇到子节点处于上面各种状态时应该如何应对，根据状态有三种应对，我们需要按照顺序处理，即在下面的判断已经排除了上面的判断条件：

- 左右子节点有一个无摄像头覆盖（`0`）：此时父节点必须安装摄像头，即返回 `2`
- 左右子节点有一个安装了摄像头（`2`）：由于已经判断子节点没有无覆盖的情况，此时父节点可以算有摄像头覆盖，返回 `1`
- 除了上述情况以外（左右子节点均为 `1`）：由于没有子节点安装摄像头，此时父节点只能是无摄像头覆盖，返回 `0`

第二步程序的思路已经明确了，但是有些特殊情况需要处理，所以第三步我们要找出特殊 case。这里有 2 个特殊情况需要考虑：

- 叶子节点的处理
  - 由于我们希望叶子节点的父节点安装摄像头，所以我们希望叶子节点返回无摄像头覆盖（`0`）
  - 已知叶子节点的左右子节点均为空
    - 根据第二步总结的思路，当左右节点均为有摄像头覆盖（`1`）时，父节点才能返回无摄像头覆盖（`0`）
    - 结论：对于空节点需要返回有摄像头覆盖（`1`）
- 对于 `root` 节点的处理
  - `root` 节点也存在左右子节点存在无摄像头覆盖（`0`）的情况，有可能需要安装摄像头，这里有 2 种处理方法：
    1. 父节点需要安装摄像头时必须返回 `2`，所以判断递归最后一次返回值为 2 时主动增加一次计数
    2. 或者，用一个 `dummy` 节点包装 `root` 节点，将对其的处理包括在递归过程中，我们不关注 `dummy` 节点的返回值，这样可以省去手动判断
  - 这里我们选择第二种做法

思路整理到这里，可以开始实现算法了，下面是 Python 代码例子。

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def minCameraCover(self, root: TreeNode) -> int:
        # 0: not covered
        # 1: covered
        # 2: has camera

        def dfs(node):
            if node is None:
                # Mark none as covered
                return 1
            left = dfs(node.left)
            right = dfs(node.right)

            if min(left, right) == 0:
                self.ans += 1
                return 2
            elif max(left, right) == 2:
                return 1
            else:
                return 0

        self.ans = 0
        # Wrap root with a dummy node to avoid special case of 0 at root.
        dfs(TreeNode(left=root))

        return self.ans
```

## 思路 2，DP

忘掉思路 1，来看看 DP 的解决方案。

思路 1 总结的状态对 DP 方案不适用，忘掉它，我们重新总结一个节点**允许的状态**，这里不再包括无摄像头覆盖的场景。

第一步，总结节点可能的状态有三种：

- `BY_CH`：by children，节点被子节点的摄像头覆盖
- `BY_PR`：by parent，节点被父节点的摄像头覆盖
- `HAS_C`：has camera，节点被自己的摄像头覆盖

第二步，应用 DP。程序整体的做法是针对一个节点所有状态分别计算需要的摄像头数量，递交给上一层递归进行下一步判断，直到达到 `root` 节点时，由于不再存在父节点，取 `BY_CH` 和 `HAS_C` 的最小值作为答案。

对于每一次递归的逻辑，我们需要分别计算这三种状态下的摄像头安装数量，如果通过 flag 控制递归过程计算三次不同的值将造成大量重复计算（因为每个节点将执行 3 次递归逻辑），所以在每次递归逻辑中计算并返回这三个状态的值才是最优解。

在递归逻辑中我们执行下面的计算（已知当前节点（`node`）和左右子节点（`left`，`right`）及其三个状态值）：

- `BY_CH`：当前节点不安装摄像头，需要考虑子节点 `BY_CH` 和 `HAS_C` 的情况，我们取下面情况的最小值：
  - `left.HAS_C` + `right.HAS_C` ：左右子节点都存在摄像头，不需要当前节点安装摄像头
  - `left.HAS_C` + `right.BY_CH` ：左节点存在摄像头，右节点被其子节点覆盖，不需要当前节点安装摄像头
  - `left.BY_CH` + `right.HAS_C` ：左节点被其子节点覆盖，右节点存在摄像头，不需要当前节点安装摄像头
- `BY_PR`：当前节点不安装摄像头，也不依赖子节点安装摄像头，这个状态仅比上面多一种情况：
  - `node.BY_CH` ：当前节点依赖子节点安装摄像头的状态值，使用这个值避免重复计算
  - `left.BY_CH` + `right.BY_CH` ：左右子节点被各自的子节点的摄像头覆盖，不需要当前节点安装摄像头
- `HAS_C`：当前节点**安装摄像头**，需要考虑子节点 `BY_PR` 和 `HAS_C` 的情况，取下面状态的最小值，**在此基础上+1**：
  - `left.BY_PR` + `right.BY_PR` ：左右子节点都依赖当前节点安装摄像头
  - `left.BY_PR` + `right.HAS_C` ：左节点依赖当前节点安装摄像头，右节点存在摄像头
  - `left.HAS_C` + `right.BY_PR` ：左节点存在摄像头，右节点依赖当前节点安装摄像头

> 在计算 `HAS_C` 时不应该考虑子节点被其子节点覆盖（`BY_CH`）的情况，从逻辑上来说，如果子节点被其子节点覆盖，也就不再依赖父节点安装摄像头；其次，考虑下面的 case，如果节点 A 考虑子节点 B 依赖其子节点覆盖的情况，那么为了覆盖节点 B 的两个子节点，B 的 `BY_CH` 状态值将等于 2，那么如果节点 A 安装摄像头，A 的 `HAS_C` 最终为 2 + 1 = 3，已经偏离最优解。
>
> ```
>    O
>    │
> ┌──┴──┐
> │     │
> O     O(A)
>       │
>    ┌──┴──┐
>    │     │
>    O     O(B)
>          │
>       ┌──┴──┐
>       │     │
>       O     O
> ```

这个思路需要考虑的特殊情况同样是叶子节点和递归返回值。

- 叶子节点
  - 叶子节点不存在被子节点覆盖（`BY_CH`）的情况
    - 所以将其子节点的 `HAS_C` 设为无限大，这个值将在下一次计算中被舍弃
    - 其子节点的另外两个状态初始化为 0 即可
- `root` 节点的递归返回值
  - 之前已经解释过了，对于 `root` 来说已经不存在父节点了，所以我们在其返回值中取 `BY_CH` 和 `HAS_C` 的最小值作为答案

思路整理结束，信息量足够开始实现算法了。下面是 Python 代码例子。

```python
BY_PR = 0 # covered by parent
BY_CH = 1 # covered by children
HAS_C = 2 # has camera

class Solution:
    def minCameraCover(self, root: TreeNode) -> int:

        def df(node):
            if node is None:
                return 0, 0, float('inf')

            l = df(node.left)
            r = df(node.right)
            bych = min(l[HAS_C] + r[HAS_C], l[HAS_C] + r[BY_CH], l[BY_CH] + r[HAS_C])
            bypr = min(l[BY_CH] + r[BY_CH], bych)
            hasc = min(l[BY_PR] + r[BY_PR], l[BY_PR] + r[HAS_C], l[HAS_C] + r[BY_PR]) + 1
            return bypr, bych, hasc

        return min(df(root)[1:])
```

## 总结

贪心和 DP 思路差异比较明显。

- 贪心思路默认处于最优情况，只讨论最坏 case
- DP 思路计算所有情况，仅舍弃不合理的 case

但是两者都需要清晰的有目的性的思考才能理清思路，相对来说，DP 方案比贪心方案要容易一些，因为贪心方案需要更加细致的观察。
