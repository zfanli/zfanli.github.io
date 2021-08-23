---
title: 25.Swift Protocols
tags:
  - Swift
date: '2019-07-07T14:28:35.099Z'
categories:
  - notes
  - swift
---

关于协议的篇幅还是很足的。协议在其他语言中能找到对应的机制，比如 Java 中的接口。相应的，一些与之相关的设计模式也很类似，Java 中的面向接口编程，Swift 中也有被戏称为面向协议编程的模式。

一个协议可以由类、结构体、枚举类型来实现。但是类的情况会复杂很多，有时我们可能需要声明一个面向类的协议，而不希望结构体或者枚举类型来实现它，这时可以让协议继承 `AnyObject` 达到这一目的。而继承类该对象的协议被称作 `Class-Only` 协议。

声明实现协议的语法和类继承父类的语法是一样的，但是这里有一个复杂度存在。对于结构体和枚举类型来说，它们不存在继承关系，声明自身名称之后接冒号之后全都是协议（如果你声明协议了的话）。但是类可以继承其他的类，所以 Swift 约定，父类要写在最前面，声明完父类之后才是协议。

协议可以对属性、方法甚至初始化器进行声明要求。而所有声明实现该协议的类型都要对该协议中所有声明对要求进行满足，否则将会在编译时报错。

<!-- more -->

在协议中声明对属性和方法的要求时，就如前文提到过的，有实例属性/方法和类型属性/方法的区分。实例属性/方法是实例自身的属性/操作实例的方法，而类型属性/方法则是一个类型持有的属性/方法，这点和 Java 的静态属性和静态工具方法一致。操作上最大的区别在于，访问/调用实例属性/方法时是对实例进行操作，而访问/调用类型属性/方法时则是对类型进行操作。这反映到协议声明时，对于类型属性/方法要使用 `static` 修饰符标注。前文也提到对于类的场合，可能会使用 `static` 关键字或者 `class` 关键字修饰类型属性/方法，区别在于后者可以允许子类对父类的类型属性/方法进行 `override` 操作，但是在协议声明时始终使用 `static` 关键字表示一个类型属性/方法。

在声明方法时还有一个特殊之处，在声明指定一个方法会对实例自身进行修改时，需要对方法使用 `mutating` 修饰符。前文说明过，对于结构体和枚举类型来说，我们可以定义一个方法对其自身的属性进行修改，不过这些方法需要标注 `mutating` 修饰符声明允许修改操作，这里也是类似的。不过由于 `mutating` 修饰符是结构体和枚举类型专用的修饰符，当由类实现该协议的时候是不需要写 `mutating` 修饰符的。

协议中另外一个特殊的声明要求是初始化器。其特殊之处在于如果是由类来实现一个初始化器的要求，则必须给其标注 `required` 修饰符。这个修饰符的作用在于保证给初始化器要求提供一个显式实现或者继承实现，这样其所有子类都将实现该协议。因此，如果你的类是 final 的，你就可以不必写 `required` 修饰符，因为它不允许有子类。

协议本身属于一种类型，你可以在任何使用类型的地方使用协议，比如声明一个协议类型参数，那么所有实现该协议的类型都可以满足参数类型的需求。用协议做类型时，表示要求实现了该协议的任意类型。

委派模式是一个和协议相关的设计模式。其核心思想在于，拆分一个类或者结构体，将部分职责通过封装成协议的形式委派出去，简化主体的逻辑。这样的好处在于类或者结构体主体更倾向于一个流程控制，具体实现部分通过声明协议委派出去，本体只需要知道调用什么操作得到什么结果就够了，具体如何实现，由实现了委派协议的类型负责。这里提到一个弱引用的话题，由于篇幅限制本文没有展开，可以在后续研究一下。

此外，使用扩展机制可以给协议添加默认的实现。如果一个类型以及满足了一个协议的所有要求，这个类型只是没有声明实现这个协议，此时要声明这个类型实现了该协议，只需要用一个空的扩展进行协议实现的声明即可。

最后，还谈到了协议中声明可选要求，检查协议一致性等操作，详细还是往后细看，或者看看官方文档。

## 协议

