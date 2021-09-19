---
date: '2021-04-12T15:36:05.466Z'
tags:
  - Linked List
  - Two Pointers
title: 86. Partition List (Medium)
---

链表问题。链表分区，给你一个链表和整数 `x`，你需要在保证相对顺序的情况下，将小于 `x` 的值排在链表前面，大于等于 `x` 的值排在后面。

> Given the `head` of a linked list and a value `x`, partition it such that all nodes less than `x` come before nodes greater than or equal to `x`.
>
> You should **preserve** the original relative order of the nodes in each of the two partitions.

<!-- more -->

With solutions both in Python and Java.

已知参数为一个 linked list 和 x，需要将数组根据 x 的值分区，小于它的放在前面，大于等于它的放在后面，并且分区后要保证原有顺序不变。

从下面例子可以看出来，我们可以把数组拆成一个前一个后，保持元素相对顺序，然后拼接起来。

Example 1:

```console
Input: head = [1,4,3,2,5,2], x = 3
Output: [1,2,2,4,3,5]
```

Example 2:

```console
Input: head = [2,1], x = 2
Output: [1,2]
```

## Submissions

我的代码时间复杂度还能看，空间复杂度已经脱离排名，没法看了。

虽然解题思路和官方一样，但是处理上有些愚蠢，这题就不贴我的结果了。

## 思路 & Solutions

思路很简单，这道题主要考察的是对空间复杂度对处理。逻辑的流程如下。

- 准备一个 before 列表存储值小于 x 的元素
- 准备一个 after 列表存储值不小于 x 的元素
- 将两个列表连接起来作为结果

逻辑很简单，但是 linked list 的接口如下。

```python
# Definition for singly-linked list.
 class ListNode:
     def __init__(self, val=0, next=None):
         self.val = val
         self.next = next
```

程序拿到的参数是这个 linked list 的第一个元素，这是一个逻辑上的列表，我们只能向下遍历，无法从下节点反推出上一个节点的值。

要准备 before 和 after 列表我们首先要知道从哪里开始，以及如何开始。

- 我们可以不初始化 before 和 after，等到遇到合适的值的时候再去给其赋值；
- 也可以初始化为当前的节点，再根据与 x 比较的结果来调整赋值；这两个思路我都尝试了。
- 官解的处理是，将 before 和 after 初始化为两个伪节点，规避了初始化问题（是我没想到的思路）。

看一下 Python 代码理解一下这个处理。

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def partition(self, head: ListNode, x: int) -> ListNode:
        bef = bf_head = ListNode(0)
        aft = af_head = ListNode(0)

        while head is not None:
            if head.val < x:
                bef.next = head
                bef = head
            else:
                aft.next = head
                aft = head
            head = head.next

        aft.next = None
        bef.next = af_head.next

        return bf_head.next

```

Java 代码逻辑一样。

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
    public ListNode partition(ListNode head, int x) {
        ListNode before = new ListNode();
        ListNode after = new ListNode();
        ListNode bfHead = before;
        ListNode afHead = after;

        while (head != null) {
            if (head.val < x) {
                before.next = head;
                before = head;
            } else {
                after.next = head;
                after = head;
            }
            head = head.next;
        }

        after.next = null;
        before.next = afHead.next;

        return bfHead.next;
    }
}
```

## 结论

进行伪初始化的处理很好的规避了初始化判断，对遍历的处理也只是改变了列表的排序，两者使得程序在时间和空间复杂度上有很好的表现。

- 时间复杂度：O(n)，做了一次遍历；
- 空间复杂度：O(1)，只做了列表重组，没使用额外空间。
