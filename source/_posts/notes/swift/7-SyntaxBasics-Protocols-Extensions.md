---
title: 7.Swift Syntax Basics (协议和扩展)
tags:
  - Swift
date: "2019-06-19T15:28:35.099Z"
---

在 Swift 中称为协议，这个概念一听之下很陌生，但却是一个熟悉的概念。在 Java 中它叫接口，是面向接口编程的核心。它定义了一套规范，所有实现协议的类、枚举类型或者结构体都有相同的特征，它们属于本身类型之外还属于这个协议的子类型。但是如果使用协议作为一个变量的类型，并且将一个实现了该协议的对象赋值给它，虽然在运行时它的类型是协议的子类型，但在编译时会将其作为协议类型对待，这意味着你不能使用非协议定义的属性和方法。

扩展是一个很灵活的机制，在 Java 中没看到对应的实现，除非使用反射机制吧。

扩展允许在声明一个类型之后对该类型进行扩展，比较类似的可能是其他语言的 Mixin 机制了吧。不仅是自己声明的类型，外来引入的库或者框架的类型都是可以扩展的。

<!-- more -->

协议和扩展的内容比较少。对于初级入门来说信息量已经足够了吧。

## 协议和扩展

使用 `protocol` 声明一个协议。

```swift
protocol ExampleProtocol {
     var simpleDescription: String { get }
     mutating func adjust()
}
```

类、枚举类型、结构体都可以实现（adopt）协议。

> R：官方采用 Adopt 表达实现这个动作，这个词是接受和开始使用一个新东西的意思。在 Java 中实现是 Implement，这个词是指开始实施一个新的计划或者使用一个新的系统。

```swift
class SimpleClass: ExampleProtocol {
     var simpleDescription: String = "A very simple class."
     var anotherProperty: Int = 69105
     func adjust() {
          simpleDescription += "  Now 100% adjusted."
     }
}
var a = SimpleClass()
a.adjust()
let aDescription = a.simpleDescription
// "A very simple class.  Now 100% adjusted."

struct SimpleStructure: ExampleProtocol {
     var simpleDescription: String = "A simple structure"
     mutating func adjust() {
          simpleDescription += " (adjusted)"
     }
}
var b = SimpleStructure()
b.adjust()
let bDescription = b.simpleDescription
// "A simple structure (adjusted)"
```

注意 ⚠️，在 SimpleStructure 中 adjust() 方法名前面的 `mutating` 关键字表示这个方法会修改结构体的属性。在 SimpleClass 中不需要这个关键字，因为类的方法可以随时修改自己的属性。

> R：协议就是 Java 中的接口呀？Swift 中难不成有面向协议编程的概念吗？可以从例子中看出来，实现一个协议和继承一个父类的写法是一致的。

使用 `extension` 给一个现有类型扩展计算属性或者方法等功能性。你可以使用扩展机制给一个类型实现某个协议，这个类型可以是别处定义的，也可以是从其他库或者框架中导入的。

```swift
extension Int: ExampleProtocol {
    var simpleDescription: String {
        return "The number \(self)"
    }
    mutating func adjust() {
        self += 42
    }
 }
print(7.simpleDescription)
// prints "The number 7"
```

协议可以像其他类型一样使用（这句话有点绕）。例如，创建一个由实现了同一个协议的不同类型的对象组成的集合。不过当你处理一个类型是协议的值时，协议中没有定义的属性和方法是不能访问的。

```swift
let protocolValue: ExampleProtocol = a
print(protocolValue.simpleDescription)
// print(protocolValue.anotherProperty)  // Uncomment to see the error
```

> R：用协议作为变量的类型，把一个实现了该协议的类或者结构体的实例对象传递给它时，相当于做了一个降级，所有自定义属性和方法都不能访问。

虽然 protocolValue 在运行时的类似是 SimpleClass，但是编译器将以 ExampleProtocol 对待它。这意味着你在 SimpleClass 中定义的自定义属性和方法都不能访问。

# 相关

> 6.[Swift Syntax Basics (枚举类型和结构体)](<https://github.com/zfanli/notes/blob/master/swift/6.SyntaxBasics(Enumerations&Structures).md>)
>
> 8.[Swift Syntax Basics (错误处理)](<https://github.com/zfanli/notes/blob/master/swift/8.SyntaxBasics(ErrorHandling).md>)
