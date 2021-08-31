---
title: 297. Serialize and Deserialize Binary Tree (Hard)
tags:
  - String
  - Tree
  - DFS
  - BFS
  - Binary Tree
  - Design
date: '2021-08-30T16:02:16.066Z'
---

你需要设计一个序列化：将二叉树转换为字符串 / 反序列化：将字符串还原成二叉树的算法。题目对于序列化的格式没有限制，你只需要设计一个算法可以把二叉树序列化，然后反序列化构建出原本的二叉树即可。

<!-- more -->

## 思路 1，DFS

序列化过程中我们需要保留空元素，这样能保证每一个节点都存在 2 个子节点。有了这个前提，我们只需要前序遍历二叉树，将遍历的值依次拼接成字符串即可完成序列化。

> 如果遍历结果不包括空元素，我们就无法仅从前序遍历的结果中重构一棵二叉树，因为 root 节点之后的值可能是左节点，也可能是右节点。但如果空节点也作为对象输出到序列化的结构，那么至少保证了每个节点都有 2 个子节点被记录，这意味着反序列化时遇到 root 节点的下一个节点一定是左节点，就算它是空。

```python
class Codec:

    def serialize(self, root):
        """Encodes a tree to a single string.

        :type root: TreeNode
        :rtype: str
        """
        res = []
        def dfs(node):
            nonlocal res
            if not node:
                res.append("")
            else:
                res.append(str(node.val))
                dfs(node.left)
                dfs(node.right)
        dfs(root)
        return ",".join(res)


    def deserialize(self, data):
        """Decodes your encoded data to tree.

        :type data: str
        :rtype: TreeNode
        """
        data = data.split(",")
        def dfs(data):
            val = data.pop(0)
            if val == "":
                return None
            node = TreeNode(int(val))
            node.left = dfs(data)
            node.right = dfs(data)
            return node
        return dfs(data)
```

## 思路 2，BFS

BFS 的方法更加直观，我们首先层序遍历，将包括空节点在内的所有值都序列化。

反序列化的过程中，我们按照顺序一层一层恢复这棵二叉树。规则在于维护一个指针和一个队列，从队列中取出元素，并移动指针读取后两位，作为这个节点左右子节点，然后将非空的子节点放入队列。重复这个过程直到结束。

```python
class Codec:

    def serialize(self, root):
        """Encodes a tree to a single string.

        :type root: TreeNode
        :rtype: str
        """
        if not root:
            return ""
        res, queue = [], deque([root])
        while queue:
            node = queue.popleft()
            if not node:
                res.append("")
            else:
                res.append(str(node.val))
                queue.append(node.left)
                queue.append(node.right)
        return ",".join(res)


    def deserialize(self, data):
        """Decodes your encoded data to tree.

        :type data: str
        :rtype: TreeNode
        """
        if not data:
            return None
        data = data.split(",")
        root = TreeNode(int(data[0]))
        queue, index = deque([root]), 1
        while queue:
            node = queue.popleft()
            if data[index] != "":
                node.left = TreeNode(int(data[index]))
                queue.append(node.left)
            index += 1
            if data[index] != "":
                node.right = TreeNode(int(data[index]))
                queue.append(node.right)
            index += 1
        return root
```
