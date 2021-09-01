---
title: 4.Swift Syntax Basics (函数和闭包)
tags:
  - Swift
date: "2019-06-18T13:28:35.099Z"
---

函数都明白，但是闭包是什么？其实就是匿名函数。

闭包实际上指的是一块封闭的作用域，里面有一串代码，外面影响不到里面。

而函数是闭包的一种形态，就是有名字的闭包。如果不给名字，就是匿名函数，匿名的闭包。通常同时说函数和闭包时，应该是在说一般函数和匿名函数。

在 Swift 中，闭包是头等类型的（first-class），可以作为参数接收，也可以作为返回值返回。

<!-- more -->

声明一个函数或匿名函数的时候需要定义参数和返回值，参数写在括号中，用 `->` 于返回值分隔开。匿名闭包作为回调函数时，由于类型是已知的，可以省略不写。

另外不同于 JavaScript 的箭头函数和 Java 的 Lambda 表达式，Swift 中的匿名闭包包括参数返回值定义都是写在大括号里面的，参数返回值定义和代码体之间用 `in` 关键字来分隔。

函数可以使用元组返回多个返回值。

## 函数和闭包

使用 `func` 关键字声明一个函数。使用 `->` 区分函数参数和返回值类型。

```swift
func greet(person: String, day: String) -> String {
    return "Hello \(person), today is \(day)."
}
greet(person: "Bob", day: "Tuesday")
// "Hello Bob, today is Tuesday."
```

默认情况下，函数使用参数名作为参数的标签。你可以在参数名的前面自定义标签，或者用 `_` 表示不使用标签。

```swift
func greet(_ person: String, on day: String) -> String {
    return "Hello \(person), today is \(day)."
}
greet("John", on: "Wednesday")
// "Hello John, today is Wednesday."
```

使用元组来组合值，可以用来让函数返回多个值。元组的元素可以通过名称或者索引访问。

```swift
func calculateStatistics(scores: [Int]) -> (min: Int, max: Int, sum: Int) {
    var min = scores[0]
    var max = scores[0]
    var sum = 0

    for score in scores {
        if score > max {
            max = score
        } else if score < min {
            min = score
        }
        sum += score
    }

    return (min, max, sum)
}
let statistics = calculateStatistics(scores: [5, 3, 100, 3, 9])
print(statistics.sum)
// prints 120
print(statistics.2)
// prints 120
```

> R：元组（Tuple）的概念应该是来自 Python。通过索引访问元素时是 0 基的。

函数可以嵌套。嵌套函数可以访问外面一层函数定义的变量。你可以用嵌套函数来组织一个很长的，或者很复杂的函数。

```swift
func returnFifteen() -> Int {
    var y = 10
    func add() {
        y += 5
    }
    add()
    return y
}
returnFifteen()
// 15
```

函数是头等类型的（first-class）。函数可以返回一个函数作为其返回值。

```swift
func makeIncrementer() -> ((Int) -> Int) {
    func addOne(number: Int) -> Int {
        return 1 + number
    }
    return addOne
}
var increment = makeIncrementer()
increment(7)
// 8
```

函数也可以将另一个函数作为一个参数获取。

```swift
func hasAnyMatches(list: [Int], condition: (Int) -> Bool) -> Bool {
    for item in list {
        if condition(item) {
            return true
        }
    }
    return false
}
func lessThanTen(number: Int) -> Bool {
    return number < 10
}
var numbers = [20, 19, 7, 12]
hasAnyMatches(list: numbers, condition: lessThanTen)
```

> R：支持头等函数（first-class functions）的语言可以将函数作为一个对象进行传递。动态语言中 JavaScript 和 Python 等支持，静态语言中 Golang 和 Swift 等支持，Java 不支持。

> R：然后开始讲闭包。

函数实际上是闭包的一种情况：一块代码可以在之后被执行。闭包中的代码可以访问创建闭包的作用域下可用的变量和函数，即使当你真正执行它的时候是在另一个作用域中。你已经看到了，嵌套函数就是这样的。可以创建一个匿名的闭包，使用大括号包围一块代码，用 `in` 关键字分隔参数返回值定义和代码体。

```swift
numbers.map({ (number: Int) -> Int in
    let result = 3 * number
    return result
})
```

> R：闭包一般指的是匿名函数呀。函数是有名字的闭包。

闭包可以写的更简单。如果闭包的类型是已知的，这种情况一般是指派回调函数时，你可以省略参数定义，或者返回值定义，或者全都省略。单语句的闭包隐式的将语句的结果作为返回值返回。

```swift
let mappedNumbers = numbers.map({ number in 3 * number })
print(mappedNumbers)
// prints "[60, 57, 21, 36]"
```

> R：JavaScript 和 Python 中常见的匿名函数写法。

你可以不使用变量名，使用数字来获取变量。在写简短的闭包时会非常有用。当闭包作为函数的最后一个参数时可以将闭包放在括号的外面，如果这个函数仅接收一个闭包作为参数，你甚至可以把括号都省了。

```swift
let sortedNumbers = numbers.sorted { $0 > $1 }
print(sortedNumbers)
// prints "[20, 19, 12, 7]"
```

# 相关

> 3.[Swift Syntax Basics (流程控制)](https://github.com/zfanli/notes/blob/master/swift/3.SyntaxBasicsPart2.md)
>
> 5.[Swift Syntax Basics (对象和类)](<https://github.com/zfanli/notes/blob/master/swift/5.SyntaxBasics(Objects&Classes).md>)
