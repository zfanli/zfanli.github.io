---
title: 29.Swift Memory Safety
tags:
  - Swift
date: '2019-07-14T15:28:35.099Z'
categories:
  - notes
  - swift
---

内存安全依然不需要我们多做考虑。本篇最大的目的还是了解什么情况下会出现内存不安全的问题，并且在编码时避免这些问题。由于目前为止没有涉及到协程或多线程的内容，要保重内存安全相对来说是简单的。

内存访问存在三个属性：操作是读还是写；操作持续多久；操作哪个内存位置。

一旦后两者出现重叠，也就是说对同一个内存位置同时进行操作，那么就会出现内存不安全的冲突情况。

<!-- more -->

需要注意的是元组、结构体或者枚举类型等值类型的数据，它们的属性都是本身的一部分，被储存在同一个内存位置。所以如果同时对它们的多个属性进行修改的时候，实际上是属于对同一个内存位置同时进行修改的，所以是冲突的。

但是对结构体来说，可能多数重叠操作是安全的。原则上编译器能提供证明操作安全，操作就是可以执行的。比如如果一个结构体声明在局部作用域，对这个结构体的多个属性操作编译器可以证明操作安全所以允许。

## 内存安全性

默认情况下 Swift 会阻止你代码中的不安全的行为。例如 Swift 保证每个变量在被使用之前进行初始化，内存在被释放后不可访问，数组索引会检测边界。

通过要求修改内存的代码对内存进行独占访问，Swift 也可以保证对同一个内存区域进行多次访问不会冲突。因为 Swift 自动管理内存，大部分时间你根本不需要思考内存管理的问题。但是理解可能会发生的潜在冲突，可以帮助你避免编写冲突的内存访问代码。要知道，如果你的代码中存在冲突，在编译时或者运行时会报错。

### 理解内存访问的冲突

在你给变量赋值或给函数传参数时，就会发生内存访问。例如下面的代码进行了读写访问。

```swift
// A write access to the memory where one is stored.
var one = 1

// A read access from the memory where one is stored.
print("We're number \(one)!")
```

当你的代码试图多处同时对一个内存进行访问时就可能发生冲突。对同一个内存位置同时进行多次访问可能会造成不可预计的、或是矛盾的行为。在 Swift 中有很多方式跨很多行去修改一个值，这导致在它自己的修改过程中访问这个值是可能的。但是这是有问题的。

设想一个场景，你在纸上记账，可能步骤是：先写下账目；再更新合计金额。这时如果有人在你写账目的时候要求查看合计金额，那么你记账前的金额是对方想要的吗？还是你记账结束后的总额才是对方想要的？这是取决于对方的意图的。

### 内存访问的特性

内存访问存在三个特性：

- 是写入还是读取；
- 持续多久；
- 内存的位置。

如果你有两个操作满足下面的条件，那么就会发生冲突：

- 至少一个是写入操作；
- 访问相同的内存位置；
- 持续时间有交叠。

读和写的操作的区别很明显：读操作不修改内存；写操作修改内存。而内存位置指你现在访问的是什么，可以是一个变量、常量或者是属性。持续时间分为即时和长期两种。

即时访问不允许在其开始访问和结束访问一个内存位置之间让其他代码访问该内存位置。因此，两个即时访问无法同时发生在一个内存位置。例如下面的所有读写操作都是即时完成的。

```swift
func oneMore(than number: Int) -> Int {
    return number + 1
}

var myNumber = 1
myNumber = oneMore(than: myNumber)
print(myNumber)
// Prints "2"
```

而然还是有很多方式可以在其他代码执行期间对内存进行长久访问。长期访问的意思是在开始修改一个内存位置之后到修改结束这段时间内，还是允许其他代码执行的，这中间的过程就是一个交叠。一个长期访问可以和其他长期访问和即时访问进行交叠。

> R：这感觉有点像异步。

### 访问 In-Out 参数时的冲突

函数对它的 In-Out 参数有长久写入的权利。写入权限从 In-Out 参数得到赋值开始一直持续到函数调用结束。如果函数有多个 In-Out 参数，写入权限以它们出现的顺序开始。

这导致了一个结果就是你无法在函数中访问 In-Out 参数的原始变量。无论是作用域规则或者访问权限允许你这样做。所有对原始变量的访问将报错。

```swift
var stepSize = 1

func increment(_ number: inout Int) {
    number += stepSize
}

increment(&stepSize)
// Error: conflicting accesses to stepSize
```

上面的例子就是这样的。函数中使用了 stepSize 变量，那么它就不能作为 In-Out 参数传进来了，它违反了规则。因为对 stepSize 所在的内存位置同时进行了两次读写操作。一次是读取它的值，同时还要写入新的值。这两个操作交叠导致了失败。这个现象是你不能又读又改同一个内存。

解决这个问题的方法是做一个显式的拷贝。

```swift
// Make an explicit copy.
var copyOfStepSize = stepSize
increment(&copyOfStepSize)

// Update the original.
stepSize = copyOfStepSize
// stepSize is now 2
```

这样同样对 stepSize 进行了一次读和一次写的操作，但是读操作在写之前就完成了，它们没有冲突。

