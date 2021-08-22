---
title: 6.Swift Syntax Basics (枚举类型和结构体)
tags:
  - Swift
date: "2019-06-19T14:28:35.099Z"
---

Swift 中的枚举类型看上去颇为强大。有点让我对枚举类型产生类改观。

Swift 的枚举类型有三种属性，一个 case 值；每个 case 还可以拥有一个原始值，这个值在所有实例中是相同的；每个 case 还可以定义关联值，关联值在创建 case 实例的时候定义，每个实例是不一样的。枚举类型可以有方法。

结构体和类非常类似，同样有属性有方法，还有初始化器，与类相比最大的不同在于结构体的传递是复制，而类是引用。在 Java 或者 JS 中，一个对象传递给另一个方法之后，对原始对象进行操作还是会反应到全局上，其原因是变量只定位到对象到引用，而结构体不同，变量与对象直接绑定，变量传递的也是复制后的新对象，传递前后的对象互为独立的个体，不会相互影响。

结构体和类可以轻易区分使用场景。但是枚举类型也可以有方法，这样看上去它和类也很相似，除了它不能拥有属性之外。

<!-- more -->

## 枚举类型和结构体

使用 `enum` 创建一个枚举类型。枚举类型可以像类或其他类型一样拥有相关的方法。

```swift
enum Rank: Int {
    case ace = 1
    case two, three, four, five, six, seven, eight, nine, ten
    case jack, queen, king

    func simpleDescription() -> String {
        switch self {
            case .ace:
                return "ace"
            case .jack:
                return "jack"
            case .queen:
                return "queen"
            case .king:
                return "king"
            default:
                return String(self.rawValue)
        }
    }
}
let ace = Rank.ace
// ace
let aceRawValue = ace.rawValue
// 1
```

默认情况 Swift 会给枚举类型的每个类型从 0 开始赋值，你可以显式的赋值改变这个行为。上面的例子中，ace 被显式赋值为 1，所以剩余的类型根据顺序从 1 开始赋值。也可以使用字符串或者浮点数来作为枚举类型的原始值。使用 `rawValue` 来访问一个枚举类型的原始值。

使用 `init?(rawValue:)` 初始化器来取得一个指定原始值的枚举类型。如果这个枚举类型存在匹配该原始值的 case 则返回该 case，否则会返回 `nil`。

```swift
if let convertedRank = Rank(rawValue: 3) {
    let threeDescription = convertedRank.simpleDescription()
}
```

> R：`init?(rawValue:)` 的 `init?` 感觉是可选的初始化器。就类似于构造器的使用，初始化器的使用也是以类名后面加括号的方式。枚举类型相当于一个特使的类。

枚举类型中 case 的值是一个实际的值，而不是指它的原始值。实际上如果没有必要的话，举类型可以不设定原始值。

```swift
enum Suit {
    case spades, hearts, diamonds, clubs

    func simpleDescription() -> String {
        switch self {
            case .spades:
                return "spades"
            case .hearts:
                return "hearts"
            case .diamonds:
                return "diamonds"
            case .clubs:
                return "clubs"
        }
    }
}
let hearts = Suit.hearts
let heartsDescription = hearts.simpleDescription()
// "hearts"
```

上面的例子中，给常量 hearts 赋值时使用 `Suit.hearts` 的方式，但是在 Suit 内部访问某个 case 时，使用 `.hearts` 省略了 Suit。这是两种引用方式，通常如果值的类型是已知的，你都可以使用省略点前面的形式。这时值会从 self 对象中读取。

> R：在 Suit 中访问自身的 case 可以省略主体，这时点前面被省略的部分应该是 `self`。

枚举类型的 case 的原始值对每个枚举类型的实例来说都是相同的。但是枚举类型也可以给每个 case 定义关联的值，这些值是在你声明一个枚举类型对象时定义的，它们可以是不相同的。这可以看作是枚举类型 case 储存的属性。例如，从服务器请求日出和日落的时间，此时服务器可能会返回请求的信息，也可能返回一个报错信息。

```swift
enum ServerResponse {
    case result(String, String)
    case failure(String)
}

let success = ServerResponse.result("6:00 am", "8:09 pm")
let failure = ServerResponse.failure("Out of cheese.")

switch success {
    case let .result(sunrise, sunset):
        print("Sunrise is at \(sunrise) and sunset is at \(sunset).")
    case let .failure(message):
        print("Failure...  \(message)")
}
```

注意日出日落时间是如何从枚举类型的 case 中提取出来的。

> R：这看上去是没见过的套路。枚举类型的 case 可以存储变量，这些变量在创建这些 case 相应的实例的时候赋值，并且可以通过 switch 读取出来。看上去很适合做数据修改时的 payload。

使用 `struct` 创建一个结构体。结构体和类很相似，可以拥有方法和初始化器。结构体和类最大的不同之处在于，结构体的传递永远是复制数据，而类的传递只传递引用。

```swift
struct Card {
    var rank: Rank
    var suit: Suit
    func simpleDescription() -> String {
        return "The \(rank.simpleDescription()) of \(suit.simpleDescription())"
    }
}
let threeOfSpades = Card(rank: .three, suit: .spades)
let threeOfSpadesDescription = threeOfSpades.simpleDescription()
// "The 3 of spades"
```

> R：结构体实例化的对象是一个数据，而类实例化对象是一个引用。从 `let` 常量就可以看出来区别，结构体定义时使用 `let` 关键字时，对对象的属性进行修改会报错，编译器检测到对常量到修改，而相同情况下类则不会报错，因为其拿到的只是一个引用。看上去从安全程度上类更高一些，但是结构体应该会占用更多内存资源。

## 练习：打印一套 52 张扑克牌

```swift
extension Suit: CaseIterable {}
extension Rank: CaseIterable {}

Suit.allCases.forEach({s in
    Rank.allCases.forEach({r in
        let card = Card(rank: r, suit: s)
        print(card.simpleDescription())
    })
})
```

> R：枚举类型不能直接 for-in 遍历，这时可以让枚举类型扩展 CaseInterable 接口实现遍历功能，使用 forEach 方法遍历。

# 相关

> 5.[Swift Syntax Basics (对象和类)](<https://github.com/zfanli/notes/blob/master/swift/5.SyntaxBasics(Objects&Classes).md>)
>
> 7.[Swift Syntax Basics (枚举类型和结构体)](<https://github.com/zfanli/notes/blob/master/swift/7.SyntaxBasics(Protocols&Extensions).md>)
