---
title: 236. Lowest Common Ancestor of a Binary Tree (Medium)
tags:
  - Tree
  - DFS
  - Binary Tree
date: "2021-08-23T06:42:28.499Z"
---

你有一棵二叉树，给你 2 个节点，让你寻找它们的最近公共祖先节点。根据 Wiki 描述最近公共祖先的定义如下。

> 在图论和计算机科学中，最近公共祖先（英語：lowest common ancestor）是指在一个树或者有向无环图中同时拥有 v 和 w 作为后代的最深的节点。在这里，我们定义一个节点也是其自己的后代，因此如果 v 是 w 的后代，那么 w 就是 v 和 w 的最近公共祖先。
>
> 最近公共祖先是两个节点所有公共祖先中离根节点最远的，计算最近公共祖先和根节点的长度往往是有用的。比如为了计算树中两个节点 v 和 w 之间的距离，可以使用以下方法：分别计算由 v 到根节点和 w 到根节点的距离，两者之和减去最近公共祖先到根节点的距离的两倍即可得到 v 到 w 的距离。

节点本身可以是自己的后代，也就是说对于要寻找的节点 A 和 B，如果节点 B 是节点 A 的子节点，那么它们的最近公共祖先节点是节点 A。

<!-- more -->

## 思路 1，DFS

这道题用 DFS 的思路比较直观。

- 我们设计一个 DFS 算法遍历搜索节点的后代是否存在目标节点；
- 这个算法返回一个 `flag`；
- 当有节点第一次集齐了 2 个 `flag`，我们就找到了答案。

将这个思路详细化，就可以得到我们的代码了。其中我们要考虑 2 个`flag`，出于方便考虑，我们使用整数值来做这个 `flag`，一旦这个值变成 2，就表示在当前的节点集齐了两个目标。

- DFS 的不执行的条件是节点不存在，或已找到答案（剪枝）；
- 这是一个从下而上的算法，我们首先搜索左右子节点，将结果汇集起来（`res`）；
- 然后判断当前节点是否符合要求，更新结果（`res`）；
- 接着是我们的 base case，如果结果等于 2，更新答案并结束递归；
- 如果没找到答案，返回结果，继续递归。

```python
class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        self.ans = None

        def dfs(node):
            # pruning
            if not node or self.ans:
                return 0

            res = dfs(node.left) + dfs(node.right)

            if node == p or node == q:
                res += 1

            if res == 2:
                self.ans = node
                return 0

            return res

        dfs(root)
        return self.ans
```

## 思路 2，迭代 + 父节点指针

使用迭代思路可以优化递归的调用栈的额外空间使用。

迭代过程中，

- 我们先做一个简单的前序遍历拿到所有需要的子节点和与其对应的父节点的指针；
- 然后将其中一个目标节点包括其所有父节点存入一个集合中；
- 用另一个目标节点一层一层匹配其本身或其父节点是否存在集合中；
- 当找到存在集合中的父节点（包含其本身），作为答案返回。

```python
class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        stack, parents = [root], {root: None}

        # create the parent pointer table until we find both the target nodes
        while p not in parents or q not in parents:
            node = stack.pop()
            if node.right:
                stack.append(node.right)
                parents[node.right] = node
            if node.left:
                stack.append(node.left)
                parents[node.left] = node

        ancestors = set()

        # make the ancestors set using one of the target nodes
        while p:
            ancestors.add(p)
            p = parents[p]
        # check the parents using the another node
        while q not in ancestors:
            q = parents[q]

        return q
```

## 思路 3，迭代 + 无父节点指针

思路 2 的父节点指针可以用另一个思路来避免使用。

这个方法中我们尝试维护每一个节点的状态：

- 还未访问：`PENDING = 2`
- 访问了一个节点：`HALF_DONE = 1`（实际上这个状态未显式使用）
- 访问了所有节点：`DONE = 0`

然后针对当前节点处于某个状态，进行不同的处理：

- 如果当前节点还没访问所有节点：`!= DONE`；
  - 如果当前节点第一次进入循环：`== PENDING`；
    - 检查当前节点是否是目标节点：如果是的；
      - 检查是否已经找到上一个：`one_node_found`；
        - 返回父节点指针的节点，这是这个算法的 base case；
      - 如果这是找到的第一个节点：
        - 更新 flag，设置当前节点为父节点指针的对象；
    - 将左节点作为下一个目标；
  - 如果并非第一次进入循环，说明左节点已经遍历过了，将右节点作为下一个目标；
- 如果当前节点已经被完全访问；
  - 如果父节点指针指向当前节点，将指针指向父节点；
  - 删除栈顶的节点；
- failed case：直接返回 None。

```python
PENDING = 2
DONE = 0

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        stack = [[root, PENDING]]
        one_node_found, parent_index = False, -1

        while stack:
            node, state = stack[-1]
            # if iteration not done for this node
            if state != DONE:
                # if not visiting yet
                if state == PENDING:
                    # check if current node is the target
                    if node == p or node == q:
                        if one_node_found:
                            # if one is already found then return the result
                            return stack[parent_index][0]
                        else:
                            # else update the parent index
                            one_node_found = True
                            parent_index = len(stack) - 1
                    # next visits the left child if not visited yet
                    child_node = node.left
                else:
                    # next visits the right child if the left is visited
                    child_node = node.right

                # update the state of the parent node
                stack[-1][1] -= 1
                # set the next node to visit
                if child_node:
                    stack.append([child_node, PENDING])
            else:
                # update the index if current one node is found
                if parent == len(stack) - 1:
                    parent -= 1
                # move to parent node
                stack.pop()

        return None
```
