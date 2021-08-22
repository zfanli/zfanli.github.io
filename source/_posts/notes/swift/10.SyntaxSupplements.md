---
title: 10.Swift Syntax Supplements
tags:
  - Swift
date: '2019-06-22T13:28:35.099Z'
categories:
  - notes
  - swift
---

这部分和后面几个 chapters 是对官方文档的笔记。

前面的内容其实是一个单独的快速入门教程，内容颗粒度较大，在很短的篇幅里介绍了大部分 Swfit 的特性，但是对细节几乎都是只字未提或者一带而过。而这些被掠过的细节，全部在这篇文档中进行了较为详尽的解释。这两篇分别为独立的文章，所以内容有很多重合。在这里我挑选前面教程没有提过的内容进行记录。

看到目前，这方便内容属于进阶知识，不影响你的生产能力，但是可以加深你的理解和生产的体验。

这章是对基础的补充。主要是对数字进制的各自表达方式，不常使用的别名关键字，以及改善开发流程的断言和先决条件进行了说明。

<!-- more -->

- 数字进制

二进制、八进制、十六进制的数字表现。

- typealias

给类型命名别名。

- Assertions 和 Preconditions

断言只对开发环境有效，先决条件在生产环境也有效。

## 基础语法补充

### 先啰嗦几句

前面 1 个介绍和 8 个 part 是官网的 Get Started 内容。此后官方的文档转向面对超级初心者的超啰嗦模式的详细解说。

看过官方的 A Tour 之后我们已经对 Swift 对样子有了个大概的印象了，不过显然一门编程语言是不可能如此容易的就被我们摸清的，很显然这个 Tour 为了简单起见隐去了大部分的细节。这里就是我速读这些细节之后记录的觉得比较重要的地方。

之所以是速读，只是我深知在毫无使用经验的前提下的精读是没有太大意义的，只有了解大概之后积累相应的开发经验，在此基础上进行精读才可能会有醍醐灌顶之感。这就是所谓的厚积薄发吧。

### Basics

看到这里你已经知道了，Swift 是主要用于苹果平台各个系统的开发语言。它脱胎于 C 和 Objective-C，如果你熟悉这两门语言或者其中一门，你会更轻松的掌握 Swift。

Swift 的类型很常见，毕竟脱胎于 C 和 Objective-C，它有整型 `Int`，双精度浮点数 `Double`，单精度浮点数 `Fload`，布尔值 `Bool`，文本数据类型 `String`。还有功能强大的三种集合类型，分别是数组 `Array`，集合 `Set` 和字典类型 `Dictionary`。后面会提到集合类型。

在声明变量时，Swift 会根据初始化值的类型推测变量的类型，根据官方提示，需要标注变量类型的场景不多，除非是声明时不进行初始化的变量，需要手动声明类型。

Swift 还引入了一些 Objective-C 中不存在的高级类型，比如元组，让你可以将一组值组合成一个组合值作为函数的返回值，来让函数可以返回多个值。还有可选型类型，用来处理变量值缺失的场景，这在 Swift 的众多特性中被广泛使用。

Swift 还是类型安全的，编译期间会检测传参类型不符等问题，帮助你在开发早期发现和解决问题。

Swift 不要求写分号，但是如果单行有多条语句则需要分号区分。

### 一些类型

- Int / UInt

整型，无符号整型。

- Double / Float

双精度浮点数，单精度浮点数。

- Bool

`true` 和 `false`。布尔值

- Tuples

括号包围的数组，元素不限类型，一般用于将多个值打包。

### 数字字面量

- 10 进制无需前缀
- 2 进制 `0b` 前缀
- 8 进制 `0o` 前缀
- 16 进制 `0x` 前缀

```swift
let decimalInteger = 17
let binaryInteger = 0b10001       // 17 in binary notation
let octalInteger = 0o21           // 17 in octal notation
let hexadecimalInteger = 0x11     // 17 in hexadecimal notation
```

浮点数可以用十进制表示，同样可以用十六进制表示。浮点数的点两边都必须有数字。十进制的浮点数可以有一个可选的指数 e，不分大小写；而十六进制必须有指数 p，同样不分大小写。

