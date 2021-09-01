---
title: 1.Official Documentation - Introducing Swift 5
tags:
  - Swift
date: "2019-06-14T13:28:35.099Z"
---

阅读官方对于 Swift 5 的介绍，了解它的特性和优势。多数都是摘抄原文或者翻译。

https://developer.apple.com/swift/

<!-- more -->

## R：写在前面的小结

Swift 虽然是一个开源项目，但是更多还是用来构建 Apple 自己的平台的应用。但是随着 Swift 的标准库现在在新版本的系统中内置，相信选择使用 Swift 的项目会越来越多。

从设计上来看 Swift 充分参考了其他流行的语言的优劣，并且针对共通性的问题进行了主观的改善。看上去 Swift 从设计上就避免了很多可能出现的问题，但是安全性和便利性存在着不可调和的矛盾，着重安全性的 Swift 或许在便利性上相较其他语言稍逊一筹。不过我觉得这只是一个习惯问题，牺牲一点便利性来换取更少、更不容易犯错或许是合算的。

更多细节只能在后续的学习中体会摸索。如果你想在 Apple 平台开发应用，选择 Swift 就没错。

## 扉页 Swift 5

一门功能强大的语言，同时也易于学习。

Swift 是一门功能强大（powerful）且直观（intuitive）的编程语言，用于 macOS、iOS、watchOS、tvOS 甚至是其他平台。用 Swift 编程是交互式且有趣的，它的语法简洁并且表达力强，它还包含了众多开发者喜爱的特性。Swift 代码从设计上考虑安全性，使用它制作的软件运行起来依旧快如闪电。

> R：扉页的牛吹得不错。

## Swift 5 简介

Swift 5 使你发布自己的 App 变得异常简单。因为 Swift 5 的运行环境如今已经内置于 macOS、iOS、watchOS、tvOS 的系统中，你的 App 在这些平台的最新系统上不再需要绑定它的运行环境包了。从 Apple Store 中下载 Swift 的 App 将会比以往体积更小、下载速度更快。

下面是它的附加特性。

- 字符串使用 UTF-8 编码
- Debug 和 release builds 下默认强制对内存独占访问
- SIMD Vector and Result types in Standard Library
- Dictionary 和 Set 的性能改善
- 支持动态可调用类型（dynamically callable types）以改善与动态语言（Python、JavaScript、Ruby 等）的交互性

> R：不明觉厉。

## 现代化

Swift 是结合几十年构建 Apple 平台的经验，对编程语言研究的最新成果。以清晰的语法表达命名参数（Named parameters），可以使 Swift 的 API 更加容易阅读和维护。你甚至不需要输入分号。类型推测让代码更加清晰、更不易出错，而 modules 的存在摆脱了 headers 并且提供命名空间。字符串 Unicode-correct，基于 UTF-8 编码并对各种使用场景进行性能优化以更好的支持国际化语言和 emoji。自动内存管理基于严格确定性的变量引用计算，保持最低内存使用率的同时，没有垃圾回收的开销。

下面的例子展示现代化直观的语法声明一个类型。为实例属性添加默认值，并且自定义初始化器。

```swift
struct Player {
    var name: String
    var highScore: Int = 0
    var history: [Int] = []

    init(_ name: String) {
        self.name = name
    }
}

var player = Player("Tomas")
```

使用 `extension` 对现有的类型进行功能扩展，使用字符串插值模版减少重复代码。

```swift
extension Player {
    mutating func updateScore(_ newScore: Int) {
        history.append(newScore)
        if highScore < newScore {
            print("\(newScore)! A new high score for \(name)! 🎉")
            highScore = newScore
        }
    }
}

player.updateScore(50)
// Prints "50! A new high score for Tomas! 🎉"
// player.highScore == 50
```

利用功能强大的语言特性快速扩展你的自定义类型，比如自动编码·解码 JSON 格式数据。

```swift
extension Player: Codable, Equatable {}

import Foundation
let encoder = JSONEncoder()
try encoder.encode(player)

print(player)
// Prints "Tomas, games played: 1, high score: 50”
```

