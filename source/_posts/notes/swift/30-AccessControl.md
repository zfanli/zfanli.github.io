---
title: 30.Swift Access Control
tags:
  - Swift
date: "2019-07-14T16:28:35.099Z"
---

乍一看，好高级的话题。仔细一看，无非就是外部能访问的限制程度而已，功能和 Java 的 `public`、`private` 修饰符一样，无非细化程度更多。总结如下：

按照等级从高到低排序。

- （最高）`open` 和 `public` 关键字允许最少的访问限制，`open` 对于类来说，允许外部继承和覆盖类的属性，`public` 则不允许；
- `internal` 模块外部不能访问；
- `fileprivate` 定义文件内可访问；
- （最低）`private` 定义仅两个打括号之间的代码能访问。

普遍的规则是，内部的访问权限不能高于外部，可以低于外部。比如类标注为 internal 那么类成员就不能高于 internal 比如说 public。

默认不写访问控制等级就都是 internal。

对于元组、函数来说，访问控制等级是其内部等级最低的那个。函数必须显式声明访问等级，如果 internal 不适用的话。

<!-- more -->

## 访问控制

访问控制用来限制外部源文件和模块对你的代码的访问。这个功能可以隐藏你的内部实现，只暴露借口给外部代码。

你可以对各个类型独立设定访问等级，包括类、结构体、枚举类型，你也可以对属性、方法、初始化器等单独设定访问等级。协议可以用来限定上下文，比如常、变量或者函数化。

Swift 为了减少显式声明访问等级，会默认对类型设定访问等级。通常如果你在开发一个单一目标的 App 你可以根本不需要手动设定访问等级。

### 模块和源文件

Swift 的访问控制是基于模块化概念的。

一个模块是代码分发的一个基础单元。一个框架或者应用可以被包装成一个单元，其他模块可以使用 `import` 关键字进行导入。

Xcode 中每一个构筑对象都会被作为一个模块对待。

> R：嗯，啰嗦的介绍了模块化，可是我不想啰嗦。总之模块化就对了。

### 访问等级

Swift 提供五个访问等级。

- Open 和 Public 定义公开的访问权限，通常用于公开接口，区别下文会谈；
- Internal 定义内部访问权限，模块外的代码无法访问，一般针对内部实现；
- File-private 定义单文件内部访问权限，文件外无法对其进行访问，通常用于封装某个功能在一个文件中，外部不需要知道细节，即使在同一个模块；
- Private 定义一个代码块中私有访问权限，表示这部分内容是独有的，这块代码以外是不可以访问它的。

从限制程度上来看 Open 是最高级但是限制最少的，而 Private 是最低级但限制最多的。

Open 仅适用与类和类的成员，它与 Public 的区别如下。

- 类标注 public 或其他访问权限时外部代码不能创建它的子类，只有模块内部才可以；
- 类的成员被标注 public 或其他访问权限时，外部子类不能对其进行覆盖，只有模块内的子类才能对其进行 `override`；
- Open 可以让类接受外部继承；
- Open 可以让外部子类覆盖类成员。

对类设定 Open 指定这个类可以被外部继承，并且你会对次进行处理。

### 访问等级指导原则

Swift 的访问控制整体遵守这个指导原则：一个实体不能被定义为另一个访问等级低于它的实体。

比如：

- 一个 public 变量不能被定义为一个 internal 或者更高访问限制的类型；
- 一个函数的访问等级不能高于它的参数和返回值。

### 默认访问等级

你代码中的所有实体（除了个别情况后文会解释）都被默认设定为 internal 访问等级，通常情况下你不需要手动设定它。

### 单一对象 App

对于单一对象 App 来说代码时自包含的，不需要任何外部访问，默认的 internal 等级足够满足需求，所以你什么也不需要做。

### 框架的访问等级

如果你开发一个框架，你需要其他模块使用你的 API，你需要将这些 API 设定为开放或者公开的。

### 单元测试对象的访问等级

如果你给你写的单元测试对象在引入其他模块时标注 `@testable` 属性，这个单元测试可以访问所有模块内的实体，即使是 internal 的。这是为了方便测试目的。

### 访问控制语法

使用各个关键字修饰符定义访问控制的等级。例子中每列出来的有 `open` 关键字。

```swift
public class SomePublicClass {}
internal class SomeInternalClass {}
fileprivate class SomeFilePrivateClass {}
private class SomePrivateClass {}

public var somePublicVariable = 0
internal let someInternalConstant = 0
fileprivate func someFilePrivateFunction() {}
private func somePrivateFunction() {}
```

除非额外指定了访问等级，否则默认是 `internal`，上面例子中的 `internal` 关键字可省略。