- 1.25e2 means 1.25 x 102, or 125.0.
- 1.25e-2 means 1.25 x 10-2, or 0.0125.
- 0xFp2 means 15 x 22, or 60.0.
- 0xFp-2 means 15 x 2-2, or 3.75.

下面的数值字面量的值都是 12.1875。

```swift
let decimalDouble = 12.1875
let exponentDouble = 1.21875e1
let hexadecimalDouble = 0xC.3p0
```

数值字面量可以包含格式字符辅助阅读，可以补零，或用下划线分隔。

```swift
let paddedDouble = 000123.456
let oneMillion = 1_000_000
let justOverOneMillion = 1_000_000.000_000_1
```

### 类型别名

`typealias` 关键字可以定义类型别名。

```swift
typealias AudioSample = UInt16

var maxAmplitudeFound = AudioSample.min
// maxAmplitudeFound is now 0
```

### 断言和先决条件

断言和先决条件的检查发生在运行时，用来检查在执行某段代码前是否满足一定基础条件。如果断言和先决条件的布尔值表达式返回 `true` 则程序继续执行，如果为 `false`，表示当前状态无效，程序停止执行，你的 App 也会停止运行。

断言和先决条件用来在编程过程中检查程序的运行是否如你的预期，因此你可以将其包括在你的代码中。断言可以帮助你在开发期间排错和纠错，先决条件可以帮助你在生产模式下侦测问题。

为了在运行时验证你的预期，断言和先决条件也将构成你代码中的非常有用的文档。和错误处理不同，断言和先决条件不是用来恢复或者预期一个错误的，因为一个失败了的断言或者先决条件表示无效的程序状态，失败了的断言或者先决条件无法像 Error 那样被捕获。

断言和先决条件不适合用于无效条件可能不作处理的情况。相反，使用它们来保证你的数据和状态的有效性，可以让你的程序在无效状态出现的时候可预料的结束运行，可以帮你更轻松的进行 debug。在检测到无效状态时即刻停止执行也将能有效的限制由其造成的伤害。

断言和先决条件的不同之处在于检查的时机：

- 断言仅在 debug 构建中进行检查；而
- 先决条件在 debug 和生产构建中都将进行检查。

生产环境下断言的判断不会进行计算。这意味着你可以在开发时不用考虑断言对生产环境下的执行性能的影响，根据你的需要设置断言。

### 使用断言进行 Debug

断言函数位于 Swift 标准库，它的 API 是 `assert(_:_:file:line:)`。你需要传递一个布尔表达式和在错误时显示的信息。不过错误信息是可选的，你可以省略它。

```swift
let age = -3
assert(age >= 0, "A person's age can't be less than zero.")
// This assertion fails because -3 is not >= 0.
```

如果你的代码中已经进行了条件判断，可以使用 `assertionFailure(_:file:line:)` 直接抛出断言失败。

```swift
if age > 10 {
    print("You can ride the roller-coaster or the ferris wheel.")
} else if age >= 0 {
    print("You can ride the ferris wheel.")
} else {
    assertionFailure("A person's age can't be less than zero.")
}
```

### 强制先决条件

在你的代码需要保证一个布尔表达式一定返回 `true` 才能继续执行，但该表达式有潜在风险可能返回 `false` 时使用先决条件。比如在检查下标越界和函数是否传递了有效值时。

先决条件的 API 是 `precondition(_:_:file:line:)`，和断言一样，你需要提供一个布尔表达式进行计算，一个错误信息在失败时显示，这个信息可以被省略。

```swift
// In the implementation of a subscript...
precondition(index > 0, "Index must be greater than zero.")
```

`preconditionFailure(_:file:line:)` 可以用来在已经进行条件判断的情况下直接抛出先决条件失败。比如在 if 判断的 else 中，或者 switch 的 default 中。

# 相关

> 9.[Swift Syntax Basics (泛型)](<https://github.com/zfanli/notes/blob/master/swift/9.SyntaxBasics(Generics).md>)
>
> 11.[Swift Basic Operators](https://github.com/zfanli/notes/blob/master/swift/11.BasicOperators.md)
