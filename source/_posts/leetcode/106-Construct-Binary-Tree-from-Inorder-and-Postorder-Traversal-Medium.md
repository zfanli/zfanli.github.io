---
title: 106. Construct Binary Tree from Inorder and Postorder Traversal (Medium)
tags:
  - Array
  - Hash Table
  - Divide and Conquer
  - Tree
  - Binary Tree
date: '2021-08-16T09:43:17.725Z'
categories:
  - leetcode
---

你需要从一棵树的中序遍历数组和后序遍历数组中尝试重新构建出这棵二叉树。

要从树的遍历结果逆向还原这棵树，扁平的 1D 数组的信息量是不够的，但是如果有两个不同的遍历结果做参考，我们可以根据树的遍历过程进行逆向操作。

这道题是使用已知的中序遍历和后序遍历的结果来尝试逆向遍历树的过程。

<!-- more -->

## 思路 1，递归

已知给定的两组数据的排序方式是中序遍历和后序遍历。

- 中序遍历：左节点 -> 根节点 -> 右节点
- 后序遍历：左节点 -> 右节点 -> 根节点

在知道根节点的情况比较容易去构建一棵二叉树，所以我们以后序遍历的数据为基础进行树的构建。

但是后序遍历的数据无法告诉我们下一个节点是根节点的左节点还是右节点，这时我们需要到中序遍历的数据中进行检查，如果下一个节点在中序遍历中出现在根节点的左侧，则它是根节点的左节点，反之则是根节点的右节点。

递归过程中，一旦我们明确如何寻找根节点和其左右节点，重复这个过程我们就可以构建整棵树。我们给这个思路补充一些细节：

- 我们要依序检查中序遍历中每个值的下标，为了避免重复计算，我们将中序遍历的值和下标放到一张哈希表，方便下标查询；
- 根据后序遍历的特性，我们从后序遍历数据的末尾取出（`pop`）一个值，构建一个节点；
- 找到根节点的值在中序遍历中的下标位置 `middle`，这时我们得到两个区间 `[start, middle - 1]` 和 `[middle + 1, end]`：
  - `[middle + 1, end]`：这个区间构成根节点的右子树，如果存在，我们继续依序从后序遍历数据中取出（`pop`）下一个根节点的值，细分区间直到遍历完这个区间；
  - `[start, middle - 1]`：这个区间构成根节点的左子树，按照顺序，右节点遍历结束后，剩下的数据将构成左节点；
- 我们按照中序遍历数据的下标位置来判断是否还存在下一个节点，如果 `middle` 和起始位置或结束位置重合则相应的左节点和右节点不存在。

```python
class Solution:
    def buildTree(self, inorder: List[int], postorder: List[int]) -> Optional[TreeNode]:
        idx = {}

        # make a hash table to map each value with its index,
        # just for reducing the cost of the index searching
        for i in range(len(inorder)):
            idx[inorder[i]] = i

        def dfs(start, end):
            # fail case
            if start > end:
                return None
            # build root node
            node = TreeNode(postorder.pop())
            # find the middle point
            middle = idx[node.val]
            # build right subtree if exists
            node.right = dfs(middle + 1, end)
            # build left subtree if exists
            node.left = dfs(start, middle - 1)
            return node

        return dfs(0, len(inorder) - 1)
```

## 思路 2，递归，无哈希表

思路 1 使用一个哈希表做下标映射，实际上这个额外的空间使用存在优化的空间。

在思路 2 中我们使用 2 个指针来对当前的处理进行判断。这个方法和思路 1 还有一点不同，这次我们不再直接修改参数数组。

- 初始化 2 个指针，分别指向中序遍历和后序遍历最后一个值；
- 在递归过程中，首先拿到后序遍历当前指向的值构建根节点；
- 将后序遍历指针向前推进一个单位；
- 判断是否存在右子树：
  - 根据后序遍历的顺序，我们从后往前推进，构建根节点之后首先要判断是否存在右子树；
  - 根据中序遍历的顺序，如果我们判断中序遍历数据的当前位置不等于目前节点值，则表示存在右子树；
  - 如果存在右子树则进行递归调用，注意右子树在中序遍历中的边界是当前节点；