下面还有一个例子展示了当函数有多个 In-Out 参数时，不能传递相同的变量。

```swift
func balance(_ x: inout Int, _ y: inout Int) {
    let sum = x + y
    x = sum / 2
    y = sum - x
}
var playerOneScore = 42
var playerTwoScore = 30
balance(&playerOneScore, &playerTwoScore)  // OK
balance(&playerOneScore, &playerOneScore)
// Error: conflicting accesses to playerOneScore
```

这里对同一个变量执行两次写操作，这是不能实现的，所以会报错。

### 在方法中访问 self 导致冲突

结构体的 mutating 方法在被调用的期间对 `self` 是有写入权限的。设想下面的例子，每个 Player 都有两个属性，一个是生命值，一个是能量。生命值在受到伤害时减少，能量在使用特殊技能时减少。

```swift
struct Player {
    var name: String
    var health: Int
    var energy: Int

    static let maxHealth = 10
    mutating func restoreHealth() {
        health = Player.maxHealth
    }
}
```

上面的例子中有一个 `restoreHealth()` 方法，在调用它到它执行结束的期间里有对 `self` 的写入权限。它对作用是恢复一个玩家对生命值到最大值。目前来看没有其他方法会修改 Player 的属性导致与这个方法交叠。我们添加一个方法 `shareHealth(with:)`，这样就可能会发生交叠的情况了。

```swift
extension Player {
    mutating func shareHealth(with teammate: inout Player) {
        balance(&teammate.health, &health)
    }
}

var oscar = Player(name: "Oscar", health: 10, energy: 10)
var maria = Player(name: "Maria", health: 5, energy: 10)
oscar.shareHealth(with: &maria)  // OK
```

这个方法有一个 In-Out 参数，并且调用之前定义的 `balance(_:_:)` 方法平衡两个玩家的生命值。上面的例子中平衡了 oscar 和 maria 的生命值，发生了两次写入操作，但是由于是分别对 oscar 和 maria 各自进行了一次写入，所以不发生冲突。这两次写入在时间上确实有交叠，但是修改对内存位置是不同的。

但是如果你用 oscar 去平衡 oscar 的生命中，那么就冲突了。

```swift
oscar.shareHealth(with: &oscar)
// Error: conflicting accesses to oscar
```

原因是在 `shareHealth(with:)` 方法中会进行两次长期访问，一个是对 `self` 的，一个是对 In-Out 参数的。首先这两个长期访问在持续时间上是重叠的，现在这两个对象还处于同一个内存位置，然后还将同时进行两次写入操作。这完全冲突了。

### 访问属性的冲突

像结构体、元组和枚举等类型都是由不同的值组成的，比如结构体的属性和元组的元素，都可以是不同类型的。但是由于其实值类型，对其元素进行写入操作要求访问整个值。对一个元组对两个元素进行重叠对写入访问将造成冲突。

```swift
var playerInformation = (health: 10, energy: 20)
balance(&playerInformation.health, &playerInformation.energy)
// Error: conflicting access to properties of playerInformation
```

上面的例子中对元组 playerInformation 的两个属性调用了 `balance(_:_:)` 方法造成了冲突，原因是在 `balance(_:_:)` 方法中它会对两个 In-Out 参数进行写入操作。元组是值类型，元组及其元素是储存在同一个内存位置的，所以这个操作虽然针对元组对两个元素操作，但是实际上还是针对同一个内存位置同时要进行两次写入操作，所以导致冲突。

在全局作用域中结构体也会同样报错。下面对例子中对结构体的两个属性进行修改，这实际上还是对同一个内存位置进行两次写入要求。

```swift
var holly = Player(name: "Holly", health: 10, energy: 10)
balance(&holly.health, &holly.energy)  // Error
```

但是在实践中，结构体的大多数重叠的写入操作是安全的。例如如果将上面例子的 holly 放在一个局部作用域操作，编译器就能保证对这个结构体的属性进行重叠操作是安全的：

```swift
func someFunction() {
    var oscar = Player(name: "Oscar", health: 10, energy: 10)
    balance(&oscar.health, &oscar.energy)  // OK
}
```

这个例子和之前不同之处在于结构体声明在局部作用域中，编译器可以保证即使重叠的两次写入操作也是安全的，所以不会报错。

对结构体来说，对属性交叠访问的限制可能不是内存安全必须的。内存安全是预期的保证，但是独占访问是更严格的要求，意思是有些代码保证来内存安全但是却不是独占访问。在编译器能保证非独占访问时仍然是内存安全时，Swift 允许这样的操作。如果下面的条件满足，编译器就能保证结构体属性重叠操作是安全的。

- 你仅访问了储值属性而非计算属性；
- 结构体是局部变量而非全局变量；
- 结构体没有被闭包捕获，或者结构体只被非逃逸闭包（nonescaping closures）捕获。

如果编译器不能证明操作安全，那操作就不被允许。

# 相关

> 28.[Swift Automatic Reference Counting](https://github.com/zfanli/notes/blob/master/swift/28.AutomaticReferenceCounting.md)
>
> 30.[Swift Access Control](https://github.com/zfanli/notes/blob/master/swift/30.AccessControl.md)
