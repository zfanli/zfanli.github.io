---
title: 24.Swift Extensions
tags:
  - Swift
date: "2019-07-06T14:28:35.099Z"
---

这部分内容也是复习。扩展可以给任何类型添加新的属性、方法、初始化器，虽然它有以下的限制：

- 对类来说无法添加新的指定初始化器或卸载器，它们只能由原始实现提供；
- 给另一个 Module 的结构体添加新的初始化器时，在调用其本身的初始化器之前无法访问 `self` 属性。

<!-- more -->

## 扩展

扩展用来给现有的类、结构体、枚举类型甚至是协议添加功能。你可以在不用访问类型的原始代码的情况下对其进行扩展。

Swift 中的扩展可以做到下面这些事：

- 添加计算实例属性和计算的类型属性；
- 定义实例的方法和类型的方法；
- 提供新的初始化器；
- 定义下标；
- 定义和使用新的嵌套类型；
- 让一个现有的类型实现一个协议。

在 Swift 中，你甚至可以对协议进行扩展来提供它所要求的实现，或者是提供符合的类型能利用的其他附加功能。

### 扩展语法

下面是使用扩展的语法。

```swift
extension SomeType {
    // new functionality to add to SomeType goes here
}
```

扩展可以让现有的类型实现新的协议。

```swift
extension SomeType: SomeProtocol, AnotherProtocol {
    // implementation of protocol requirements goes here
}
```

### 计算属性

扩展可以给现有类型添加新的计算属性。下面的例子对 Swift 内置的 Double 类型添加了计算属性，实现对计算距离单位的基础支持。

```swift
extension Double {
    var km: Double { return self * 1_000.0 }
    var m: Double { return self }
    var cm: Double { return self / 100.0 }
    var mm: Double { return self / 1_000.0 }
    var ft: Double { return self / 3.28084 }
}
let oneInch = 25.4.mm
print("One inch is \(oneInch) meters")
// Prints "One inch is 0.0254 meters"
let threeFeet = 3.ft
print("Three feet is \(threeFeet) meters")
// Prints "Three feet is 0.914399970739201 meters"
```

这些计算属性表示 Double 值应该被作为某个长度单位处理。尽管它们作为计算属性实现，但是可以使用点语法将其加在浮点数值的字面量后，作为一种方式来执行字面量的长度换算。

它们是只读的，为了简洁省略了 get 关键字。它们甚至可以做运算。

```swift
let aMarathon = 42.km + 195.m
print("A marathon is \(aMarathon) meters long")
// Prints "A marathon is 42195.0 meters long"
```

### 初始化器

扩展可以给现有的类型添加新的初始化器。这可以让你扩展其他类型接收你的定制类型作为初始化器的参数，或者提供原始实现中没有的新的初始化选项。

对于类来说，扩展可以添加新的便利初始化器，但是无法添加新的指定初始化器或者是卸载器。指定初始化器和卸载着只能由原始实现提供。

如果你给另一个模块的结构体添加新的初始化器，在调用其本身的初始化器之前你无法访问 `self` 属性。

下面的代码定义了一个四边形和尺寸、点的属性。

```swift
struct Size {
    var width = 0.0, height = 0.0
}
struct Point {
    var x = 0.0, y = 0.0
}
struct Rect {
    var origin = Point()
    var size = Size()
}
```

由于 Rect 结构体给所有属性提供了默认值，所以它会收到一个默认的初始化器，以及一个按成员初始化器。你可以像下面这样创建 Rect 的新实例。

```swift
let defaultRect = Rect()
let memberwiseRect = Rect(origin: Point(x: 2.0, y: 2.0),
   size: Size(width: 5.0, height: 5.0))
```

你可以使用扩展给 Rect 添加指定的中点和尺寸属性。

```swift
extension Rect {
    init(center: Point, size: Size) {
        let originX = center.x - (size.width / 2)
        let originY = center.y - (size.height / 2)
        self.init(origin: Point(x: originX, y: originY), size: size)
    }
}
```

这个新的初始化器首先用拿到的参数计算出点的信息，然后调用结构体原本的初始化器进行初始化。

```swift
let centerRect = Rect(center: Point(x: 4.0, y: 4.0),
                      size: Size(width: 3.0, height: 3.0))
// centerRect's origin is (2.5, 2.5) and its size is (3.0, 3.0)
```

### 方法

扩展可以给类型添加新的方法。

```swift
extension Int {
    func repetitions(task: () -> Void) {
        for _ in 0..<self {
            task()
        }
    }
}

3.repetitions {
    print("Hello!")
}
// Hello!
// Hello!
// Hello!
```

添加方法可以修改实例本身，但是对于结构体和枚举类型来说，修改自身的方法需要 `mutating` 关键字。

```swift
extension Int {
    mutating func square() {
        self = self * self
    }
}
var someInt = 3
someInt.square()
// someInt is now 9
```

### 下标

可以添加下标支持给现有的类型。

```swift
extension Int {
    subscript(digitIndex: Int) -> Int {
        var decimalBase = 1
        for _ in 0..<digitIndex {
            decimalBase *= 10
        }
        return (self / decimalBase) % 10
    }
}
746381295[0]
// returns 5
746381295[1]
// returns 9
746381295[2]
// returns 2
746381295[8]
// returns 7
```

### 嵌套类型

还可以添加嵌套类型。下面对 Int 添加嵌套的枚举类型，可以判断数值的符号。

```swift
extension Int {
    enum Kind {
        case negative, zero, positive
    }
    var kind: Kind {
        switch self {
        case 0:
            return .zero
        case let x where x > 0:
            return .positive
        default:
            return .negative
        }
    }
}

func printIntegerKinds(_ numbers: [Int]) {
    for number in numbers {
        switch number.kind {
        case .negative:
            print("- ", terminator: "")
        case .zero:
            print("0 ", terminator: "")
        case .positive:
            print("+ ", terminator: "")
        }
    }
    print("")
}
printIntegerKinds([3, 19, -27, 0, -6, 0, 7])
// Prints "+ + - 0 - 0 + "
```

# 相关

> 23.[Swift Type Casting](https://github.com/zfanli/notes/blob/master/swift/23.TypeCasting.md)
>
> 25.[Swift Protocols](https://github.com/zfanli/notes/blob/master/swift/25.Protocols.md)