使用最新简化的闭包函数执行功能强大的自定义变换。

```swift
let players = getPlayers()

// Sort players, with best high scores first
let ranked = players.sorted(by: { player1, player2 in
    player1.highScore > player2.highScore
})

// Create an array with only the players’ names
let rankedNames = ranked.map { $0.name }
// ["Erin", "Rosana", "Tomas"]
```

这些前瞻的概念反映到编程语言中是十分有趣的，还容易使用。

Swift 还有很多其他的特性可以使你的代码更有表达力。

- 功能强大、简单易用的泛型（Generics）
- 协议扩展（Protocol extensions）让同样代码编写更加容易
- 第一类函数（First class functions）和轻量级的闭包（closure）语法
- 对范围（range）和集合（collection）的迭代快速而简洁
- 元组（Tuple）和多返回值
- 支持方法、扩展、协议的结构（Structs）
- 枚举（Enums）可以有负载（payloads）且支持模式匹配
- 函数化编程，比如 map 和 filter
- 使用 `try`、`catch`、`throw` 处理原生错误（Native error）

> R：偏向函数化的，集大成的语法。

## 为安全而设计

Swift 移除了全部类型的不安全代码（entire classes of unsafe code）。变量在使用之前必须初始化，数组和整型会检查益处，内存自动管理，并且强制的独占内存访问可以防止很多编程错误。语法经过调整，可以轻松定义你的意图，比如简单的 3 字符关键字定义一个变量（`var`）或者常量（`let`）。并且 Swift 大量利用了值类型（value types），尤其是经常使用的数据类型，比如数组和字典。这意味着当你对这些数据类型的数据进行一次复制，你知道这些值不会在其他任何地方被修改。

> R：Value Types，对数据复制的时候复制其值，所以每个复制都是完全独立的实例，修改不会相互影响。与之相对的是 Reference Types，每次复制都仅复制引用，每个复制都共享同一份数据，数据的修改将影响所有复制的实例。

另一个安全方面的特性是，Swift 对象永远不会是 `nil`。Swift 的编译器会在编译时报错来阻止你创建或使用一个 `nil` 对象。这会让代码更加清晰和安全，而且可以一下子避免好几个目录的足以让 App 崩溃的问题。当然，在某些情况下 `nil` 是有效且被允许的。Swift 有一个被称作可选值（optional）的创新特性针对这些场景。一个可选值允许 `nil`，但是 Swift 的语法会强制你使用 `?` 语法来告诉编译器你明白你在做什么并会安全处理它。

> R: 类似 TypeScript 里面关于类型定义的 `?` 语法，表示允许 `null` 或者 `undefined`。另外在 Swift 中，其他语言中熟知的 `null` 被称为 `nil`。

当一个函数可能返回一个实例，也可能什么都不返回的时候，使用可选值。

```swift
extension Collection where Element == Player {
    // Returns the highest score of all the players,
    // or `nil` if the collection is empty.
    func highestScoringPlayer() -> Player? {
        return self.max(by: { $0.highScore < $1.highScore })
    }
}
```

可选值绑定（optional binding），可选值链（optional chaining）和 Nil 联合运算符（nil coalescing）等特性可以让你安全并有效率的处理可选值。

```swift
if let bestPlayer = players.highestScoringPlayer() {
    recordHolder = """
        The record holder is \(bestPlayer.name),\
        with a high score of \(bestPlayer.highScore)!
        """
} else {
    recordHolder = "No games have been played yet.")
}
print(recordHolder)
// The record holder is Erin, with a high score of 271!

let highestScore = players.highestScoringPlayer()?.highScore ?? 0
// highestScore == 271
```

> R：Nil Coalescing 类似三元表达式，简化版的。

## 快速的、功能强大的

Swift 从最初的设计上就是为了“快速”而生的。Swift 代码使用性能牛批的 LLVM 编译器技术，编译成优化过的原生代码，充分利用现代硬件的性能。它的语法和标准库同样经过调整，可以让你以最一目了然的方式写出来的代码同样可以获得最好的性能，无论其是运行在你的手表上或者是一组服务器中。