协议相当于一张蓝图，在其中可以声明方法、属性以及其他用来完成特殊任务的要求或是功能。协议可以被类、结构体和枚举类型实现。任何一个类型只要满足了一个协议中所有声明的要求，则可以称之为符合该协议。

> R：说“实现了该协议”或许更符合我们的语言习惯。

你可以使用扩展机制对协议的部分声明要求提供实现，或者提供额外的功能让实现该协议的类型可以利用。

### 协议语法

使用下面的语法定义一个协议。

```swift
protocol SomeProtocol {
    // protocol definition goes here
}
```

结构体、枚举类型、类实现协议通过列举协议在类名之后，通过冒号隔开。

```swift
struct SomeStructure: FirstProtocol, AnotherProtocol {
    // structure definition goes here
}
```

如果要继承父类，将父类名写在所有协议的前面，用逗号隔开。

```swift
class SomeClass: SomeSuperclass, FirstProtocol, AnotherProtocol {
    // class definition goes here
}
```

### 属性要求

协议可以声明属性要求，指定要求的属性名称和类型，但是协议对要求属性可以限定的信息仅限于此，协议不能指定这个属性是否是一个计算属性。但是协议可以指定属性是否是可读取（gettable）或者可读写（gettable and settable）。

如果协议声明一个属性要求其是可读写的（gettable and settable），那么一个常量属性或是一个只读的计算属性是无法满足要求的。如果协议仅要求一个属性是可读取的（gettable），那么任何类型的属性都可以满足需求，你还可以根据需求决定这个属性是否可写入（settable）。

协议中定义要求的属性必须要用 `var` 关键字。指定其是否可读写使用 `{ get set }` 的方式。例子如下。

```swift
protocol SomeProtocol {
    var mustBeSettable: Int { get set }
    var doesNotNeedToBeSettable: Int { get }
}
```

在协议中定义静态类型属性要求时必须要加上 `static` 关键字前缀。即使当一个类在实现这个协议时可能会给属性添加上 `class` 或者 `static` 关键字前缀，在协议中也要用 `static` 关键字声明。

```swift
protocol AnotherProtocol {
    static var someTypeProperty: Int { get set }
}
```

> R：实例属性和类型属性是两种作用域不同的属性。前者每个实例独立且互不影响，后者每个实例通用。类似与 Java 的类的静态属性。

下面是一个例子，展示了一个协议只要求一个实例属性。

```swift
protocol FullyNamed {
    var fullName: String { get }
}
```

一个结构体实现了这个协议。

```swift
struct Person: FullyNamed {
    var fullName: String
}
let john = Person(fullName: "John Appleseed")
// john.fullName is "John Appleseed"
```

一个类也实现了这个协议，这个实现更复杂一点。

```swift
class Starship: FullyNamed {
    var prefix: String?
    var name: String
    init(name: String, prefix: String? = nil) {
        self.name = name
        self.prefix = prefix
    }
    var fullName: String {
        return (prefix != nil ? prefix! + " " : "") + name
    }
}
var ncc1701 = Starship(name: "Enterprise", prefix: "USS")
// ncc1701.fullName is "USS Enterprise"
```

### 方法要求

协议也可以声明实例方法要求或者类型方法要求。

```swift
protocol SomeProtocol {
    static func someTypeMethod()
}
```

下面是一个协议要求实现一个方法。

```swift
protocol RandomNumberGenerator {
    func random() -> Double
}
```

下面一个类实现了它。

```swift
class LinearCongruentialGenerator: RandomNumberGenerator {
    var lastRandom = 42.0
    let m = 139968.0
    let a = 3877.0
    let c = 29573.0
    func random() -> Double {
        lastRandom = ((lastRandom * a + c).truncatingRemainder(dividingBy:m))
        return lastRandom / m
    }
}
let generator = LinearCongruentialGenerator()
print("Here's a random number: \(generator.random())")
// Prints "Here's a random number: 0.3746499199817101"
print("And another one: \(generator.random())")
// Prints "And another one: 0.729023776863283"
```

### Mutating 方法要求

在协议中声明一个对自身实例进行修改的方法需要关键字 `mutating`。结构体和枚举类型实现这个方法时也需要这个关键字，但是类的方法不需要 `mutating` 关键字。

