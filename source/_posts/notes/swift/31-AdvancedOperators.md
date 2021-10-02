---
title: 31.Swift Advanced Operators
tags:
  - Swift
date: '2019-07-14T17:28:35.099Z'
categories:
  - notes
  - swift
---

高级操作符感觉通篇都让人感觉到 `Awwwwwwwa`，还可以这么玩。

你可以给你的类型自定义各种操作符下的实现。很棒吧。

这篇内容讲述了一些不常用但是用到就会觉得很方便的操作符。

包括位操作符，可以按位操作和位移操作。

溢出操作符，可以让数值溢出但是不报错。

自定义操作符。自定义自己的操作符。

到此语法指南就结束了。但是我仍然没看到多线程话题，Swift 没有多线程？

<!-- more -->

## 高级操作符

Swift 中除了之前基础操作符章节描述的操作符之外，还有一些高级操作符用来处理更复杂的值操作。包括 C 或者 Objective-C 中你可能会熟悉的位操作符。

不同于 C，Swift 的算术操作符不存在溢出。溢出行为被视作一个陷阱并被作为错误报告。你如果选择使用溢出行为，使用 Swift 中第二套算术操作符，比如可以溢出的加法操作符 `&+`。这些操作符都以 `&` 开头。

这些操作符在你给自定义类型定制 Swift 标准操作符操作行为时比较有用。你可以给你自己定义的类型定制一套量身定做的实现来处理它们使用 Swift 标准操作符时的行为。

预定义的操作符没有限制，Swift 允许你定义自己的操作符。

### 按位非

操作符是 `~`，用来二进制取反。看例子。

```swift
let initialBits: UInt8 = 0b00001111
let invertedBits = ~initialBits  // equals 11110000
```

### 按位与

操作符是 `&`，二进制与。看例子。

```swift
let firstSixBits: UInt8 = 0b11111100
let lastSixBits: UInt8  = 0b00111111
let middleFourBits = firstSixBits & lastSixBits  // equals 00111100
```

### 按位或

操作符是 `|`，二进制或。看例子。

```swift
let someBits: UInt8 = 0b10110010
let moreBits: UInt8 = 0b01011110
let combinedbits = someBits | moreBits  // equals 11111110
```

### 按位异或

操作符是 `^`，二进制异或。

```swift
let firstBits: UInt8 = 0b00010100
let otherBits: UInt8 = 0b00000101
let outputBits = firstBits ^ otherBits  // equals 00010001
```

### 按位左偏移·右偏移

数字有无符号影响按位偏移行为。

对于无符号的数字：

- 位根据要求向左右偏移；
- 超过边界的数字被抛弃；
- 空位补零。

看例子。

```swift
let shiftBits: UInt8 = 4   // 00000100 in binary
shiftBits << 1             // 00001000
shiftBits << 2             // 00010000
shiftBits << 5             // 10000000
shiftBits << 6             // 00000000
shiftBits >> 2             // 00000001
```

你可以在其他数据类型上使用位偏移。

```swift
let pink: UInt32 = 0xCC6699
let redComponent = (pink & 0xFF0000) >> 16    // redComponent is 0xCC, or 204
let greenComponent = (pink & 0x00FF00) >> 8   // greenComponent is 0x66, or 102
let blueComponent = pink & 0x0000FF           // blueComponent is 0x99, or 153
```

上面的例子实际上做的是将一个 pink 颜色值 16 进制转换成三个数字对于 RGB 颜色值。三个 `&` 操作是为了做一个遮罩，只留下 `FF` 位置的值，后面的位移操作是为了降位，因为 RGB 是三个最大为 255 或者 FF 的值。

如果一个数字有符号，行为会稍微不一样。

有符号的数字用第一位表示正负号。但是负数的表述和正数相反，比如 `1111100` 是 124，但是如果符号位是 1，即 `11111100`，则表述的是 -4。无符号时数值是字面量，负数时 1 表示 0 ，0 表示 1。

对负数来说向右位移左边补 1，向左位移符号位不变，右边补 0。

### 溢出操作符

默认情况下当你复制一个超过类型容纳上限的值给一个变量，Swift 不会创建它，并且会报错。这是一个安全保障。

```swift
var potentialOverflow = Int16.max
// potentialOverflow equals 32767, which is the maximum value an Int16 can hold
potentialOverflow += 1
// this causes an error
```

此时需要进行错误处理。

不过如果你要做的就是按位裁切，你可以使用另一套算数操作符。

- Overflow addition (&+)
- Overflow subtraction (&-)
- Overflow multiplication (&\*)

### 值溢出

下面例子对 8 位最大数字加 1 导致值溢出，溢出位抛弃，留下的值就是 0。无符号。

```swift
var unsignedOverflow = UInt8.max
// unsignedOverflow equals 255, which is the maximum value a UInt8 can hold
unsignedOverflow = unsignedOverflow &+ 1
// unsignedOverflow is now equal to 0
```

下面的例子对 8 位最小数字减 1，导致溢出，值变成 255。这是对无符号数来说的。

```swift
var unsignedOverflow = UInt8.min
// unsignedOverflow equals 0, which is the minimum value a UInt8 can hold
unsignedOverflow = unsignedOverflow &- 1
// unsignedOverflow is now equal to 255
```

如果有符号，最小数减 1，还是变成最大数。

```swift
var signedOverflow = Int8.min
// signedOverflow equals -128, which is the minimum value an Int8 can hold
signedOverflow = signedOverflow &- 1
// signedOverflow is now equal to 127
```

