---
title: 8.Swift Syntax Basics (错误处理)
tags:
  - Swift
date: "2019-06-20T15:28:35.099Z"
---

仔细一看，Swift 的错误处理比较 Java 系来看更加细致。在 do-cathc 块中必须要用 `try` 关键字指定哪一个函数调用会抛错误。其他也并无两样。

对于 Error 类型对象的定义，只要实现了 `Error` 协议就行。其他随意。

不同之处在于 `try?` 语法，快速处理一个不用关注错误的场景，这种情况一般只需要知道是否有错误，有就作为 `nil` 处理，错误类型本身不需要关注。

另外还有一个 `defer` 语法可以在代码执行结束即将返回的时候做一些特殊的操作，比如初始化或者清洁操作。看上去挺像 Java 系的 finial 块，但是作用不限于 try-catch 的结束，而是整个函数的结束。

<!-- more -->

## 错误处理

一个错误对象可以是实现（Adopt） `Error` 协议的任何类型。

```swift
enum PrinterError: Error {
    case outOfPaper
    case noToner
    case onFire
}
```

用 `throw` 抛出一个错误，用 `throws` 标记一个函数可能抛出错误。如果你在函数中抛出错误，函数会立刻返回，调用者要进行错误处理。

```swift
func send(job: Int, toPrinter printerName: String) throws -> String {
    if printerName == "Never Has Toner" {
        throw PrinterError.noToner
    }
    return "Job sent"
}
```

错误处理有几种方式。其中之一是使用 do-catch。在可能抛错误的操作前标记 `try` 关键字。在 catch 中错误会被自动命名为 `error`，你也可以给其定义一个别的名称。

```swift
do {
    let printerResponse = try send(job: 1040, toPrinter: "Bi Sheng")
    print(printerResponse)
} catch {
    print(error)
}
```

可以用多个 catch 处理不同的错误。在 case 后面接匹配模式，写法与 switch 的 case 匹配相同。

```swift
do {
    let printerResponse = try send(job: 1440, toPrinter: "Gutenberg")
    print(printerResponse)
} catch PrinterError.onFire {
    print("I'll just put this over here, with the rest of the fire.")
} catch let printerError as PrinterError {
    print("Printer error: \(printerError).")
} catch {
    print(error)
}
```

第二种方式是使用 `try?` 将表达式结果标记为可选。如果函数抛出错误，错误会被抛弃，表达式的结果会是 `nil`。相反会返回函数执行的结果。

```swift
let printerSuccess = try? send(job: 1884, toPrinter: "Mergenthaler")
let printerFailure = try? send(job: 1885, toPrinter: "Never Has Toner")
```

使用 `defer` 让一块代码在函数的其他代码执行完毕后、函数返回前执行。并且无论函数是否抛出错误，代码都会执行。你可以使用 `defer` 做一些设置或者清洁工作，虽然他们可能需要执行不同次数。

```swift
var fridgeIsOpen = false
let fridgeContent = ["milk", "eggs", "leftovers"]

func fridgeContains(_ food: String) -> Bool {
    fridgeIsOpen = true
    defer {
        fridgeIsOpen = false
    }

    let result = fridgeContent.contains(food)
    return result
}
fridgeContains("banana")
// false
print(fridgeIsOpen)
// prints false
```

# 相关

> 7.[Swift Syntax Basics (枚举类型和结构体)](<https://github.com/zfanli/notes/blob/master/swift/7.SyntaxBasics(Protocols&Extensions).md>)
>
> 9.[Swift Syntax Basics (泛型)](<https://github.com/zfanli/notes/blob/master/swift/9.SyntaxBasics(Generics).md>)