```swift
class SomeInternalClass {}              // implicitly internal
let someInternalConstant = 0            // implicitly internal
```

### 自定义类型

定义类型时声明访问权限。如果一个类型访问等级低于 internal，比如 private 则类型成员的访问等级都将默认为 private。但是如果一个类型访问等级高于或者等于 internal，如 public 或者 internal，则类型成员的默认等级都将为 internal。如果你需要将类型成员访问等级提高，需要手动标注修饰符。

```swift
public class SomePublicClass {                  // explicitly public class
    public var somePublicProperty = 0            // explicitly public class member
    var someInternalProperty = 0                 // implicitly internal class member
    fileprivate func someFilePrivateMethod() {}  // explicitly file-private class member
    private func somePrivateMethod() {}          // explicitly private class member
}

class SomeInternalClass {                       // implicitly internal class
    var someInternalProperty = 0                 // implicitly internal class member
    fileprivate func someFilePrivateMethod() {}  // explicitly file-private class member
    private func somePrivateMethod() {}          // explicitly private class member
}

fileprivate class SomeFilePrivateClass {        // explicitly file-private class
    func someFilePrivateMethod() {}              // implicitly file-private class member
    private func somePrivateMethod() {}          // explicitly private class member
}

private class SomePrivateClass {                // explicitly private class
    func somePrivateMethod() {}                  // implicitly private class member
}
```

### 元组类型

元组类型根据自身元素的最高访问等级设定自己的访问等级。比如它有一个 internal 元素和一个 private 元素，那么这个元组就是 private 的。

### 函数类型

函数的访问等级根据参数和返回值决定，但是必须显式标注。比如下面的例子函数得到一个 internal 参数和 private 参数，那么函数应该是 private 的，可能你预期这样声明这个函数：

```swift
func someFunction() -> (SomeInternalClass, SomePrivateClass) {
    // function implementation goes here
}
```

但是很可惜这样是不行的，你必须像下面这样显式声明访问等级。

```swift
private func someFunction() -> (SomeInternalClass, SomePrivateClass) {
    // function implementation goes here
}
```

### 枚举类型

枚举类型的 case 默认和类型拥有相同的访问等级，而且是不能独自设定的。下面的例子中所有 case 都是 public 的。

```swift
public enum CompassPoint {
    case north
    case south
    case east
    case west
}
```

枚举类型的原始值和关联值只能高于枚举类型的访问等级。

### 嵌套类型

嵌套类型拥有和类成员相同的待遇，低于 internal 则自动和类型一致，高于 internal 则默认为 internal，除非你手动设定为更高的等级。

### 子类

在当前上下文中的类型你都可以继承。子类访问等级不能高于父类，例如父类是 internal 子类就不可以是 public。

此外，你可以在确定的访问等级下覆盖父类的成员。覆盖父类的成员可以提升成员的访问等级。下面的例子中子类 B 将父类 A 的 fileprivate 方法提升为了 internal 方法。

```swift
public class A {
    fileprivate func someMethod() {}
}

internal class B: A {
    override internal func someMethod() {}
}
```

并且根据子类和父类的位置关系，子类覆盖的成员可以调用更低访问等级的父类成员。要求是子类的位置可以使用该属性。比如子类和父类在一个文件那么父类的 fileprivate 就可以被子类覆盖的成员中使用，如果子类父类在同一个模块则父类 internal 就可以被子类使用。

```swift
public class A {
    fileprivate func someMethod() {}
}

internal class B: A {
    override internal func someMethod() {
        super.someMethod()
    }
}
```

### 变量、常量、属性和下标

访问权限不能比类型高。

### getter 和 setter

访问权限不能比属性高。可以单独设置，语法如下。

```swift
struct TrackedString {
    private(set) var numberOfEdits = 0
    var value: String = "" {
        didSet {
            numberOfEdits += 1
        }
    }
}


var stringToEdit = TrackedString()
stringToEdit.value = "This string will be tracked."
stringToEdit.value += " This edit will increment numberOfEdits."
stringToEdit.value += " So will this one."
print("The number of edits is \(stringToEdit.numberOfEdits)")
// Prints "The number of edits is 3"
```

### 初始化器

默认初始化器访问等级和类型相同。你可以定义不同访问等级的初始化器。

### 协议

协议访问等级可以限制实现协议的上下文。

协议的继承会继承访问等级，不能更高。

### 扩展

扩展也不能破坏访问等级。你需要遵守。

> R：总之，只能低不能高。其他就不记了，都一样的。

# 相关

> 29.[Swift Memory Safety](https://github.com/zfanli/notes/blob/master/swift/29.MemorySafety.md)
>
> 31.[Swift Advanced Operators](https://github.com/zfanli/notes/blob/master/swift/31.AdvancedOperators.md)