### 优先和结合

操作符有优先顺序，看看下面的例子，优先顺序和数学上定义一致。

```swift
2 + 3 % 4 * 5
// this equals 17
```

取余数和乘法操作符优先度高于加法，所以加法会最后执行。

### 操作符方法

结构体和类可以对现有操作符进行自己的实现。这被称作现有操作符重载。

```swift
struct Vector2D {
    var x = 0.0, y = 0.0
}

extension Vector2D {
    static func + (left: Vector2D, right: Vector2D) -> Vector2D {
        return Vector2D(x: left.x + right.x, y: left.y + right.y)
    }
}
```

上面的例子定义了对 Vector2D 类型对数据进行加法操作的实现。

通过对两个实例进行加法操作你可以得到预期的结果。

```swift
let vector = Vector2D(x: 3.0, y: 1.0)
let anotherVector = Vector2D(x: 2.0, y: 4.0)
let combinedVector = vector + anotherVector
// combinedVector is a Vector2D instance with values of (5.0, 5.0)
```

### 前缀和后缀操作符

下面定义一个前缀一元操作符。

```swift
extension Vector2D {
    static prefix func - (vector: Vector2D) -> Vector2D {
        return Vector2D(x: -vector.x, y: -vector.y)
    }
}
```

通过这样定义，我们可以对 Vector2D 取反。

```swift
let positive = Vector2D(x: 3.0, y: 4.0)
let negative = -positive
// negative is a Vector2D instance with values of (-3.0, -4.0)
let alsoPositive = -negative
// alsoPositive is a Vector2D instance with values of (3.0, 4.0)
```

### 组合操作符

下面定义一个组合操作符，其实定义和加法一样。区别在于左边是 In-Out 参数，直接修改它的值。

```swift
extension Vector2D {
    static func += (left: inout Vector2D, right: Vector2D) {
        left = left + right
    }
}

var original = Vector2D(x: 1.0, y: 2.0)
let vectorToAdd = Vector2D(x: 3.0, y: 4.0)
original += vectorToAdd
// original now has values of (4.0, 6.0)
```

> R：等号操作符和三元操作符无法重载。关于赋值操作符只有类似 += 的组合操作符可以重载。

### 等价比较操作符

可以用双等号判断。一般我们自己实现 == 操作符，标准库会默认实现 !=，实现的方式就是对 == 的结果取反。

```swift
extension Vector2D: Equatable {
    static func == (left: Vector2D, right: Vector2D) -> Bool {
        return (left.x == right.x) && (left.y == right.y)
    }
}

let twoThree = Vector2D(x: 2.0, y: 3.0)
let anotherTwoThree = Vector2D(x: 2.0, y: 3.0)
if twoThree == anotherTwoThree {
    print("These two vectors are equivalent.")
}
// Prints "These two vectors are equivalent."
```

上面的例子自己实现了 == 操作，实际上满足下面的情况标准库可以自动帮助我们实现。

- 实现 `Equatable` 协议的结构体只有储值属性；
- 枚举类型只有实现了 `Equatable` 协议的关联值；
- 枚举类型没有关联值。

下面是自动实现的例子。

```swift
struct Vector3D: Equatable {
    var x = 0.0, y = 0.0, z = 0.0
}

let twoThreeFour = Vector3D(x: 2.0, y: 3.0, z: 4.0)
let anotherTwoThreeFour = Vector3D(x: 2.0, y: 3.0, z: 4.0)
if twoThreeFour == anotherTwoThreeFour {
    print("These two vectors are also equivalent.")
}
// Prints "These two vectors are also equivalent."
```

### 自定义操作符

自定义操作符用 `operator` 关键字配合 `prefix`、`infix` 或 `postfix` 关键字声明，需要在全局作用域。

```swift
prefix operator +++
```

注意这样声明只是告诉 Swift 存在一个这样的操作符，但是它并没有其他含义。然后我们再对具体的类型实现这个操作符的操作。

```swift
extension Vector2D {
    static prefix func +++ (vector: inout Vector2D) -> Vector2D {
        vector += vector
        return vector
    }
}

var toBeDoubled = Vector2D(x: 1.0, y: 4.0)
let afterDoubling = +++toBeDoubled
// toBeDoubled now has values of (2.0, 8.0)
// afterDoubling also has values of (2.0, 8.0)
```

### 自定义中缀操作符优先级

中缀操作符需要定义优先级分组。一个优先级分组表示这个中缀操作符在执行时的优先顺序。默认优先级分组是高于二元操作符的。下面定义了一个操作符 +- 并设定为 `AdditionPrecedence` 优先级。

```swift
infix operator +-: AdditionPrecedence
extension Vector2D {
    static func +- (left: Vector2D, right: Vector2D) -> Vector2D {
        return Vector2D(x: left.x + right.x, y: left.y - right.y)
    }
}
let firstVector = Vector2D(x: 1.0, y: 2.0)
let secondVector = Vector2D(x: 3.0, y: 4.0)
let plusMinusVector = firstVector +- secondVector
// plusMinusVector is a Vector2D instance with values of (4.0, -2.0)
```

> R：文档提示，你不需要给前缀和后缀操作符设定优先级，但是如果你同时使用前缀和后缀操作一个元素，那么后缀会先执行。

# 相关

> 30.[Swift Access Control](https://github.com/zfanli/notes/blob/master/swift/30.AccessControl.md)
