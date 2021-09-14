---
date: '2021-04-24T15:36:05.479Z'
tags:
  - Linked List
  - Divider and Conquer
  - DFS
  - Tree
  - Binary Search Tree
  - Binary Tree
title: 109. Convert Sorted List to Binary Search Tree (Medium)
categories:
  - leetcode
---

你有一个链表的 `head` 元素，链表数组按照升序排列，现在你需要实现一个程序将其转换为高度平衡的二叉查找树。

对这道题来说，高度平衡的二叉树定义为所有节点的子节点深度相差不大于 1。

题目的难点在于你不知道链表的长度。我们从几个思路讨论如何解决这道题。

<!-- more -->

## 思路 1，快慢指针

比较简洁的解法是快慢指针。

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
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
    public TreeNode sortedListToBST(ListNode head) {
        return tree(head, null);
    }

    private TreeNode tree(ListNode b, ListNode e) {
        if (b == e) return null;
        ListNode fast = b;
        ListNode slow = b;
        while (fast.next != e && fast.next.next != e) {
            fast = fast.next.next;
            slow = slow.next;
        }
        TreeNode root = new TreeNode(slow.val);
        root.left = tree(b, slow);
        root.right = tree(slow.next, e);
        return root;
    }
}
```

Python 强行和官方答案匹配。

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def sortedListToBST(self, head: ListNode) -> TreeNode:

        def tree(head, end):
            if head == end:
                return None

            fast = slow = head

            while fast.next != end:
                fast, slow = fast.next, slow.next
                if fast.next != end:
                    fast = fast.next

            root = TreeNode(slow.val)
            root.left = tree(head, slow)
            root.right = tree(slow.next, end)
            return root

        return tree(head, None)
```

## 思路 2， 长度二分

下面是基于长度二分。

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def sortedListToBST(self, head: ListNode) -> TreeNode:
        self.head, n = head, 0
        while head:
            head = head.next
            n += 1

        def dfs(b, e):
            if b >= e:
                return None
            m = b + e >> 1
            left = dfs(b, m)
            root = TreeNode(self.head.val, left)
            self.head = self.head.next
            root.right = dfs(m + 1, e)
            return root

        return dfs(0, n)
```
