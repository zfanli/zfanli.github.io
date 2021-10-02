---
title: 12.Swift Strings and Characters
tags:
  - Swift
date: '2019-06-27T13:28:35.099Z'
categories:
  - notes
  - swift
---

字符串相较其他语言没有太多不同点。Swift 有类似 Python 的三引号字符串允许换行。Swift 的字符串是基于 Unicode 驱动，所以虽然字符串可以用索引提取字符，但是由于每个字符字节数不同不能使用整数作为索引，编辑索引的方式稍有特殊。其他的比如拼接、截取、非空判断、前缀后缀等都没有太大区别。看下面的代码示例足够了。

<!-- more -->

## 字符串和字符

### 操作字符串

多行字符串使用三引号 `"""`。如果只是为了方便阅读换行，实际上字符串不需要换行符时，使用反斜杠换行。

```swift
let softWrappedQuotation = """
The White Rabbit put on his spectacles.  "Where shall I begin, \
please your Majesty?" he asked.

"Begin at the beginning," the King said gravely, "and go on \
till you come to the end; then stop."
"""
```

这将储存两行字符串。最后的三引号可以缩进，字符串内容可以根据三引号缩进的长度加入缩进，而不会将多余的空格包含在字符串里。如果行前行后需要换行，则在行前行后加空行。

```swift
let lineBreaks = """

This string starts with a line break.
It also ends with a line break.

"""
```

缩进的时候。下面这样写不会有多余的空格。

```swift
let lineBreaks = """

    This string starts with a line break.
    It also ends with a line break.

    """
```

字符串中有下面这些特殊字符。

- 转意特殊字符，`\0` 空字符串，`\\` 反斜杠，`\t` tab，`\n` line feed，`\r` 回车，`\"` 双引号，`\'` 单引号。
- Unicode 字符 `\u{n}`。n 是 1-8 位的十六进制数字。

```swift
let wiseWords = "\"Imagination is more important than knowledge\" - Einstein"
// "Imagination is more important than knowledge" - Einstein
let dollarSign = "\u{24}"        // $,  Unicode scalar U+0024
let blackHeart = "\u{2665}"      // ♥,  Unicode scalar U+2665
let sparklingHeart = "\u{1F496}" // 💖, Unicode scalar U+1F496
```

声明一个空字符串。

```swift
var emptyString = ""               // empty string literal
var anotherEmptyString = String()  // initializer syntax
// these two strings are both empty, and are equivalent to each other
```

判断一个字符串是否为空。

```swift
if emptyString.isEmpty {
    print("Nothing to see here")
}
// Prints "Nothing to see here"
```

修改字符串。

```swift
var variableString = "Horse"
variableString += " and carriage"
// variableString is now "Horse and carriage"

let constantString = "Highlander"
constantString += " and another Highlander"
// this reports a compile-time error - a constant string cannot be modified
```

字符串的传递是复制值。每一个新的拷贝都是独立存在的实例，相互之间没有关联，这意味着你将一个字符串传递给另一个变量之后，你对其做的修改不会影响到其拷贝上。

### 操作字符

可以使用 for-in 对字符串的每一个字符进行遍历。

```swift
for character in "Dog!🐶" {
    print(character)
}
// D
// o
// g
// !
// 🐶
```

如果要声明一个字符变量需要提供类型。

```swift
let exclamationMark: Character = "!"
```

字符数组可以初始化一个字符串。

```swift
let catCharacters: [Character] = ["C", "a", "t", "!", "🐱"]
let catString = String(catCharacters)
print(catString)
// Prints "Cat!🐱"
```

### 链接字符串

可以用字符串的 append 方法将一个字符加入到字符串。

```swift
let string1 = "hello"
let string2 = " there"
var welcome = string1 + string2
// welcome now equals "hello there"
let exclamationMark: Character = "!"
welcome.append(exclamationMark)
// welcome now equals "hello there!"
```

如果你用多行字符串编辑一个列表，希望每一个元素占一行，那么你需要在最后留空一行才会加入一个换行符在字符串的结尾。

```swift
let badStart = """
one
two
"""
let end = """
three
"""
print(badStart + end)
// Prints two lines:
// one
// twothree

let goodStart = """
one
two

"""
print(goodStart + end)
// Prints three lines:
// one
// two
// three
```

### 字符串插值

模版字符串。

```swift
let multiplier = 3
let message = "\(multiplier) times 2.5 is \(Double(multiplier) * 2.5)"
// message is "3 times 2.5 is 7.5"
```

### 字符计数

字符串的 `.count` 可以获得字符的计数。

