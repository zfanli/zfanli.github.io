---
title: 27.Swift Opaque Types
tags:
  - Swift
date: '2019-07-13T14:28:35.099Z'
categories:
  - notes
  - swift
---

不透明类型是用来隐藏具体类型信息，只以协议类型描述返回值的一个机制。作用在于保持私有类型的私有性，模块外的用户得到协议类型的返回值，不用处理具体实现的类型。这样的好处在于内部更换实现对外部不再有影响，而且不透明类型只是对用户不透明，编译器可以得到具体类型进行特化处理，最好的优化性能。

其语法形式是在返回值协议类型前加 `some` 关键字。

这篇主题看上去挺重要但实际上很枯燥。主要是，太啰嗦了，而且啰嗦了一大堆也没看懂重点在哪里。

再议！

<!-- more -->

## 不透明类型

不透明类型是指一个函数或方法隐藏了类型信息，其返回值类型将描述为其支持的协议，而不是一个具体的类型。隐藏类型信息可以让模块中潜在的返回值类型保持私有，让模块内的代码和外部调用模块的代码区分边界。将返回类型定义为协议类型也能做到这一点，但是不透明返回类型保留了一定的类型身份信息，这些信息将对编译器可见，对用户不可见。

### 不透明类型解决的问题

例如，假设你正在写一个基于 ASCII 码的艺术图形绘制的模块。一个 ASCII 艺术图形的基础特性就是 `draw()` 方法，它会返回一个描绘这个图像的字符串，它的声明如下：

```swift
protocol Shape {
    func draw() -> String
}

struct Triangle: Shape {
    var size: Int
    func draw() -> String {
        var result = [String]()
        for length in 1...size {
            result.append(String(repeating: "*", count: length))
        }
        return result.joined(separator: "\n")
    }
}
let smallTriangle = Triangle(size: 3)
print(smallTriangle.draw())
// *
// **
// ***
```

你可以用泛型去实现一个颠倒图形的操作，如下面代码。但是这个方法有一个严重的限制：它的结果暴露了实际用来创建颠倒图形使用的类型的具体的泛型类型信息。

```swift
struct FlippedShape<T: Shape>: Shape {
    var shape: T
    func draw() -> String {
        let lines = shape.draw().split(separator: "\n")
        return lines.reversed().joined(separator: "\n")
    }
}
let flippedTriangle = FlippedShape(shape: smallTriangle)
print(flippedTriangle.draw())
// ***
// **
// *
```

> R：插入一段说明。
>
> 上面的 `Triangle` 类型应该算作一个用于公开的 API 类型。而将一个 `Triangle` 输出进行颠倒，按照预期我们应该得到另一个 `Triangle` 并且调用它的 `draw()` 方法就可以得到一个颠倒的图形输出，但是实际上模块内部的实现方式是用一个泛型结构体拿到之前那个 `Triangle` 对象，然后调用它的 `draw()` 方法，缓存得到的字符串，接着逆转输出。
>
> 从实现上来说没有什么问题，但是如果我们想得到一个颠倒的三角形图案，我们得到的却是一个类型为 `FlippedShape` 的泛型类型对象，而非预期的 `Triangle` 对象。从名称上看来 `FlippedShape` 或许并不是一个适合公开的类型，而且随着模块更新或实现方式变更，不能保证以后进行同样的操作得到的是相同的 `FlippedShape` 类型对象。
>
> 所以这里来说，暴露了一个不稳定的内部潜在类型其实是不安全的，这里最好提供一个稳定的类型，而不要关联一个随时会更新换代的内部类型。

下面再定义一个 `JoinedShape<T: Shape, U: Shape>` 方法用来将两个形状垂直拼到一起。使用这个方法构建一个拼接到一起的形状会得到一个类型为 `JoinedShape<Triangle, FlippedShape<Triangle>>` 的对象。

```swift
struct JoinedShape<T: Shape, U: Shape>: Shape {
    var top: T
    var bottom: U
    func draw() -> String {
        return top.draw() + "\n" + bottom.draw()
    }
}
let joinedTriangles = JoinedShape(top: smallTriangle, bottom: flippedTriangle)
print(joinedTriangles.draw())
// *
// **
// ***
// ***
// **
// *
```

