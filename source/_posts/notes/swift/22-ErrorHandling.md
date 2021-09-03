---
title: 22.Swift Error Handling
tags:
  - Swift
date: '2019-07-04T14:28:35.099Z'
categories:
  - notes
  - swift
---

这部分内容还是复习。对于错误处理可以抛出可以处理。对于抛出介绍了 `guard` 和 `throw`，处理介绍了 do-catch、`try?` 和 `try!` 方法。

`defer` 方法可以保证无论代码什么时候离开当前作用域，都将执行一段清洁操作。

<!-- more -->

## Error 处理

不再赘述为什么要 Error 处理了。官方文档很明显是面对第一次学习编程语言的人的，用了三到四大段话描述为什么要 Error 处理...( ꒪Д꒪)

在 Swift 中定义一个 Error 类型只需要实现 Error 协议，这个协议是空的，只是一个身份象征。Swift 的枚举类型可以很合适的创建一个 Error 类型，他可以根据 Error 条件设计，并且可以附带关联值，可以方便的交流。下面是一个例子。

```swift
enum VendingMachineError: Error {
    case invalidSelection
    case insufficientFunds(coinsNeeded: Int)
    case outOfStock
}
```

当检查条件失败，使用 `throw` 抛出一个 Error。下面展示了如何抛出一个 Error，并且附带关联值，表示这个 Error 的原因是缺失 5 个硬币。

```swift
throw VendingMachineError.insufficientFunds(coinsNeeded: 5)
```

### 使用抛出函数传播 Error

为了指出一个函数、方法或初始化器可能会抛出 Error，你需要在定义它们的时候在参数后加上 `throws` 关键字。一个函数被标记了 `throws`，那么它就是一个抛出函数。

```swift
func canThrowErrors() throws -> String

func cannotThrowErrors() -> String
```

抛出函数可以将发生在其内部的 Error 向上抛给调用它的作用域。

> R：Error 的传播只能经由抛出函数向调用方抛出传播，如果 Error 发生在一个非抛出函数内，那么它必须在自己内部处理 Error。

下面的例子中，VendingMachine 类有一个 `vend(itemNamed:)` 方法，在所选商品售罄或超过余额时会抛出 VendingMachineError Error。

```swift
struct Item {
    var price: Int
    var count: Int
}

class VendingMachine {
    var inventory = [
        "Candy Bar": Item(price: 12, count: 7),
        "Chips": Item(price: 10, count: 4),
        "Pretzels": Item(price: 7, count: 11)
    ]
    var coinsDeposited = 0

    func vend(itemNamed name: String) throws {
        guard let item = inventory[name] else {
            throw VendingMachineError.invalidSelection
        }

        guard item.count > 0 else {
            throw VendingMachineError.outOfStock
        }

        guard item.price <= coinsDeposited else {
            throw VendingMachineError.insufficientFunds(coinsNeeded: item.price - coinsDeposited)
        }

        coinsDeposited -= item.price

        var newItem = item
        newItem.count -= 1
        inventory[name] = newItem

        print("Dispensing \(name)")
    }
}
```

`vend(itemNamed:)` 使用 `guard` 语句保证在任何一个要求不符合的情况下退出方法并抛出恰当的 Error。由于 `throw` 立刻转移程序控制，所以商品只会在满足全部条件的情况下被售出。

`vend(itemNamed:)` 方法通过抛出的方式将 Error 传播出去了，所以调用它的地方必须采取两种措施。

- 采用 do-catch，或者 `try?`、`try!` 的方式处理掉 Error；
- 或者继续传播 Error 到上一层。

例如下面的例子中，`buyFavoriteSnack(person:vendingMachine:)` 方法将 Error 继续向上传播。

```swift
let favoriteSnacks = [
    "Alice": "Chips",
    "Bob": "Licorice",
    "Eve": "Pretzels",
]
func buyFavoriteSnack(person: String, vendingMachine: VendingMachine) throws {
    let snackName = favoriteSnacks[person] ?? "Candy Bar"
    try vendingMachine.vend(itemNamed: snackName)
}
```

下面展示用初始化器抛出 Error，初始化器调用了一个可能抛出 Error 的方法，如果出现 Error，会自动向上抛出。

