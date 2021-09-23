---
title: 11.Swift Basic Operators
tags:
  - Swift
date: "2019-06-26T13:28:35.099Z"
---

操作符的定义：一个特殊符号或者语句用来检查、改变或者组合值。

Swift 支持大部分 C 的操作符，并且做了一些改善以避免一些共通的问题。

<!-- more -->

## 基本操作符

### 术语

操作符分为一元、二元和三元操作符：

- 一元操作符只操作一个对象，例如 `-a`，`b!`。
- 二元操作符操作两个对象，位于中间的位置，例如 `2 + 3`。
- 三元操作符操作三个对象，Swift 只有一个三元操作符，即三元表达式 `a ? b : c`。

### 赋值操作符

赋值操作，不需要额外解释了。要注意的是不同于 C 和 Objective-C，Swift 的赋值操作不会有返回值。

另外，如果右边是元组类型的数据，赋值操作可以进行解构赋值。

```swift
let (x, y) = (1, 2)
// x is equal to 1, and y is equal to 2
```

### 运算操作符

加减乘除。这部分有用的信息可能就是加减乘除的英文说法了把...

- Addition (+)
- Subtraction (-)
- Multiplication (\*)
- Division (/)

外加一个取余数操作符 `%`。

### 比较操作符

并无两样。学学英文把。

- Equal to (a == b)
- Not equal to (a != b)
- Greater than (a > b)
- Less than (a < b)
- Greater than or equal to (a >= b)
- Less than or equal to (a <= b)

特殊一点的是 Swift 还提供 `===` 和 `!==` 用来检查两个对象是否引用同一个对象实例。这个和 JavaScript 比较像。

比较操作符都将返回布尔值。比较操作符可以对元组进行比较，但是要求数据类型和元素数量相同，比较时遵从从左到右的顺序，一次比较一对值，直到比较出不符合条件的值为止，或者到最后都满足条件则返回 `true`。

```swift
(1, "zebra") < (2, "apple")   // true because 1 is less than 2; "zebra" and "apple" are not compared
(3, "apple") < (3, "bird")    // true because 3 is equal to 3, and "apple" is less than "bird"
(4, "dog") == (4, "dog")      // true because 4 is equal to 4, and "dog" is equal to "dog"
```

三元表达式就没啥好说的了，用法都一样。

### Nil-Coalescing 运算符

不好确定怎么翻译，字面意思是 Nil 联合运算符。看上去这个是三元运算符针对 Nil 的场合演化的简化版本，语法糖。

```swift
let defaultColorName = "red"
var userDefinedColorName: String?   // defaults to nil

var colorNameToUse = userDefinedColorName ?? defaultColorName
// userDefinedColorName is nil, so colorNameToUse is set to the default of "red"
```

### 范围操作符

范围操作符是 Swift 的特殊，至少我在 Java 和 JavaScript 中没有见过。Python 中好像是有的？

### 闭合范围操作符

指定一个范围，包括左右的值。`a...b`， a 的值需要小于 b。在 for-in 循环中非常有用。

```swift
for index in 1...5 {
    print("\(index) times 5 is \(index * 5)")
}
// 1 times 5 is 5
// 2 times 5 is 10
// 3 times 5 is 15
// 4 times 5 is 20
// 5 times 5 is 25
```

### 半开放范围操作符

指定一个范围但是不包括右边的值。

```swift
let names = ["Anna", "Alex", "Brian", "Jack"]
let count = names.count
for i in 0..<count {
    print("Person \(i + 1) is called \(names[i])")
}
// Person 1 is called Anna
// Person 2 is called Alex
// Person 3 is called Brian
// Person 4 is called Jack
```

### 单边范围操作符

闭合范围操作符的另一个形式。用来指定从某个值到最后，或者从开始到某个值的范围。

```swift
for name in names[2...] {
    print(name)
}
// Brian
// Jack

for name in names[...2] {
    print(name)
}
// Anna
// Alex
// Brian
```

半开放范围操作符也可以写成单边范围形式。

```swift
for name in names[..<2] {
    print(name)
}
// Anna
// Alex
```

### 逻辑操作符

- Logical NOT (!a)
- Logical AND (a && b)
- Logical OR (a || b)

可以添加括号增强逻辑判断表达式的可读性，这些括号实际上是不需要的。

```swift
if (enteredDoorCode && passedRetinaScan) || hasDoorKey || knowsOverridePassword {
    print("Welcome!")
} else {
    print("ACCESS DENIED")
}
// Prints "Welcome!"
```

# 相关

> 10.[Swift Syntax Supplements](https://github.com/zfanli/notes/blob/master/swift/10.SyntaxSupplements.md)
>
> 12.[Swift Strings and Characters](https://github.com/zfanli/notes/blob/master/swift/12.StringsAndCharacters.md)