由于需要声明完整的返回类型，暴露形状创建的细节信息将会导致不属于模块公开接口的类型泄漏出去。模块内部的代码有非常多的方式构建一个相同的形状，而模块外的代码也不应该处理各种图形转换的实现细节。类似于 `JoinedShape` 和 `FlippedShape` 之类的包装器类型对用户来说是没有意义的，它们应该是对外不可见的。模块的公开接口应该由合并、颠倒之类的操作构成，但是这些操作应该返回另一个 `Shape` 值。

> R：而不是一个具体的内部实现类型。

### 返回一个不透明类型

你可以将不透明类型当作一个反向的泛型类型。泛型代码让调用者来决定函数的参数，并用函数实现中抽象出来的方式返回值。下面的例子中返回值的类型取决于调用者。

> R：来啦！又是用一个难懂的概念解释另一个难懂的概念。
>
> 这段翻译可能有点无力，因为我也不确定我是不是理解对了，原文如下：
>
> You can think of an opaque type like being the reverse of a generic type. Generic types let the code that calls a function pick the type for that function’s parameters and return value in a way that’s abstracted away from the function implementation.

```swift
func max<T>(_ x: T, _ y: T) -> T where T: Comparable { ... }
```

`max(_:_:)` 函数的调用者决定 x 和 y 的类型，只要这个类型符合 `Comparable` 协议。函数内部的代码以通用的方式编写，这样它就可以处理调用者提供的任何类型。`max(_:_:)` 函数只用到了 `Comparable` 协议提供的功能性。

如果函数返回一个不透明类型，则角色互换。不透明类型可以让函数实现用调用者代码中抽象出来的方式决定返回值的类型。例如下面的代码在不暴露潜在类型的情况下返回一个梯形。

```swift
struct Square: Shape {
    var size: Int
    func draw() -> String {
        let line = String(repeating: "*", count: size)
        let result = Array<String>(repeating: line, count: size)
        return result.joined(separator: "\n")
    }
}

func makeTrapezoid() -> some Shape {
    let top = Triangle(size: 2)
    let middle = Square(size: 2)
    let bottom = FlippedShape(shape: top)
    let trapezoid = JoinedShape(
        top: top,
        bottom: JoinedShape(top: middle, bottom: bottom)
    )
    return trapezoid
}
let trapezoid = makeTrapezoid()
print(trapezoid.draw())
// *
// **
// **
// **
// **
// *
```

`makeTrapezoid()` 函数返回的类型是 `some Shape`。函数没有给返回值指定任何具体的类型，其结果是函数返回一个给定的实现了 `Shape` 协议的类型的值。以这种方式编写函数表现出它作为一个公开接口的基础面，也就是返回一个 `Shape` 类型值，而不需要将制作这些形状的指定类型定义为它的公开接口的一部分。这个实现使用了两个三角形和一个四边形，但是这个函数可以在不变更返回值的情况下用其他的方式进行重写，毕竟要实现绘制一个梯形有太多的方式可以使用。

这个例子强调了不透明类型类似反向的泛型这一点。`makeTrapezoid()` 函数内部的代码可以根据需要返回任意实现了 `Shape` 协议的类型，就像泛型函数调用者所做的一样。为了处理 `makeTrapezoid()` 函数返回的任何 `Shape` 类型的值，这个函数的调用代码需要用更通用的方式编写，就像一个泛型函数的实现。

你也可以将不透明类型和泛型配合使用。下面的函数都将返回一个实现了 `Shape` 协议的类型。

```swift
func flip<T: Shape>(_ shape: T) -> some Shape {
    return FlippedShape(shape: shape)
}
func join<T: Shape, U: Shape>(_ top: T, _ bottom: U) -> some Shape {
    JoinedShape(top: top, bottom: bottom)
}

let opaqueJoinedTriangles = join(smallTriangle, flip(smallTriangle))
print(opaqueJoinedTriangles.draw())
// *
// **
// ***
// ***
// **
// *
```

