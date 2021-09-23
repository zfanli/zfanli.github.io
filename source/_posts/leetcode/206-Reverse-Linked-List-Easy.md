---
title: 206. Reverse Linked List (Easy)
tags:
  - LinkedList
  - Recursion
date: '2021-09-14T04:28:53.266Z'
categories:
  - leetcode
---

给定一个链表（LinkedList）的 `head` 节点，你需要反转并返回它。

<!-- more -->

## 迭代思路

翻转链表只需要将每一个节点的 `next` 与该节点的关系颠倒一下即可，为此我们需要 `prev` 和 `next` 变量帮助我们保存中间的值。

```python
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev = next = None

        while head:
            # hold the next one, and reassign the prev one as current node's next
            next, head.next = head.next, prev
            # hold the current node as the prev and the next as current
            prev, head = head, next

        # the loop above ends with None as the head so the prev is the tail node
        return prev
```

实际上上面的 `next` 也可以消除掉，只需要 `prev` 一个变量即可。

```python
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev = None

        while head:
            head.next, prev, head = prev, head, head.next

        return prev
```

## 递归思路

这道题的迭代思路比较简单，所以完全没有必要考虑递归方法。但是如果你就想写递归，也没人能拉住你。

```python
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:

        def recu(node, prev):
            if not node:
                return prev
            node.next, prev = prev, node.next
            return recu(prev, node)

        return recu(head, None)
```