下面定义类一个 Togglable 协议，有一个 `toggle()` 方法，就如其名，要求触发一个状态对转换。

```swift
protocol Togglable {
    mutating func toggle()
}
```

下面对枚举类型对其进行类实现。

```swift
enum OnOffSwitch: Togglable {
    case off, on
    mutating func toggle() {
        switch self {
        case .off:
            self = .on
        case .on:
            self = .off
        }
    }
}
var lightSwitch = OnOffSwitch.off
lightSwitch.toggle()
// lightSwitch is now equal to .on
```

### 初始化器要求

下面的例子声明要求一个初始化器。

```swift
protocol SomeProtocol {
    init(someParameter: Int)
}
```

不同于结构体和枚举类型，类存在继承关系，所以在满足协议中的初始化器要求时存在特殊之处，即需要 `required` 修饰符。除此之外你可以决定将要求的初始化器定义为指定初始化器或者是便利初始化器，取决于你的需求。

```swift
class SomeClass: SomeProtocol {
    required init(someParameter: Int) {
        // initializer implementation goes here
    }
}
```

`required` 修饰符的作用在于保证你提供一个显式的，或者继承的初始化器实现，使得其子类默认是实现类该协议的。

> R；文档提示当一个类是 final 时你不需要 `required` 修饰符。因为它没有子类。

如果父类有同名的指定初始化器，并且子类要覆盖这个特殊的初始化器，则需要 `required` 和 `override` 两个关键字。

```swift
protocol SomeProtocol {
    init()
}

class SomeSuperClass {
    init() {
        // initializer implementation goes here
    }
}

class SomeSubClass: SomeSuperClass, SomeProtocol {
    // "required" from SomeProtocol conformance; "override" from SomeSuperClass
    required override init() {
        // initializer implementation goes here
    }
}
```

### 协议作为类型

即使协议本身不实现任何功能，但是它还可以作为一个类型使用。使用协议作为类型时常被称为存在类型（existential type），所有实现了这个协议的类型都是符合条件的类型。

你可以像使用类型一样使用协议，包括：

- 作为一个函数、方法、初始化器的参数类型或返回值类型；
- 作为常量、变量或者属性的类型；
- 作为数组、字典或者其他容器的类型。

下面是一个例子。Dice 类代表一个多面骰子，它有两个属性，一个是面数 sides，一个是随机数生成器 generator。generator 使用上文的随机数生成器的协议作为类型。

```swift
class Dice {
    let sides: Int
    let generator: RandomNumberGenerator
    init(sides: Int, generator: RandomNumberGenerator) {
        self.sides = sides
        self.generator = generator
    }
    func roll() -> Int {
        return Int(generator.random() * Double(sides)) + 1
    }
}

var d6 = Dice(sides: 6, generator: LinearCongruentialGenerator())
for _ in 1...5 {
    print("Random dice roll is \(d6.roll())")
}
// Random dice roll is 3
// Random dice roll is 5
// Random dice roll is 4
// Random dice roll is 5
// Random dice roll is 4
```

### 委派

委派是一个设计模式。委派模式允许一个类或结构体将自身部分指责委派给另一个类型的实例。要实现委派模式，先定一个协议封装需要委派出去的指责，而实现了这个协议的类型保证提供委派所需的功能性。委派可以用来相应特定的动作，或者从外部资源中恢复数据而不需要知道这个资源的基本类型。

下面的例子定义了两个协议。

```swift
protocol DiceGame {
    var dice: Dice { get }
    func play()
}
protocol DiceGameDelegate: AnyObject {
    func gameDidStart(_ game: DiceGame)
    func game(_ game: DiceGame, didStartNewTurnWithDiceRoll diceRoll: Int)
    func gameDidEnd(_ game: DiceGame)
}
```

DiceGame 协议可以由任何使用骰子的游戏实现。

DiceGameDelegate 协议可以实现追踪一个 DiceGame 的进度。为了避免强引用循环，委派被声明为弱引用。DiceGameDelegate 继承 AnyObject，这一操作让其只能被类实现，这样的协议称为 Class-Only Protocols。

> R：关于强类型引用循环参考资料：https://docs.swift.org/swift-book/LanguageGuide/AutomaticReferenceCounting.html#ID51

