---
title: 102. Binary Tree Level Order Traversal (Medium)
excerpt: |
  遍历树的方式除了通常的前序遍历、中序遍历和后序遍历之外，还有本题的层序遍历。层序遍历的顺序是从左到右依次遍历同层级到节点，然后在进入下一层级重复这个过程，直到不再存在下一层级。这是一个典型的宽度优先搜索（BFS）算法。
tags:
  - Tree
  - BFS
  - Binary Tree
categories:
  - leetcode
date: "2021-08-08T04:35:46.051Z"
---

遍历树的方式除了通常的前序遍历、中序遍历和后序遍历之外，还有本题的层序遍历。

层序遍历的顺序是从左到右依次遍历同层级到节点，然后在进入下一层级重复这个过程，直到不再存在下一层级。这是一个典型的宽度优先搜索（BFS）算法。

完成层序遍历，我们可以利于先进先出的队列来记录每一个层级的节点数。

具体过程如下：

- 将 root 放入队列，开始进入迭代；
- 每次迭代开始先取得队列的长度，这个长度表示当前层级的节点数；
- 循环依次取出所有当前层级的节点，将其子节点按照左右顺序放入队列，并将当前节点的值存入新的列表；
- 将列表放入答案列表，重复迭代直到队列清空。

需要注意的一点是，虽然我们在放入子节点的时候会进行存在判定，但是 root 本身也存在为空（None）的情况，下面代码中我们新建了一个 Dummy 节点来处理这个问题，将 root 作为 Dummy 节点的子节点，然后在放入子节点的过程中进行存在判定，这样就规避了 root 节点本身不存在的问题。

最终在返回结果时，将位于数组 0 位置的 Dummy 节点的值删除。

```python
class Solution:
    def levelOrder(self, root: TreeNode) -> List[List[int]]:
        ans, queue = [], [TreeNode(-1, root)]

        while len(queue) > 0:
            lst, n = [], len(queue)
            for _ in range(n):
                node = queue.pop(0)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
                lst.append(node.val)
            ans.append(lst)

        return ans[1:]
```

---

bk，旧思路，这个方法会额外创建 log n 个新数组，这个额外空间其实没有必要。

- 同级的元素全都放到一个数组；
- 按照顺序提取元素的值放到答案数组；
- 同时将存在的子节点放到新的数组；
- 重复这个过程直到不存在任何子节点；
- 此时答案数组已经编辑完成。

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def levelOrder(self, root: TreeNode) -> List[List[int]]:
        ans, lv = [], [root]
        while len(lv) != 0:
            _ans, _lv = [], []
            for n in lv:
                if n:
                    _ans.append(n.val)
                    _lv.append(n.left)
                    _lv.append(n.right)
            if len(_ans) > 0:
                ans.append(_ans)
            lv = _lv
        return ans
```