Swift 是 C 和 Objective-C 两者的继承者。它包含底层的原型，比如基本类型、流程控制和操作符。它也提供面向对象的特性，比如 class、协议和泛型，给 Cocoa 和 Cocoa Touch 开发者们要求的性能和功能。

## 适合作为第一门语言

Swift 可以帮你打开编程世界的大门。它被设计成人们的第一门编程语言，无论你还是学生或是准备探索新的职业生涯。对教育工作者来说，Apple 制作了免费的课程以方便课堂内外的 Swift 教学。初次接触的人可以下载 Swift Playgrounds，一个 iPad 应用，让你在有趣的互动中熟悉 Swift 编程。

感兴趣的开发者可以访问免费的课程来学习如何使用 Xcode 构建他们的第一个 app。全球各地的 Apple Store 会主办 Today at Apple Coding & Apps 活动，让你可以动手体验 Swift 编程。

> R：看了看资源大部分都是青少年教育内容...

## 源码与二进制码的兼容性

在 Swift 5 中，你可以使用新的编译器编译 Swift 4 的代码，不需要任何修改。相反，你可以使用新的编译器来充分利用 Swift 5 的新特性，并且根据自己的节奏一个模块一个模块的进行迁移。

或者你可以仅使用新的编译器，按照你自己的节奏迁移到 Swift 5。现在 Swift 5 为应用引进了二进制兼容。这意味着针对当前的 OS 和未来发布的 OS，你不需要在你的应用中引入 Swift 库了，因为新的 OS 中将会内置 Swift 库。你的应用将会使用 OS 上最新的库，你的代码可以持续运行而不需要重新编译。这不仅可以让开发 App 变得更加简单，还可以减少 App 的体积和启动时间。

> R：当然仅限 Apple 生态。下面还有些碎碎念（？）。

### 开源

Swift 是开源的，Apple 和外部数以百计的贡献者共同努力让 Swift 更好。

### 跨平台

Swift 已经在所有 Apple 平台和 Linux 上得到支持，并且社区在努力让更多平台支持 Swift。SourceKit-LSP 社区同时在致力于将 Swift 支持整合到各种开发工具中。

### 服务器端

Swift 可以加强 Apple 平台的各种应用，同时它也可以用来制作新型现代服务器应用。Swift 可以完美支持追求运行时安全性、编译性能和小内存占用率的服务器端应用。

## Playgrounds 和交互解释器

诸如 iPad 的 Swift Playgrounds 和 Xcode 的 playgrounds 可以让写 Swift 代码轻松有趣。输入一行代码，立马就能得到结果。你可以从侧边栏快速查看结果，也可以固定在代码下面显示。结果可以以图片、结果集或随时更新的图表形式显示。你可以打开 Timeline Assistant 观察复杂的演算和动画，可以很方便的试验新的 UI 代码，或者调试你的 SpriteKit 代码。当你完成了代码的调整，只需要将 playground 中的代码移到你的项目中即可。Swift 在你使用命令行或者 Xcode 的 LLDB Debug 控制台时可以进行交互解释。使用 Swift 和正在运行的应用进行交互和计算，或者写一段新的代码来看看它是如何像脚本语言一样工作。

## 包管理

Swift Package Manager 是一个独立的跨平台工具，提供构建、运行、测试和打包功能。Swift 包是发布你的库和代码的最好方式。包的配置用 Swift 编写，可以简单的配置对象，声明产品和管理依赖。在 Swift 5 中，run 命令可以在 REPL 导入库，而不需要构建一个可执行文件。Swift Package Manager 本身作为 Swift 开源项目的一个包，使用 Swift 编写。

## Objective-C 互通性

如今你可以使用 Swift 构建一个完整的应用，或者使用 Swift 为你的应用开发新的功能。Swift 可以和你现有的 Objective-C 文件共存，并且可以完整的访问 Objective-C 的 API，适配更加简单。

# 相关

> 2.[Swift Syntax Basics (字符串和变量)](<https://github.com/zfanli/notes/blob/master/swift/2.SyntaxBasics(Strings&Variables).md>)
