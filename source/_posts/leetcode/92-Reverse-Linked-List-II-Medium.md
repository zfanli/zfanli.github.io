---
date: '2021-04-14T15:36:05.469Z'
excerpt: ''
tags:
  - Linked List
title: 92. Reverse Linked List II (Medium)
categories:
  - leetcode
---

暴力解法。啥也不多说，看看算法。

- 把 `LinkedList` 转换成 `List；`
- 交换 `left` 和 `right` 的值；
- 更新 `left` 和 `right` 指针；
- 重复过程直到 `left` 不再小于 `right`。

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseBetween(self, head: ListNode, left: int, right: int) -> ListNode:
        nodes = [head]
        while head.next:
            head = head.next
            nodes.append(head)
        while left < right:
            nodes[left - 1].val, nodes[right - 1].val = nodes[right - 1].val, nodes[left - 1].val
            left += 1
            right -= 1
        return nodes[0]
```
