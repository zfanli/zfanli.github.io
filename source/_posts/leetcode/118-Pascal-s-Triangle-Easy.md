---
date: "2021-04-28T15:36:05.484Z"

tags:
  - Array
title: 118. Pascal's Triangle (Easy)
---

杨辉三角，做完这题发现，这就是 DP 呀，简明扼要。思路就是用当前行计算下一行，每一个值都等于上一行相同位置加上前一位，注意首位两个特殊 case 即可。

```python
class Solution:
    def generate(self, numRows: int) -> List[List[int]]:
        ans = [[1]]
        for n in range(1, numRows):
            curr, nxt = ans[-1], []
            for i in range(n + 1):
                if i - 1 < 0 or i == n:
                    nxt.append(1)
                else:
                    nxt.append(curr[i - 1] + curr[i])
            ans.append(nxt)
        return ans
```