```swift
class SnakesAndLadders: DiceGame {
    let finalSquare = 25
    let dice = Dice(sides: 6, generator: LinearCongruentialGenerator())
    var square = 0
    var board: [Int]
    init() {
        board = Array(repeating: 0, count: finalSquare + 1)
        board[03] = +08; board[06] = +11; board[09] = +09; board[10] = +02
        board[14] = -10; board[19] = -11; board[22] = -02; board[24] = -08
    }
    weak var delegate: DiceGameDelegate?
    func play() {
        square = 0
        delegate?.gameDidStart(self)
        gameLoop: while square != finalSquare {
            let diceRoll = dice.roll()
            delegate?.game(self, didStartNewTurnWithDiceRoll: diceRoll)
            switch square + diceRoll {
            case finalSquare:
                break gameLoop
            case let newSquare where newSquare > finalSquare:
                continue gameLoop
            default:
                square += diceRoll
                square += board[square]
            }
        }
        delegate?.gameDidEnd(self)
    }
}
```

SnakesAndLadders 类初始化时创建了一个棋盘，并定义了一些数值在其中。游戏执行时，骰子生成随机数，然后 square 属性添加随机数，并加上棋盘上相应位置的数值，最终结果超过 finialSquare 则游戏结束。

下面是骰子游戏委派的实现。

```swift
class DiceGameTracker: DiceGameDelegate {
    var numberOfTurns = 0
    func gameDidStart(_ game: DiceGame) {
        numberOfTurns = 0
        if game is SnakesAndLadders {
            print("Started a new game of Snakes and Ladders")
        }
        print("The game is using a \(game.dice.sides)-sided dice")
    }
    func game(_ game: DiceGame, didStartNewTurnWithDiceRoll diceRoll: Int) {
        numberOfTurns += 1
        print("Rolled a \(diceRoll)")
    }
    func gameDidEnd(_ game: DiceGame) {
        print("The game lasted for \(numberOfTurns) turns")
    }
}
```

实际上它们是这样组合的。

```swift
let tracker = DiceGameTracker()
let game = SnakesAndLadders()
game.delegate = tracker
game.play()
// Started a new game of Snakes and Ladders
// The game is using a 6-sided dice
// Rolled a 3
// Rolled a 5
// Rolled a 4
// Rolled a 5
// The game lasted for 4 turns
```

### 用扩展添加新的协议

你可以使用扩展语法给现有的类型实现新的协议，甚至你不需要访问现有类型的源代码。关于扩展可以参考上一节。

> R：文档提示当存在现有实例时，将自动获得扩展后的内容。听上去很酷炫的热扩展。

例如下面的协议定义了一个属性用文本表述自身。

```swift
protocol TextRepresentable {
    var textualDescription: String { get }
}
```

扩展 Dice 类让其实现这个协议。

```swift
extension Dice: TextRepresentable {
    var textualDescription: String {
        return "A \(sides)-sided dice"
    }
}
```

现在 Dice 的实例都实现了 TextRepresentable 协议。

```swift
let d12 = Dice(sides: 12, generator: LinearCongruentialGenerator())
print(d12.textualDescription)
// Prints "A 12-sided dice"
```

类似的，SnakesAndLadders 类也可以实现这个协议。

```swift
extension SnakesAndLadders: TextRepresentable {
    var textualDescription: String {
        return "A game of Snakes and Ladders with \(finalSquare) squares"
    }
}
print(game.textualDescription)
// Prints "A game of Snakes and Ladders with 25 squares"
```

### 按条件实现协议

泛型类型可能仅在某些条件下满足协议的要求，例如当类型的通用参数符合协议时。你可以在扩展一个类型的时候列出制约，可以使泛型有条件地实现某个协议。通过泛型 where 小句将制约写在协议名称之后。

```swift
extension Array: TextRepresentable where Element: TextRepresentable {
    var textualDescription: String {
        let itemsAsText = self.map { $0.textualDescription }
        return "[" + itemsAsText.joined(separator: ", ") + "]"
    }
}
let myDice = [d6, d12]
print(myDice.textualDescription)
// Prints "[A 6-sided dice, A 12-sided dice]"
```