- 执行到这里表示右子树已经遍历完成，将中序遍历的指针向前推进一个单位；
- 判断是否存在左子树：
  - 判断左子树要考虑边界情况，在中序遍历中如果当前指向的值是父节点的值，则表示不存在左子树；
  - 当然如果不存在父节点时，不需要考虑边界直接尝试构建左子树；
  - 如果存在左子树则进行递归调用，注意左子树在中序遍历中的边界是父节点；
- 结束递归，返回当前根节点。

```python
class Solution:
    def buildTree(self, inorder: List[int], postorder: List[int]) -> Optional[TreeNode]:
        self.idx_in = len(inorder) - 1
        self.idx_post = len(postorder) - 1

        def dfs(parent):
            if self.idx_post < 0:
                return None

            root = TreeNode(postorder[self.idx_post])
            self.idx_post -= 1

            # current value of inorder != root
            # means the right subtree exists
            if inorder[self.idx_in] != root.val:
                root.right = dfs(root)

            self.idx_in -= 1
            # current value of inorder != parent
            # means the left subtree may exist
            if not parent or inorder[self.idx_in] != parent.val:
                root.left = dfs(parent)

            return root

        return dfs(None)
```

## 思路 3，迭代

递归的调用栈也是额外空间占用，想要进一步优化空间复杂度，可以考虑使用迭代方式构建二叉树。

迭代思路基本和思路 2 一致。

- 准备一个 Stack；
- 从后序遍历数据构建当前节点放入 Stack；
- 判断 Stack 顶部节点的值是否等于中序遍历当前的值；
  - 如果不等于，则表示存在右子树；
  - 这时重复迭代过程将后序遍历下一个值设定为 Stack 顶部节点的右子树，并将其放入 Stack；
  - 如果相等，右子树遍历完成，让 Stack 和中序遍历同时移动到下一个位置；
  - 继续进行上个操作，直到 Stack 顶部的节点不再等于中序遍历当前的值；
  - 将最后一个移出的值作为父节点；
  - 构建后续节点时，如果存在父节点，则当前节点应该设定为父节点的左子树；
- 将父节点重置，继续下一次迭代，直到所有值遍历结束。

核心在于根据中序遍历的数据位置，对后序遍历数据进行迭代：

- 当后序遍历的当前值不等于中序遍历的当前值：存在右子树；
- 当后续遍历的当前值等于中序遍历的当前值：后序遍历的下一个值是左子树的根节点。

```python
class Solution:
    def buildTree(self, inorder: List[int], postorder: List[int]) -> Optional[TreeNode]:
        root, parent = TreeNode(postorder.pop()), None
        stack = [root]

        while inorder:
            # skip visited nodes
            while stack and stack[-1].val == inorder[-1]:
                # set the last visited node as parent
                parent = stack.pop()
                # move on
                inorder.pop()

            # finish the process if no value left
            if not inorder:
                break

            # build current node
            curr = TreeNode(postorder.pop())

            # set current node as the left child if parent exists,
            # or set it as the right child of the top of the stack
            if parent:
                parent.left = curr
            else:
                stack[-1].right = curr

            stack.append(curr)
            parent = None

        return root
```

## 结论

时间复杂度上三个方法差异不大，空间复杂度上迭代方法使用的内存空间是最小的，其次是思路 2 的空间优化方法。

这道题的重点在于观察和理解中序遍历和后序遍历在实际运用中的差异，并利用这个差异还原二叉树。可见，虽然这两种遍历顺序从逻辑上很好理解，但是实际运用过程中，数据层级的嵌套，结构的平衡性都会提高实际计算的复杂度。