`opaqueJoinedTriangles` 和上文例子中的 `joinedTriangles` 是一致的。不同的是 `flip(_:)` 和 `join(_:_:)` 函数包装了潜在的类型，将其以不透明类型的形式返回，这样类型信息对外部来说是不可见的。由于依赖泛型参数，这两个函数都是泛型的，而且类型参数会附带 `FlippedShape` 和 `JoinedShape` 所需的类型信息。

如果一个函数多处返回不透明类型，这些可能的返回值都需要有相同的类型。对于泛型类型来说，返回值类型可以使用泛型参数类型，但它仍然需要是同一个类型。下面是一个**无效版本**的例子。

```swift
func invalidFlip<T: Shape>(_ shape: T) -> some Shape {
    if shape is Square {
        return shape // Error: return types don't match
    }
    return FlippedShape(shape: shape) // Error: return types don't match
}
```

上面的函数违反了返回值必须是相同类型的要求，所以它是无效的代码。要修复这个问题，可以将 Square 的判断移到 `FlippedShape` 函数里。

```swift
struct FlippedShape<T: Shape>: Shape {
    var shape: T
    func draw() -> String {
        if shape is Square {
            return shape.draw()
        }
        let lines = shape.draw().split(separator: "\n")
        return lines.reversed().joined(separator: "\n")
    }
}
```

在返回值中使用泛型是不违反要求的，比如下面代码。

```swift
func `repeat`<T: Shape>(shape: T, count: Int) -> some Collection {
    return Array<T>(repeating: shape, count: count)
}
```

### 不透明类型和协议类型的区别

不透明返回值类型和协议类型返回值看上去比较相似，区别之处在于是否保留类型身份信息。不透明类型引用一个指定的类型，但是这对调用者来说是不可见的；而协议类型可引用任何符合该协议的类型。通常来说，协议类型给予你更多灵活性在潜在类型上，但不透明类型可以让你对这些潜在类型作出强保证。

例如下面的代码没有使用不透明类型，而是使用一个协议类型作为返回值。

```swift
func protoFlip<T: Shape>(_ shape: T) -> Shape {
    return FlippedShape(shape: shape)
}
```

`protoFlip(_:)` 的处理和 `flip(_:)` 完全一致，并且始终返回相同类型的值。和 `flip(_:)` 不同的是 `protoFlip(_:)` 不要求始终返回相同类型的值，他只要求实现 `Shape` 协议就可以。另一方面 `protoFlip(_:)` 在 API 约束上比 `flip(_:)` 更加宽松。它保留了返回多种类型值的灵活性。

```swift
func protoFlip<T: Shape>(_ shape: T) -> Shape {
    if shape is Square {
        return shape
    }

    return FlippedShape(shape: shape)
}
```

修订后的版本可以返回两个类型的值，取决于参数类型。这个函数返回的值的；类型可能完全不同。

```swift
let protoFlippedTriangle = protoFlip(smallTriangle)
let sameThing = protoFlip(smallTriangle)
protoFlippedTriangle == sameThing  // Error
```

> R：不太清除这篇主题的重要性。总之，目前研究比较枯燥，等到实践中再验证吧。下面贴部分代码示例。

```swift
protocol Container {
    associatedtype Item
    var count: Int { get }
    subscript(i: Int) -> Item { get }
}
extension Array: Container { }


// Error: Protocol with associated types can't be used as a return type.
func makeProtocolContainer<T>(item: T) -> Container {
    return [item]
}

// Error: Not enough information to infer C.
func makeProtocolContainer<T, C: Container>(item: T) -> C {
    return [item]
}


func makeOpaqueContainer<T>(item: T) -> some Container {
    return [item]
}
let opaqueContainer = makeOpaqueContainer(item: 12)
let twelve = opaqueContainer[0]
print(type(of: twelve))
// Prints "Int"
```

# 相关

> 26.[Swift Generics](https://github.com/zfanli/notes/blob/master/swift/26.Generics.md)
>
> 28.[Swift Automatic Reference Counting](https://github.com/zfanli/notes/blob/master/swift/28.AutomaticReferenceCounting.md)
