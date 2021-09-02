---
title: 3.Swift Syntax Basics (流程控制)
tags:
  - Swift
date: "2019-06-17T13:28:35.099Z"
---

不同于其他语言，条件判断部分不需要括号。代码块依然需要大括号包围。

用 if-let 的方式可以快速的处理可能为 `nil` 的可选变量。还可以使用三元表达式简化版 `??` 操作符在变量不存在的情况下赋予默认值。

switch 条件匹配某个 case 之后将直接跳出，不需要其他语言中的 break 关键字。case 的匹配条件不仅限于比较，还可以使用布尔表达式。

for-in 可以方便遍历字典等类型，while 可以重复代码块。

当需要范围内重复，可以使用 for-in 配合 `..<` 或 `...` 操作符定义一个区间，前者不包括右边，后者则包括。

<!-- more -->

## 流程控制

条件判断关键字：

- `if`
- `switch`

循环关键字：

- `for-in`
- `while`
- `repeat-while`

```swift
let individualScores = [75, 43, 103, 87, 12]
var teamScore = 0
for score in individualScores {
    if score > 50 {
        teamScore += 3
    } else {
        teamScore += 1
    }
}
print(teamScore)
// prints 11
```

if 条件控制语句的判断表达式必须返回一个布尔值，不存在任何隐式的比较。

在 if 语句中你可以配合使用 `let` 来处理值缺失（为 `nil`） 的场合。这些值是可选的。可选值允许是 `nil`，表示值缺失。在类型后面写一个问好（`?`）表示该值是可选的。

```swift
var optionalString: String? = "Hello"
print(optionalString == nil)
// prints false

var optionalName: String? = "John Appleseed"
var greeting = "Hello!"
if let name = optionalName {
    greeting = "Hello, \(name)"
}
```

这时，如果 `optionalName` 的值为 `nil`，则条件判断结果为 false，大括号内的代码块会被跳过。如果不为 `nil`，`optionalName` 的值会赋值给常量 `name`，并且在这段代码块的作用域中有效。

另一个处理可选值的方法是使用 `??` 操作符，如果可选值缺失了，将会自动使用默认值。

```swift
let nickName: String? = nil
let fullName: String = "John Appleseed"
let informalGreeting = "Hi \(nickName ?? fullName)"
// prints "Hi John Appleseed"
```

switch 条件语句支持所有类型的数据和广泛的比较操作符，不仅限于整型或相等。

```swift
let vegetable = "red pepper"
switch vegetable {
    case "celery":
        print("Add some raisins and make ants on a log.")
    case "cucumber", "watercress":
        print("That would make a good tea sandwich.")
    case let x where x.hasSuffix("pepper"):
        print("Is it a spicy \(x)?")
    default:
        print("Everything tastes good in soup.")
}
```

> R：移除 default 会得到报错：Switch must be exhaustive。提示 switch 必须完整，就是说要包括所有场合。

在 Swift 中，switch 执行完某一个 case 将直接推出判断，所以你不需要给每个 case 写上 `break` 手动跳出。

> R：这有别于大部分的语言。

使用 `for-in` 遍历一个字典数据时需要提供一对变量名储存 key 和 value。字典类型是一个随机集合，所以对其进行遍历会采用任意的顺序。

```swift
let interestingNumbers = [
    "Prime": [2, 3, 5, 7, 11, 13],
    "Fibonacci": [1, 1, 2, 3, 5, 8],
    "Square": [1, 4, 9, 16, 25],
]
var largest = 0
for (kind, numbers) in interestingNumbers {
    for number in numbers {
        if number > largest {
            largest = number
        }
    }
}
print(largest)
// prints 25
```

使用 `while` 循环一段代码，直到判断条件改变。将循环判断条件放在最后可以保证代码至少执行一次。

```swift
var n = 2
while n < 100 {
    n *= 2
}
print(n)
// prints 128

var m = 2
repeat {
    m *= 2
} while m < 100
print(m)
// prints 128
```

> R：repeat-while 相当于 Java 里的 do-while。

循环一个范围，使用 `..<` 语法。

```swift
var total = 0
for i in 0..<4 {
    total += i
}
print(total)
// prints 6
```

`..<` 操作符包含左边不包含右边，如果希望包含右边，使用 `...` 操作符。

> R：那个小于号似乎就代表着从左边的数字开始递增到不满足小于右边的条件为止。

# 相关

> 2.[Swift Syntax Basics (字符串和变量)](<https://github.com/zfanli/notes/blob/master/swift/2.SyntaxBasics(Strings&Variables).md>)
>
> 4.[Swift Syntax Basics (函数和闭包)](<https://github.com/zfanli/notes/blob/master/swift/4.SyntaxBasics(Functions&Closures).md>)