### 用扩展声明协议实现

如果一个类型已经满足了一个协议的要求，但是其没有实现这个协议，可以使用一个空的扩展来声明这个类型实现了这个协议。

```swift
struct Hamster {
    var name: String
    var textualDescription: String {
        return "A hamster named \(name)"
    }
}
extension Hamster: TextRepresentable {}


let simonTheHamster = Hamster(name: "Simon")
let somethingTextRepresentable: TextRepresentable = simonTheHamster
print(somethingTextRepresentable.textualDescription)
// Prints "A hamster named Simon"
```

### 协议类型集合

协议可以作为集合的类型，比如数组和字典类型。下面是一个例子。

```swift
let things: [TextRepresentable] = [game, d12, simonTheHamster]
```

可以遍历数组打印文字描述。

```swift
for thing in things {
    print(thing.textualDescription)
}
// A game of Snakes and Ladders with 25 squares
// A 12-sided dice
// A hamster named Simon
```

### 协议继承

协议可以继承。下面是继承语法。

```swift
protocol InheritingProtocol: SomeProtocol, AnotherProtocol {
    // protocol definition goes here
}


protocol PrettyTextRepresentable: TextRepresentable {
    var prettyTextualDescription: String { get }
}
```

上面例子定义了一个新的协议 PrettyTextRepresentable 继承与 TextRepresentable。

下面是一个实现。用扩展的方式让 SnakesAndLadders 实现该协议。

```swift
extension SnakesAndLadders: PrettyTextRepresentable {
    var prettyTextualDescription: String {
        var output = textualDescription + ":\n"
        for index in 1...finalSquare {
            switch board[index] {
            case let ladder where ladder > 0:
                output += "▲ "
            case let snake where snake < 0:
                output += "▼ "
            default:
                output += "○ "
            }
        }
        return output
    }
}

print(game.prettyTextualDescription)
// A game of Snakes and Ladders with 25 squares:
// ○ ○ ▲ ○ ○ ▲ ○ ○ ▲ ▲ ○ ○ ○ ▼ ○ ○ ○ ○ ▼ ○ ○ ▼ ○ ▼ ○
```

### Class-Only 协议

你可以让协议继承 `AnyObject` 限制只有类可以实现这个协议。

```swift
protocol SomeClassOnlyProtocol: AnyObject, SomeInheritedProtocol {
    // class-only protocol definition goes here
}
```

除了类以外，结构体或枚举类型实现这个协议时会报出编译错误。

### 协议组合

有时要求一个类型同时实现两个协议是很有用的。你可以使用协议组合让多个协议变成一个单独的要求。协议组合不会定义新的协议，它就是一个临时本地协议一样把组合中的所有协议的要求都联合到一起。

协议组合的格式是 `SomeProtocol & AnotherProtocol`。可以列举多个协议并用(&)将他们链接。除了它列出来的一串协议，一个协议组合还允许包含一个类，用来指定一个要求的父类。

下面是一个例子。

```swift
protocol Named {
    var name: String { get }
}
protocol Aged {
    var age: Int { get }
}
struct Person: Named, Aged {
    var name: String
    var age: Int
}
func wishHappyBirthday(to celebrator: Named & Aged) {
    print("Happy birthday, \(celebrator.name), you're \(celebrator.age)!")
}
let birthdayPerson = Person(name: "Malcolm", age: 21)
wishHappyBirthday(to: birthdayPerson)
// Prints "Happy birthday, Malcolm, you're 21!"
```

下面是包含一个类名的例子。

```swift
class Location {
    var latitude: Double
    var longitude: Double
    init(latitude: Double, longitude: Double) {
        self.latitude = latitude
        self.longitude = longitude
    }
}
class City: Location, Named {
    var name: String
    init(name: String, latitude: Double, longitude: Double) {
        self.name = name
        super.init(latitude: latitude, longitude: longitude)
    }
}
func beginConcert(in location: Location & Named) {
    print("Hello, \(location.name)!")
}

let seattle = City(name: "Seattle", latitude: 47.6, longitude: -122.3)
beginConcert(in: seattle)
// Prints "Hello, Seattle!"
```

### 检查协议的一致性

