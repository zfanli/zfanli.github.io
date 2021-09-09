---
title: 9.Swift Syntax Basics (范型)
tags:
  - Swift
date: "2019-06-20T16:28:35.099Z"
---

泛型也是一个灵活而实用的机制（虽然 Java 系的泛型用的也不是很多）。教程用了很少的篇幅讲泛型，到这里我们也只能获得泛型大概的印象。其实和 Java 中的没两样。

另一个特色就是 `where` 关键字，这个和 SQL 的 where 很类似，可以给表达式或者方法加一层过滤器，对表达式来说只有满足 `where` 条件的才进行操作，对函数来说不满足 `where` 条件的参数会在编译时报错提示。

这是官方入门教程的最后一个篇章。到此我们对 Swift 的语法已经从头到尾进行了一次预览了。

<!-- more -->

## 泛型

定义泛型函数或者类型，在尖括号中写入泛型的名字。

```swift
func makeArray<Item>(repeating item: Item, numberOfTimes: Int) -> [Item] {
    var result = [Item]()
    for _ in 0..<numberOfTimes {
         result.append(item)
    }
    return result
}
makeArray(repeating: "knock", numberOfTimes: 4)
// ["knock", "knock", "knock", "knock"]
```

你可以把函数和方法变成泛型格式，同样的类、枚举类型、结构体也可以。

```swift
// Reimplement the Swift standard library's optional type
enum OptionalValue<Wrapped> {
    case none
    case some(Wrapped)
}
var possibleInteger: OptionalValue<Int> = .none
possibleInteger = .some(100)
```

使用 `where` 关键字，放在函数体前（大括号前面），来指定一系列的要求。比如要求实现一个协议、要求两个类型相同，或者要求类必须继承某一个父类。

```swift
func anyCommonElements<T: Sequence, U: Sequence>(_ lhs: T, _ rhs: U) -> Bool
    where T.Element: Equatable, T.Element == U.Element
{
    for lhsItem in lhs {
        for rhsItem in rhs {
            if lhsItem == rhsItem {
                return true
            }
        }
    }
   return false
}
anyCommonElements([1, 2, 3], [3])
```

`<T: Equatable>` 等同于 `<T> ... where T: Equatable`。

> R：这里的 `where` 相当于一个严格的类型检查，只有满足条件的参数调用该函数是合法的，否则编译时会报错提示。`where` 在其他写法中可以起到过滤的作用。

# 相关

> 8.[Swift Syntax Basics (错误处理)](<https://github.com/zfanli/notes/blob/master/swift/8.SyntaxBasics(ErrorHandling).md>)
>
> 10.[Swift Syntax Supplements](https://github.com/zfanli/notes/blob/master/swift/10.SyntaxSupplements.md)
