---
date: '2021-03-19T15:36:05.444Z'
tags:
  - Linked List
  - Two Pointers
title: 19. Remove Nth Node From End of List (Medium)
---

删除链表的指定节点，返回修改后的链表 `head`。

> Given the `head` of a linked list, remove the `nth` node from the **end of the list** and return its `head`.
>
> **Follow up**: Could you do this in one pass?

<!-- more -->

With solutions both in Java and Python.

移除一个 linked list 末尾第 n 个节点，返回这个 linked list 的 head。最好是 One-pass 算法， 即一个流程里面获得想要的结果。

Example 1:

```
Input: head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]
```

Example 2:

```
Input: head = [1], n = 1
Output: []
```

Example 3:

```
Input: head = [1,2], n = 1
Output: [1]
```

Constraints:

- The number of nodes in the list is `sz`.
- 1 <= `sz` <= 30
- 0 <= `Node.val` <= 100
- 1 <= `n` <= `sz`

## 思路 & Solutions

最简单的方法是先遍历一遍 Linked list 获得列表长度，然后重新遍历一次，在 `L - n - 1` 处停下，删掉下一个节点。

但是这样就不算 One-pass 算法了。

为了达成 One-pass 算法，我们可以维护 2 个指针。

- 用 2 个指针，first 指向底部，一直遍历到最后；
- second 指向需要删除的节点的上一个节点，与 first 维持 `n + 1` 的距离。

为了避免处理例子 2 中的那种删除唯一节点的情况，我们初始化一个 dummy 节点，从这里开始遍历。

下面是 Python 代码。

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def removeNthFromEnd(self, head: ListNode, n: int) -> ListNode:
        dummy = first = second = ListNode()
        dummy.next = head
        dis = 1

        while first.next is not None:
            first = first.next
            # 注意由于second指向需要删除的节点的上一个节点，所以需要与first保持n+1的距离
            if dis != n + 1:
                dis += 1
            else:
                second = second.next

        second.next = second.next.next
        return dummy.next
```

下面是相同逻辑的 Java 代码。

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
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode();
        ListNode first = dummy;
        ListNode second = dummy;
        dummy.next = head;

        int dis = 1;

        while (first.next != null) {
            first = first.next;
            // 注意由于second指向需要删除的节点的上一个节点，所以需要与first保持n+1的距离
            if (dis != n + 1) {
                dis++;
            } else {
                second = second.next;
            }
        }

        second.next = second.next.next;
        return dummy.next;
    }
}
```