你可以使用 `is` 和 `as` 操作符检查协议实现的一致性和转换到指定协议。语法相同。

下面定义一个例子。

```swift
protocol HasArea {
    var area: Double { get }
}
```

定义两个类实现这个协议。

```swift
class Circle: HasArea {
    let pi = 3.1415927
    var radius: Double
    var area: Double { return pi * radius * radius }
    init(radius: Double) { self.radius = radius }
}
class Country: HasArea {
    var area: Double
    init(area: Double) { self.area = area }
}
```

下面这个类不实现这个协议。

```swift
class Animal {
    var legs: Int
    init(legs: Int) { self.legs = legs }
}
```

把它们装到一起。

```swift
let objects: [AnyObject] = [
    Circle(radius: 2.0),
    Country(area: 243_610),
    Animal(legs: 4)
]
```

下面是一个检查类型的例子。

```swift
for object in objects {
    if let objectWithArea = object as? HasArea {
        print("Area is \(objectWithArea.area)")
    } else {
        print("Something that doesn't have an area")
    }
}
// Area is 12.5663708
// Area is 243610.0
// Something that doesn't have an area
```

### 可选的协议要求

你可以给协议定义可选的要求。实现这个协议的类型不需要一定实现这个要求。通过 `optional` 修饰符来定义一个可选要求。

可选要求有效，你可以写代码与 Objective-C 交互操作。协议和可选要求都需要用 @objc 标注。标注了 @objc 的协议只能被继承自 Objective-C 的类或其他 @objc 类实现。无法由结构体和枚举类型实现。

当你使用可选要求的方法或者属性时，它的类型自动变为可选，而且是整个函数类型变成可选而非其返回值。例如一个方法 (Int) -> String 将变成 ((Int) -> String)?。

```swift
@objc protocol CounterDataSource {
    @objc optional func increment(forCount count: Int) -> Int
    @objc optional var fixedIncrement: Int { get }
}
```

```swift
class Counter {
    var count = 0
    var dataSource: CounterDataSource?
    func increment() {
        if let amount = dataSource?.increment?(forCount: count) {
            count += amount
        } else if let amount = dataSource?.fixedIncrement {
            count += amount
        }
    }
}
```

下面几个示例。

```swift
class ThreeSource: NSObject, CounterDataSource {
    let fixedIncrement = 3
}

var counter = Counter()
counter.dataSource = ThreeSource()
for _ in 1...4 {
    counter.increment()
    print(counter.count)
}
// 3
// 6
// 9
// 12

class TowardsZeroSource: NSObject, CounterDataSource {
    func increment(forCount count: Int) -> Int {
        if count == 0 {
            return 0
        } else if count < 0 {
            return 1
        } else {
            return -1
        }
    }
}

counter.count = -4
counter.dataSource = TowardsZeroSource()
for _ in 1...5 {
    counter.increment()
    print(counter.count)
}
// -3
// -2
// -1
// 0
// 0
```

### 协议扩展

协议可以直接被扩展。

```swift
extension RandomNumberGenerator {
    func randomBool() -> Bool {
        return random() > 0.5
    }
}
```

```swift
let generator = LinearCongruentialGenerator()
print("Here's a random number: \(generator.random())")
// Prints "Here's a random number: 0.3746499199817101"
print("And here's a random Boolean: \(generator.randomBool())")
// Prints "And here's a random Boolean: true"
```

协议扩展可以用来提供一个默认的实现。

```swift
extension PrettyTextRepresentable  {
    var prettyTextualDescription: String {
        return textualDescription
    }
}
```

协议扩展也可以用来添加约束。

```swift
extension Collection where Element: Equatable {
    func allEqual() -> Bool {
        for element in self {
            if element != self.first {
                return false
            }
        }
        return true
    }
}

let equalNumbers = [100, 100, 100, 100, 100]
let differentNumbers = [100, 100, 200, 100, 200]

print(equalNumbers.allEqual())
// Prints "true"
print(differentNumbers.allEqual())
// Prints "false"
```

# 相关

> 24.[Swift Extensions](https://github.com/zfanli/notes/blob/master/swift/24.Extensions.md)
>
> 26.[Swift Generics](https://github.com/zfanli/notes/blob/master/swift/26.Generics.md)