```swift
struct PurchasedSnack {
    let name: String
    init(name: String, vendingMachine: VendingMachine) throws {
        try vendingMachine.vend(itemNamed: name)
        self.name = name
    }
}
```

### 使用 do-catch 处理 Error

do-catch 语法的构成如下。

```swift
do {
    try expression
    statements
} catch pattern 1 {
    statements
} catch pattern 2 where condition {
    statements
} catch {
    statements
}
```

用 do-catch 处理 Error。

```swift
var vendingMachine = VendingMachine()
vendingMachine.coinsDeposited = 8
do {
    try buyFavoriteSnack(person: "Alice", vendingMachine: vendingMachine)
    print("Success! Yum.")
} catch VendingMachineError.invalidSelection {
    print("Invalid Selection.")
} catch VendingMachineError.outOfStock {
    print("Out of Stock.")
} catch VendingMachineError.insufficientFunds(let coinsNeeded) {
    print("Insufficient funds. Please insert an additional \(coinsNeeded) coins.")
} catch {
    print("Unexpected error: \(error).")
}
// Prints "Insufficient funds. Please insert an additional 2 coins."
```

do-catch 并不是必须处理所有的 Error，如果 do-catch 没有处理到的 Error 发生了，使用 `throws` 关键字标记函数可以将其向上传播。但是这个 Error 需要在上级的某个作用域中被处理掉，否则你会得到一个运行时报错。

```swift
func nourish(with item: String) throws {
    do {
        try vendingMachine.vend(itemNamed: item)
    } catch is VendingMachineError {
        print("Invalid selection, out of stock, or not enough money.")
    }
}

do {
    try nourish(with: "Beet-Flavored Chips")
} catch {
    print("Unexpected non-vending-machine-related error: \(error)")
}
// Prints "Invalid selection, out of stock, or not enough money."
```

### 将 Error 转化为可选值

使用 `try?` 将可能报错函数转化为一个可选型的值。如果报错，则变量赋值为 `nil`，否则赋值为函数返回值。下面的例子中，x 和 y 有相同的结果。

```swift
func someThrowingFunction() throws -> Int {
    // ...
}

let x = try? someThrowingFunction()

let y: Int?
do {
    y = try someThrowingFunction()
} catch {
    y = nil
}
```

`try?` 可以让你用更简洁的方式处理 Error。下面的例子中，使用两种方式获取数据，每一种成功则退出函数，全都失败则返回 `nil`。

```swift
func fetchData() -> Data? {
    if let data = try? fetchDataFromDisk() { return data }
    if let data = try? fetchDataFromServer() { return data }
    return nil
}
```

### 禁止 Error 传播

有时你知道一个抛出 Error 的函数或方法在运行时是不会抛出 Error 的。此时你可以使用 `try!` 来处理这种情况。此时如果报出了 Error，将不会被传播，而是触发一个运行时的断言报错。

```swift
let photo = try! loadImage(atPath: "./Resources/John Appleseed.jpg")
```

### 指定清洁动作

`defer` 语句可以用来在当前代码块的代码结束执行时做一些操作。这个语句可以保证无论是代码正常离开，或者报错、break、return 出去的情况下都能执行必要的清洁操作。例如，你可以使用 `defer` 语句保证一个打开的文件最终被关闭释放资源。

`defer` 语句的内容将延迟到当前域的代码全部执行结束之后才会被执行。在 `defer` 语句中不能转移控制，执行例如 return 和 break 等操作，或者抛出一个 Error。另外，延迟动作的执行顺序是自下而上的，与一般自上而下执行的正常代码相比是颠倒的。这意味着如果存在多个 `defer` 语句，最先写的语句最后执行，最后写的语句最先执行。

```swift
func processFile(filename: String) throws {
    if exists(filename) {
        let file = open(filename)
        defer {
            close(file)
        }
        while let line = try file.readline() {
            // Work with the file.
        }
        // close(file) is called here, at the end of the scope.
    }
}
```

> R：Swift 的 `defer` 语句稍有类似 Java 的 try-catch 中的 `final` 或者 `try-with` 语句，但是更灵活。

# 相关

> 21.[Swift Optional Chaining](https://github.com/zfanli/notes/blob/master/swift/21.OptionalChaining.md)
>
> 23.[Swift Type Casting](https://github.com/zfanli/notes/blob/master/swift/23.TypeCasting.md)
