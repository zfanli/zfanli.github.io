---
title: 105. Construct Binary Tree from Preorder and Inorder Traversal (Medium)
tags:
  - Array
  - Hash Table
  - Divide and Conquer
  - Tree
  - Binary Tree
date: '2021-08-18T09:05:26.952Z'
categories:
  - leetcode
---

No.116 的镜像问题。你需要从一棵树的`前序遍历`数据和`中序遍历`数据中尝试重新构建出这棵二叉树。

之前我们尝试基于`中序遍历`和`后序遍历`的数据来还原这棵树，这次是`前序遍历`和`中序遍历`。

其中区别在于遍历结果中根节点是在开始还是在结束，我们可以应用相同的思路来解决这道题，注意处理顺序的细微差别。

<!-- more -->

## 思路 1，递归 + 哈希表

同样的思路，我们基于前序遍历的数据构建树，用中序遍历的数据确认节点的位置关系。

- `前序遍历`：根节点、左节点、右节点
- `中序遍历`：左节点、根节点、右节点

将构建树的问题分解为在知道根节点的情况下判断它是否有左右节点的问题。

```python
class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> TreeNode:
        inordermap = {}
        for i in range(len(inorder)):
            inordermap[inorder[i]] = i

        def dfs(start, end):
            if start > end:
                return None
            node = TreeNode(preorder.pop(0))
            middle = inordermap[node.val]
            node.left = dfs(start, middle - 1)
            node.right = dfs(middle + 1, end)
            return node

        return dfs(0, len(inorder) - 1)
```

## 思路 2，递归，无哈希表

我们可以采取遍历检查的方法，用元素的相对位置来做到思路 1 的判断。

在思路 1 中，实际起作用的关键代码是 `if start > end:`，如果下一个节点的值落在这个区间之内则表示其为左节点 or 右节点。

但实际上我们不关注这个值具体是什么，来换个角度考虑一下：

- 我们先从前序遍历结果中取出第一个值，构建一个节点；
- 接着我们需要判断前序遍历结果第二个值是否是第一个值的左节点；
  - 将前序遍历第二个值与中序遍历的第一个值对比；
  - 如果两个值不相等，由于中序遍历先左节点在根节点的顺序，据此可以判断出存在左节点；
  - 而如果两个值相等，那么也就没有左节点存在的空间；
  - 对于存在左节点的情况，我们继续重复这个递归过程；
- 这时已经判断完左节点；
- 我们要额外的信息来判断右节点是否存在；
  - 我们从左到右对中序遍历进行递归遍历；
  - 要知道有没有右节点，首先我们要知道检查到哪个位置为止；
  - 这个位置即边界，要确定这个边界，首先要确定当前有没有父节点；
  - 如果当前没有父节点，这是树的根节点，尝试构建右节点；
  - 如果存在父节点，判断父节点的值是否和前序遍历下一个值相等；
  - 如果相等，我们已到达边界，不存在任何右节点；
  - 如果不相等，还未到达边界，尝试构建右节点；
  - 这里还有一个重要的细节，如果决定父节点？
    - 首先递归入口有两处：构建左节点和构建右节点时；
    - 构建左节点时：中序遍历当前节点往左都是其左节点，所以当前节点是边界；
    - 构建右节点时：中序遍历当前节点到父节点为止的区间是右节点，所以父节点是边界；
- 这时遍历完了右节点，当前节点遍历结束；
- 返回当前节点。

```python
class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> TreeNode:
        self.indexpre = self.indexin = 0

        def dfs(parent):
            if self.indexin == len(inorder):
                return None

            node = TreeNode(preorder[self.indexpre])
            self.indexpre += 1

            # if current pre value != current in value,
            # the left child exists
            if node.val != inorder[self.indexin]:
                node.left = dfs(node)

            self.indexin += 1
            # we've come to the right side,
            # if there're more nodes exist before the parent node,
            # the right child exists
            if not parent or parent.val != inorder[self.indexin]:
                node.right = dfs(parent)

            return node

        return dfs(None)
```

## 思路 3，迭代

思路 2 可以从递归逻辑转化成迭代逻辑，由于同样逻辑递归算法存在调用栈，算上其使用的额外空间后，对内存空间的使用要高于迭代算法，所以对递归算法的优化可以考虑能否将其转化为迭代算法。

和递归方法不同，在迭代版本中我们使用一个 Stack 来管理当前处理的节点。使用 Stack 的目的是管理当前还未遍历完的节点，这一步相当于将递归过程扁平化了。我们在便利根节点的做节点时，发现左节点有自己的左节点，所以我们将其放入栈中，先处理左节点自己的左节点，然后将其丢出栈，继续往后处理。

```python
class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> TreeNode:
        indexpre, indexin = 1, 0
        root = TreeNode(preorder[0])
        stack, parent = [root], None

        while stack:
            while stack and stack[-1].val == inorder[indexin]:
                parent = stack.pop()
                indexin += 1

            if indexin == len(inorder):
                break

            node = TreeNode(preorder[indexpre])
            indexpre += 1

            if parent:
                parent.right = node
            elif stack:
                stack[-1].left = node

            stack.append(node)
            parent = None

        return root
```
