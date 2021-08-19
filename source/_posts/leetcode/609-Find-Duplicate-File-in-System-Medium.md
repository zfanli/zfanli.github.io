---
date: '2021-06-05T15:36:05.530Z'
tags:
  - Array
  - Hash Table
  - String
title: 609. Find Duplicate File in System (Medium)
categories:
  - leetcode
---

寻找系统中的重复文件。你会得到下面结构的字符串数组，这表示在 `root/d1/d2/.../dm` 目录下存在 `n` 个文件，分别命名为 `f1, f2, ..., fn`，文件名后括号内为文件的内容。你需要找到所有内容重复的文件，并返回文件的路径。

> "root/d1/d2/.../dm f1.txt(f1_content) f2.txt(f2_content) ... fn.txt(fn_content)"

<!-- more -->

## 思路 1 使用哈希表

以文件内容为 key，拼出文件名存到字典中，最后遍历字典所有值，存在长度大于 1 的列表则表示存在内容重复。这道题还是比较亲切，实际工作中确实会遇到这类问题。

下面是代码例子。

> 其实做的粗糙一点，去掉 `c = c[:-1]` 这句也能实现，而且少一个字符串处理性能会更好。毕竟我们不在意文件内容实际是什么，只在意有没有重复。

```python
class Solution:
    def findDuplicate(self, paths: List[str]) -> List[List[str]]:
        table = defaultdict(list)
        for f in paths:
            f = f.split(" ")
            p = f[0]
            for i in f[1:]:
                fn, c = i.split("(")
                c = c[:-1]
                table[c].append(f"{p}/{fn}")
        ans = []
        for v in table.values():
            if len(v) > 1:
                ans.append(v)
        return ans
```

Java 例子。

```java
class Solution {
    public List<List<String>> findDuplicate(String[] paths) {
        Map<String, List<String>> table = new HashMap<>();
        for (String p : paths) {
            String[] f = p.split(" ");
            String pr = f[0];
            for (int i = 1; i < f.length; i++) {
                String[] file = f[i].split("\\(");
                if (!table.containsKey(file[1])) {
                    table.put(file[1], new ArrayList<String>());
                }
                table.get(file[1]).add(pr + "/" + file[0]);
            }
        }
        List<List<String>> ans = new ArrayList<>();
        for (List<String> val : table.values()) {
            if (val.size() > 1) {
                ans.add(val);
            }
        }
        return ans;
    }
}
```

JS 例子。

```js
/**
 * @param {string[]} paths
 * @return {string[][]}
 */
var findDuplicate = function (paths) {
  table = {};
  for (let p of paths) {
    p = p.split(' ');
    const pr = p[0];
    for (let i = 1; i < p.length; i++) {
      const file = p[i].split('(');
      if (!table[file[1]]) table[file[1]] = [];
      table[file[1]].push(pr + '/' + file[0]);
    }
  }
  const ans = [];
  for (let k in table) {
    if (table[k].length > 1) {
      ans.push(table[k]);
    }
  }
  return ans;
};
```