```swift
let unusualMenagerie = "Koala 🐨, Snail 🐌, Penguin 🐧, Dromedary 🐪"
print("unusualMenagerie has \(unusualMenagerie.count) characters")
// Prints "unusualMenagerie has 40 characters"
```

swift 对 character 类型值使用扩展的字位簇（grapheme clusters），这意味着字符串的拼接和修改并不总是会影响字符串的长度。例如给 `cafe` 这个单词加上法语的重音符号，修改后的字符串仍然是 4 位。

```swift
var word = "cafe"
print("the number of characters in \(word) is \(word.count)")
// Prints "the number of characters in cafe is 4"

word += "\u{301}"    // COMBINING ACUTE ACCENT, U+0301

print("the number of characters in \(word) is \(word.count)")
// Prints "the number of characters in café is 4"
```

### 字符串的访问和修改

你可以通过它的方法、属性甚至是下标来访问和修改字符串。

不过通过索引的方式访问字符串比较特殊，因为每个字符可能使用不同量的内存储存，所以想要知道哪个字符在哪个为止，需要对字符串进行遍历才行。Swift 对字符串索引无法用一个整数来表示。

`startIndex` 属性可以得到字符串索引的开始，`endIndex` 表示结束，结束的值是不包含的。所以 `endIndex` 不能作为下标取字符串中的字符。如果字符串为空，则 `startIndex` 和 `endIndex` 相等。

想通过下标拿字符串的字符，可以使用字符串的 `.index(before:)`、`.index(after:)` 和 `.index(_:offsetBy:)` 方法拿到索引值，用索引值去拿字符。

```swift
let greeting = "Guten Tag!"
greeting[greeting.startIndex]
// G
greeting[greeting.index(before: greeting.endIndex)]
// !
greeting[greeting.index(after: greeting.startIndex)]
// u
let index = greeting.index(greeting.startIndex, offsetBy: 7)
greeting[index]
// a
```

下标越界会在运行时报错。

```swift
greeting[greeting.endIndex] // Error
greeting.index(after: greeting.endIndex) // Error
```

```swift
for index in greeting.indices {
    print("\(greeting[index]) ", terminator: "")
}
// Prints "G u t e n   T a g ! "
```

插入和移除字符。

```swift
var welcome = "hello"
welcome.insert("!", at: welcome.endIndex)
// welcome now equals "hello!"

welcome.insert(contentsOf: " there", at: welcome.index(before: welcome.endIndex))
// welcome now equals "hello there!"

welcome.remove(at: welcome.index(before: welcome.endIndex))
// welcome now equals "hello there"

let range = welcome.index(welcome.endIndex, offsetBy: -6)..<welcome.endIndex
welcome.removeSubrange(range)
// welcome now equals "hello"
```

分隔字符串。

```swift
let greeting = "Hello, world!"
let index = greeting.firstIndex(of: ",") ?? greeting.endIndex
let beginning = greeting[..<index]
// beginning is "Hello"

// Convert the result to a String for long-term storage.
let newString = String(beginning)
```

前缀和后缀。

```swift
let romeoAndJuliet = [
    "Act 1 Scene 1: Verona, A public place",
    "Act 1 Scene 2: Capulet's mansion",
    "Act 1 Scene 3: A room in Capulet's mansion",
    "Act 1 Scene 4: A street outside Capulet's mansion",
    "Act 1 Scene 5: The Great Hall in Capulet's mansion",
    "Act 2 Scene 1: Outside Capulet's mansion",
    "Act 2 Scene 2: Capulet's orchard",
    "Act 2 Scene 3: Outside Friar Lawrence's cell",
    "Act 2 Scene 4: A street in Verona",
    "Act 2 Scene 5: Capulet's mansion",
    "Act 2 Scene 6: Friar Lawrence's cell"
]

var act1SceneCount = 0
for scene in romeoAndJuliet {
    if scene.hasPrefix("Act 1 ") {
        act1SceneCount += 1
    }
}
print("There are \(act1SceneCount) scenes in Act 1")
// Prints "There are 5 scenes in Act 1"

var mansionCount = 0
var cellCount = 0
for scene in romeoAndJuliet {
    if scene.hasSuffix("Capulet's mansion") {
        mansionCount += 1
    } else if scene.hasSuffix("Friar Lawrence's cell") {
        cellCount += 1
    }
}
print("\(mansionCount) mansion scenes; \(cellCount) cell scenes")
// Prints "6 mansion scenes; 2 cell scenes"
```

# 相关

> 11.[Swift Basic Operators](https://github.com/zfanli/notes/blob/master/swift/11.BasicOperators.md)
>
> 13.[Swift Collection Types](https://github.com/zfanli/notes/blob/master/swift/13.CollectionTypes.md)
