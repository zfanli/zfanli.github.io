---
title: 2.Swift Syntax Basics (字符串和变量)
tags:
  - Swift
date: "2019-06-16T13:28:35.099Z"
---

参考官网的教程。

https://docs.swift.org/swift-book/GuidedTour/GuidedTour.html

教程提供一个 Xcode 的 playground，可以边看教程边修改代码，同时预览结果，体验不错。

> R：体验虽好，就是没有浏览器的字典插件可以用了，macOS 自带的词典也用不了，查词比较麻烦。

<!-- more -->

## "Hello, world!"

```swift
print("Hello, world!")
```

Swift 的语法看上去类似 C 和 Objective-C。对于 input/output 或者字符串处理来说，不需要 import 任何库。写在全局作用域的代码自动成为程序的入口，你不需要类似 `main()` 的函数。你也不需要给每行都写上一个分号。

## Simple Values

使用 `let` 声明一个常量，使用 `var` 声明一个变量。

> R：感觉和 JavaScript 有点冲突啊。JavaScript 中 `var`、`let` 都用来声明变量，`const` 用来声明常量。

```swift
var myVariable = 42
myVariable = 50
let myConstant = 42
```

变量类型根据指定的值推测。但是如果没有指派值，或者赋予的值不足以推测类型，则需要显示声明类型。

```swift
let implicitInteger = 70
let implicitDouble = 70.0
let explicitDouble: Double = 70
```

变量的值不会进行任何隐式的类型转换。如果你需要对数据进行类型转换，你必须手动来转换它。

```swift
let label = "The width is "
let width = 94
let widthLabel = label + String(width)
```

> R：手动移除掉 `String()` 转换方法后，将得到报错：`Binary operator '+' cannot be applied to operands of type 'String' and 'Int'`

模版字符串，带入变量的方式为反斜杠 `\` 加括号。

```swift
let apples = 3
let oranges = 5
let appleSummary = "I have \(apples) apples."
let fruitSummary = "I have \(apples + oranges) pieces of fruit."
```

使用三引号声明多行的文本。

```swift
let quotation = """
I said "I have \(apples) apples."
And then I said "I have \(apples + oranges) pieces of fruit."
"""
```

用中括号创建数组或字典，在中括号中写上 index 或者 key 来访问元素。最后一个元素也可以写逗号。

```swift
var shoppingList = ["catfish", "water", "tulips"]
shoppingList[1] = "bottle of water"

var occupations = [
    "Malcolm": "Captain",
    "Kaylee": "Mechanic",
 ]
occupations["Jayne"] = "Public Relations"
```

> R：“最后一个元素也可以写逗号”，和 JavaScript、JSON 挺像。

数组在添加元素时自动增长。

用下面初始化器语法创建一个空的数组或字典。

```swift
let emptyArray = [String]()
let emptyDictionary = [String: Float]()
```

当类型可以被推导时，可以省略类型声明。比如在给一个变量重新赋值时，或者传递一个参数给某个函数时。

```swift
shoppingList = []
occupations = [:]
```

> R：给变量重新赋值时，之前的值会作为类型推导的信息。传递一个参数给某个函数时，函数接收的参数类型是确定的。所以这两种情况可以省略类型声明。

# 相关

> 1.[Official Documentation - Introducing Swift 5](https://github.com/zfanli/notes/blob/master/swift/1.SwiftIntroduction.md)
>
> 3.[Swift Syntax Basics (流程控制)](<https://github.com/zfanli/notes/blob/master/swift/3.SyntaxBasics(FlowControl).md>)
