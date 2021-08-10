---
date: '2021-04-26T15:36:05.482Z'
tags:
  - DFS
  - Tree
title: 114. Flatten Binary Tree to Linked List (Medium)
categories:
  - leetcode
---

思路 1，有序递归。重复先左后右的递归，用递归方法实现 O(1)的难点在于将右节点挂在左节点的末尾，这里我们将递归函数的返回值设为递归最后一个元素，来解决这个难题。

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def flatten(self, root: TreeNode) -> None:
        """
        Do not return anything, modify root in-place instead.
        """
        if root is None:
            return root
        def _flatten(node):
            left, right = node.left, node.right
            if left:
                left = _flatten(left)
                left.right = node.right
                node.right = node.left
                node.left = None
            if right:
                right = _flatten(right)
            else:
                right = left
            return right if right else node

        _flatten(root)
```

思路 2，学习题解的思路。如果我们发现有左节点，找到左节点最下端的右节点，将 root 的右节点挂在上面，将左节点替换为 root 的右节点，重置 root 的左节点为空，root 节点向右进一位，检查左节点，如此往复，直到最后一个左节点消失，二分树转链表结束。

```python
class Solution:
    def flatten(self, root: TreeNode) -> None:
        """
        Do not return anything, modify root in-place instead.
        """
        while root:
            if root.left:
                left = root.left
                while left.right:
                    left = left.right
                left.right = root.right
                root.right = root.left
                root.left = None
            root = root.right
```

思路 3，和之前思路不同之处在于，这次我们从下而上的去将二叉树转化为链表，转化的顺序是 right -> left -> node，因为我们需要先 node，再 left，再 right 的顺序去组成这个链表。我们用递归来帮助完成这个过程，使用一个全局变量 `head` 来储存当前处理的节点，因为我们已经确保有序递归，所以 `head` 将从空（链表最后一个节点的子节点）开始，每次指向上一个节点，直到达到 `root` 节点。

```python
class Solution:
    def flatten(self, root: TreeNode) -> None:
        """
        Do not return anything, modify root in-place instead.
        """
        self.head = None

        def f(node):
            if node.right:
                f(node.right)
            if node.left:
                f(node.left)
            node.left, node.right, self.head = None, self.head, node

        if root:
            f(root)
```

相同思路的 Java 代码。

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    private TreeNode head = null;
    public void flatten(TreeNode root) {
        if (root != null) f(root);
    }
    private void f(TreeNode node) {
        if (node.right != null) f(node.right);
        if (node.left != null) f(node.left);
        node.left = null; node.right = head; head = node;
    }
}
```

JS 代码。

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {void} Do not return anything, modify root in-place instead.
 */
var flatten = function (root) {
  let head = null;
  const f = (node) => {
    if (node.right) f(node.right);
    if (node.left) f(node.left);
    (node.left = null), (node.right = head), (head = node);
  };
  if (root) f(root);
};
```
