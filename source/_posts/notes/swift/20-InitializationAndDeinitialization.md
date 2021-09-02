---
title: 20.Swift Initialization and Deinitialization
tags:
  - Swift
date: '2019-07-02T14:28:35.099Z'
categories:
  - notes
  - swift
---

干货满满的一篇内容，虽然我记录的可能有点意识流了。

先说说简单的卸载器（`deinitializer`），只有类有，自动继承，在对象被销毁前执行，和之前 Basics 的内容一般无二，很好理解。

然后是初始化器（`initializer`），内容多了很多。首先是提到了值类型引用的结构体和枚举类型，它们由于没有继承关系，所以初始化器相对简单。它们可以定义委派初始化器，其意思是一个初始化器中调用另一个初始化器，减少代码重复，让每个初始化器专注自己的功能。委派初始化器没有关键字。

另一边，类由于存在继承关系，所以相对复杂一些，类有指定初始化器和便利初始化器的定义。

- 指定初始化器：初始化类的所有属性，并调用父类的指定初始化器；
- 便利初始化器：调用同类的指定初始化器，并对其中一部分值给予默认值。

<!-- more -->

其实看来类的便利初始化器就是结构体和枚举类型的委派初始化器。但是由于类有继承关系，要保证初始化完整执行的复杂度提升了一个维度。

Swift 为了保证类进行正确的初始化，会执行两个阶段的初始化任务。在第一个阶段类会完成自己的属性的初始化，并且向上完成父类链上所有父类的属性的初始化，此时属性的初始化一步一步攀登到了父类链顶端；第二个阶段，从父类链顶端开始执行顶级父类的自定义操作，执行完成后接力给次级父类，一步一步回归到当前类，最终当前类完成自定义操作。

官方文档花了很大的篇幅介绍这个过程，但看明白了之后就知道了，实际上就是一个递归，保证属性的初始化是从当前类出发一直到父类链顶层，然后自定义操作从父类顶级一直回归到当前类。当前类先初始化属性，最后完成初始化操作，这在其他语言中应该也是同样的，但是 Swift 可能做了更多的保护措施。

此外，对于父类的指定初始化器来说，子类的覆写需要 `override` 关键字，但是对父类的便利初始化器来说子类覆写不需要关键字。理由是，对于父类便利初始化器的覆写，实际上对子类来说父类的便利初始化器不会有机会再被调用了，所以这实际上不是一个覆写操作，而是子类创建了一个新的初始化器。

子类对于父类初始化器的继承也有一定的限制。默认情况下是不会自动继承父类初始化器的，但是当子类满足下面两个条件时，父类的所有初始化器都会被子类继承。

- 子类没有自定义属性也没有自己的初始化器：此时子类完全继承父类的所有初始化器，包括指定初始化器和便利初始化器；
- 子类覆写了所有父类的指定初始化器时：此时子类将继承父类的所有便利初始化器。

一个类中，除了可以定义上面所说的初始化器之外，还可以定义一种允许失败的特殊初始化器。官方称之为“Failable Initializers”，实际上它只是一个附带安全检查的初始化器，它会在初始化对象时进行自定义的检查，如果条件不满足的情况——通常是参数值不符合要求，或者根据某个全局变量进行判断——初始化会立刻失败，并且返回 `nil`。它其实是可选型变量的高级版，可返回 `nil` 的初始化器。它的定义方式是在 `init` 后加上问号，也就是 `init?`。对于这种类型的初始化器，子类可以继承它，并且根据需要将其变成不允许失败的初始化器，这一操作往往通过提供一个默认值来实现。另一方面，子类是不能将父类的一个非允许失败初始化器改写成允许失败初始化器的。

另外，这种可以允许失败的初始化器在结构体和枚举类型中也是适用的。

> R：内容满满，光小结就将近 1，500 字，全篇内容更是超过了 18，000 字。(˚ ˃̣̣̥ω˂̣̣̥ )

## 初始化器和卸载器

### 初始化器

初始化器提供一定灵活性，在实例化对象时做一些操作。一般用来接收变量赋值，做一些特殊的初始化操作。先做个复习。

> R：就是 Java 的构造函数。

```swift
struct Fahrenheit {
    var temperature: Double
    init() {
        temperature = 32.0
    }
}
var f = Fahrenheit()
print("The default temperature is \(f.temperature)° Fahrenheit")
// Prints "The default temperature is 32.0° Fahrenheit"
```

可以存在多个初始化器，可以接收参数。

```swift
struct Celsius {
    var temperatureInCelsius: Double
    init(fromFahrenheit fahrenheit: Double) {
        temperatureInCelsius = (fahrenheit - 32.0) / 1.8
    }
    init(fromKelvin kelvin: Double) {
        temperatureInCelsius = kelvin - 273.15
    }
}
let boilingPointOfWater = Celsius(fromFahrenheit: 212.0)
// boilingPointOfWater.temperatureInCelsius is 100.0
let freezingPointOfWater = Celsius(fromKelvin: 273.15)
// freezingPointOfWater.temperatureInCelsius is 0.0

struct Color {
    let red, green, blue: Double
    init(red: Double, green: Double, blue: Double) {
        self.red   = red
        self.green = green
        self.blue  = blue
    }
    init(white: Double) {
        red   = white
        green = white
        blue  = white
    }
}

let magenta = Color(red: 1.0, green: 0.0, blue: 1.0)
let halfGray = Color(white: 0.5)
```

也可以不使用标签。

```swift
struct Celsius {
    var temperatureInCelsius: Double
    init(fromFahrenheit fahrenheit: Double) {
        temperatureInCelsius = (fahrenheit - 32.0) / 1.8
    }
    init(fromKelvin kelvin: Double) {
        temperatureInCelsius = kelvin - 273.15
    }
    init(_ celsius: Double) {
        temperatureInCelsius = celsius
    }
}
let bodyTemperature = Celsius(37.0)
// bodyTemperature.temperatureInCelsius is 37.0
```

可以不初始化可选类型的属性。

```swift
class SurveyQuestion {
    var text: String
    var response: String?
    init(text: String) {
        self.text = text
    }
    func ask() {
        print(text)
    }
}
let cheeseQuestion = SurveyQuestion(text: "Do you like cheese?")
cheeseQuestion.ask()
// Prints "Do you like cheese?"
cheeseQuestion.response = "Yes, I do like cheese."
```

类有默认的初始化器。

```swift
class ShoppingListItem {
    var name: String?
    var quantity = 1
    var purchased = false
}
var item = ShoppingListItem()
```

结构体也有默认的初始化器，初始化所有属性。

```swift
class ShoppingListItem {
    var name: String?
    var quantity = 1
    var purchased = false
}
var item = ShoppingListItem()
```

值类型的委派初始化器，名字不好理解，但是指的是为了减少重复代码，在一个初始化器中调用另一个初始化器完成一部分工作这一动作。

委派初始化器对类、结构体&枚举类型采取不同的工作模式和形式。因为枚举类型和结构体不支持继承，所以相对简单，只需要处理它们声明的其他初始化器就足够了。类可以继承其他的类，这导致类需要额外保证它继承的类的所有属性是否正确的初始化。

另外如果值类型，也就是枚举类型或结构体定义了一个初始化器，那么它本身默认自动生成的初始化器将无法访问。

下面定义一个四边形结构体，储存一个起点和尺寸信息。四边形结构体有两个初始化器，一个接收起点和尺寸，另一个接收中点和尺寸，后者通过中点计算出起点，并且调用前者进行真正的赋值。

```swift
struct Size {
    var width = 0.0, height = 0.0
}
struct Point {
    var x = 0.0, y = 0.0
}

struct Rect {
    var origin = Point()
    var size = Size()
    init() {}
    init(origin: Point, size: Size) {
        self.origin = origin
        self.size = size
    }
    init(center: Point, size: Size) {
        let originX = center.x - (size.width / 2)
        let originY = center.y - (size.height / 2)
        self.init(origin: Point(x: originX, y: originY), size: size)
    }
}
```

注意由于定义了新的初始化器，默认的初始化器将被失效，为了保证默认初始化方法，需要手动添加空的 `init()` 初始化器，这能保证下面的实例化能正常执行。

```swift
let basicRect = Rect()
// basicRect's origin is (0.0, 0.0) and its size is (0.0, 0.0)
```

剩余两个初始化器调用实例。

```swift
let originRect = Rect(origin: Point(x: 2.0, y: 2.0),
                      size: Size(width: 5.0, height: 5.0))
// originRect's origin is (2.0, 2.0) and its size is (5.0, 5.0)

let centerRect = Rect(center: Point(x: 4.0, y: 4.0),
                      size: Size(width: 3.0, height: 3.0))
// centerRect's origin is (2.5, 2.5) and its size is (3.0, 3.0)
```

类的继承和初始化。

类的所有属性，包括从父类继承来的属性，在初始化期间都需要进行赋值。Swift 提供两种方式保证类的属性都正确初始化，分别是 `designated initializers` 指定初始化器和 `convenience initializers` 便利初始化器。

指定初始化器是类的主要的初始化器。一个指定的初始化器会初始化所有属性，并且调用父类的初始化器一步步调用继承链上所有父类的初始化器。

类通常不会有很多指定初始化器，实践来说通常一个类仅有一个指定初始化器。一个类至少需要一个指定初始化器，通常这可能是通过继承父类的初始化器。

便利初始化器是类支持的次级初始化器。你可以用便利初始化器调用指定初始化器，并对其部分值设定默认值。这可以应对指定场合或输入值类型的情况。但便利初始化器是可选的。便利初始化器需要关键字 `convenience`。

```swift
init(parameters) {
    statements
}

convenience init(parameters) {
    statements
}
```

为了整清楚指定初始化器和便利初始化器直接的关系，Swift 设定了下面三个规则用于相会委派初始化器。

- Rule 1：指定初始化器必须调用直属父类的指定初始化器。
- Rule 2：一个便利初始化器中必须调用同类下的另一个初始化器。
- Rule 3：一个便利初始化器必须调用一个指定初始化器。

一个速记方法：

- 指定初始化器必须向上委派；
- 便利初始化器必须同级委派。

初始化的两个阶段。第一个阶段初始化每一个字段，第二个阶段对属性做自定义操作，之后实例化完成，对象可以正常访问。以此来保证属性初始化之后才能访问，防止属性赋值顺序导致预料外的覆盖。

Swift 编译器会做 4 步安全检查保证初始化的安全性。

- 安全检查 1: 指定初始化器必须保证所在类的所有属性初始化完成，并且向上委派父类的初始化器。
- 安全检查 2: 在对继承的属性进行赋值时指定初始化器必须先委派父类的初始化器初始化该属性，否则在父类初始化的过程中会将新的值覆盖。
- 安全检查 3: 便利初始化器在操作属性之前必须调用本身类的指定初始化器，否则新的值会在自身的指定初始化器的初始化过程中被覆盖。
- 安全检查 4: 在第一步阶段完成之前初始化器无法操作方法和变量，或访问 `self` 属性。

下面是两步初始化的过程。

第一步：

- 类的指定初始化器或者便利初始化器被调用；
- 分配内存给类的新实例，内存尚未初始化；
- 指定初始化器给类的所有属性初始化，此时这些属性的内存已被初始化；
- 指定初始化器调用父类初始化器，接力完成父类的属性初始化；
- 父类初始化器持续调用父类链上所有父类的初始化器，直到最后一个父类完成初始化；
- 一旦到达父类链顶端，且顶级父类完成初始化，则认为实例内存完全初始化完毕，第一阶段结束。

第二步：

- 从顶级父类向下一步步执行指定初始化器中属性初始化以外的自定义任务，此时已经可以访问 `self`，可以读写属性，可以调用方法；
- 最后，便利初始化器可以定制实例，操作 `self` 变量。

初始化器的继承和覆盖（Override）。在 Swift 中子类默认不继承父类的初始化器，这可以防止父类的某个简单的初始化器被一个特化的子类继承并用来实例化而导致子类的属性没有被完全初始化完成的情况。

如果你想定义一个和父类相同的初始化器，你可以提供一个定制化的实现给父类的初始化器，这实际上是对父类初始化器的覆盖，而覆盖父类的指定初始化器必须写 `override` 关键字，即使是默认生成的初始化器。反之，便利初始化器可以不用写，因为如果你覆盖了一个父类的便利初始化器，实际上父类的便利初始化器就不会在被调用了，所以这严格来说你并没有覆盖它。

> R：你干掉了一个便利初始化器，并提供了一个新的，所以你没有“覆盖”它，所以你不用写 `override` 关键字。对于指定初始化器来说，你需要调用父类的指定初始化器，所以实际上你“覆盖”了它，或者说扩展了它？

```swift
class Vehicle {
    var numberOfWheels = 0
    var description: String {
        return "\(numberOfWheels) wheel(s)"
    }
}
```

这里 Vehicle 没有定义初始化器，但是它会有一个默认的初始化器。

```swift
let vehicle = Vehicle()
print("Vehicle: \(vehicle.description)")
// Vehicle: 0 wheel(s)
```

下面子类继承了 Vehicle，它修改了父类的默认初始化器。

```swift
class Bicycle: Vehicle {
    override init() {
        super.init()
        numberOfWheels = 2
    }
}
```

Bicycle 的初始化器中先执行了 `super.init()`，保证了父类属性初始化完成后，才对属性进行操作。

```swift
class Hoverboard: Vehicle {
    var color: String
    init(color: String) {
        self.color = color
        // super.init() implicitly called here
    }
    override var description: String {
        return "\(super.description) in a beautiful \(color)"
    }
}
```

Vehicle 另一个子类 Hoverboard 没有覆盖父类的默认初始化器，而且它在初始化器中只初始化了自身的属性，而父类的初始化会隐式地被调用。

```swift
let hoverboard = Hoverboard(color: "silver")
print("Hoverboard: \(hoverboard.description)")
// Hoverboard: 0 wheel(s) in a beautiful silver
```

初始化器自动继承。初始化器不会默认继承，但是当满足某些条件时，初始化器会自动继承。这意味着在大多场景你不需要覆写初始化器，当父类的初始化器是安全的时候，你可以直接继承它。

假设你的子类的所有属性都初始化完成了，下面两个规则会被应用：

- 如果子类没有指定初始化器，父类的所有初始化器将被继承；
- 如果父类的指定初始化器全都得到实现，可以是覆盖，或者根据第一条规则继承，则父类的所有便利初始化器也将被继承。

例子：

```swift
class Food {
    var name: String
    init(name: String) {
        self.name = name
    }
    convenience init() {
        self.init(name: "[Unnamed]")
    }
}

let namedMeat = Food(name: "Bacon")
// namedMeat's name is "Bacon"

let mysteryMeat = Food()
// mysteryMeat's name is "[Unnamed]"


class RecipeIngredient: Food {
    var quantity: Int
    init(name: String, quantity: Int) {
        self.quantity = quantity
        super.init(name: name)
    }
    override convenience init(name: String) {
        self.init(name: name, quantity: 1)
    }
}
```

> R：RecipeIngredient 的 init(name) 前面的 `override` 是因为它覆盖了父类的指定初始化器，看来需不需要 `override` 是看是否覆盖了父类的指定初始化器。

```swift
let oneMysteryItem = RecipeIngredient()
let oneBacon = RecipeIngredient(name: "Bacon")
let sixEggs = RecipeIngredient(name: "Eggs", quantity: 6)
```

RecipeIngredient 实现了父类的所有指定初始化器，所以它继承了父类所有的便利初始化器。

```swift
class ShoppingListItem: RecipeIngredient {
    var purchased = false
    var description: String {
        var output = "\(quantity) x \(name)"
        output += purchased ? " ✔" : " ✘"
        return output
    }
}
```

这里 SHoppingListItem 虽然没有定义任何初始化器，但是它对自身所有属性进行了初始化，所以它自定继承了父类的指定初始化器和便利初始化器。

```swift
var breakfastList = [
    ShoppingListItem(),
    ShoppingListItem(name: "Bacon"),
    ShoppingListItem(name: "Eggs", quantity: 6),
]
breakfastList[0].name = "Orange juice"
breakfastList[0].purchased = true
for item in breakfastList {
    print(item.description)
}
// 1 x Orange juice ✔
// 1 x Bacon ✘
// 6 x Eggs ✘
```

允许失败的初始化器。由于参数值、外部资源或者其他的条件不被满足等情况可能会造成初始化过程失败，你可以通过 `init?` 的形式定义允许失败的初始化器。

```swift
struct Animal {
    let species: String
    init?(species: String) {
        if species.isEmpty { return nil }
        self.species = species
    }
}

let someCreature = Animal(species: "Giraffe")
// someCreature is of type Animal?, not Animal

if let giraffe = someCreature {
    print("An animal was initialized with a species of \(giraffe.species)")
}
// Prints "An animal was initialized with a species of Giraffe"


let anonymousCreature = Animal(species: "")
// anonymousCreature is of type Animal?, not Animal

if anonymousCreature == nil {
    print("The anonymous creature could not be initialized")
}
// Prints "The anonymous creature could not be initialized"
```

枚举类型的允许失败的初始化器。

```swift
enum TemperatureUnit {
    case kelvin, celsius, fahrenheit
    init?(symbol: Character) {
        switch symbol {
        case "K":
            self = .kelvin
        case "C":
            self = .celsius
        case "F":
            self = .fahrenheit
        default:
            return nil
        }
    }
}

let fahrenheitUnit = TemperatureUnit(symbol: "F")
if fahrenheitUnit != nil {
    print("This is a defined temperature unit, so initialization succeeded.")
}
// Prints "This is a defined temperature unit, so initialization succeeded."

let unknownUnit = TemperatureUnit(symbol: "X")
if unknownUnit == nil {
    print("This is not a defined temperature unit, so initialization failed.")
}
// Prints "This is not a defined temperature unit, so initialization failed."
```

关于 rawType 的使用。

```swift
enum TemperatureUnit: Character {
    case kelvin = "K", celsius = "C", fahrenheit = "F"
}

let fahrenheitUnit = TemperatureUnit(rawValue: "F")
if fahrenheitUnit != nil {
    print("This is a defined temperature unit, so initialization succeeded.")
}
// Prints "This is a defined temperature unit, so initialization succeeded."

let unknownUnit = TemperatureUnit(rawValue: "X")
if unknownUnit == nil {
    print("This is not a defined temperature unit, so initialization failed.")
}
// Prints "This is not a defined temperature unit, so initialization failed."
```

初始化失败的传播（Propagation）。一个允许失败的初始化器可能会调用同级的其他初始化器，如果是类的话，还可能调用父类的初始化器。而一个允许失败的初始化器执行过程中失败了，那么整个初始化过程会立即失败，后续的代码不会再被执行。

下面是一个例子，父类 Product 检查 name 属性为空的情况下初始化失败，而它的子类 CartItem 则检查 quantity 属性至少不能小于 1，否则初始化失败。

```swift
class Product {
    let name: String
    init?(name: String) {
        if name.isEmpty { return nil }
        self.name = name
    }
}

class CartItem: Product {
    let quantity: Int
    init?(name: String, quantity: Int) {
        if quantity < 1 { return nil }
        self.quantity = quantity
        super.init(name: name)
    }
}
```

这样按照顺序，如果 quantity 不符合要求，初始化过程立刻结束，程序不会执行后面的 name 检查。而如果 quantity 没问题，程序会继续检查 name 属性。

```swift
if let twoSocks = CartItem(name: "sock", quantity: 2) {
    print("Item: \(twoSocks.name), quantity: \(twoSocks.quantity)")
}
// Prints "Item: sock, quantity: 2"

if let zeroShirts = CartItem(name: "shirt", quantity: 0) {
    print("Item: \(zeroShirts.name), quantity: \(zeroShirts.quantity)")
} else {
    print("Unable to initialize zero shirts")
}
// Prints "Unable to initialize zero shirts"

if let oneUnnamed = CartItem(name: "", quantity: 1) {
    print("Item: \(oneUnnamed.name), quantity: \(oneUnnamed.quantity)")
} else {
    print("Unable to initialize one unnamed product")
}
// Prints "Unable to initialize one unnamed product"
```

关于覆写父类的允许失败的初始化器。子类可以复写父类的允许失败的初始化器，有点绕口。子类还可以控制是否让其继续允许失败。但是反之是不行的，你不可以让父类的一般初始化器覆写为允许失败的初始化器。

```swift
class Document {
    var name: String?
    // this initializer creates a document with a nil name value
    init() {}
    // this initializer creates a document with a nonempty name value
    init?(name: String) {
        if name.isEmpty { return nil }
        self.name = name
    }
}
```

上面定义了一个类 Document，下面定义另一个类继承它，并复写它的允许失败的初始化器，并让其保证不会出现返回 `nil` 的情况。

```swift
class AutomaticallyNamedDocument: Document {
    override init() {
        super.init()
        self.name = "[Untitled]"
    }
    override init(name: String) {
        super.init()
        if name.isEmpty {
            self.name = "[Untitled]"
        } else {
            self.name = name
        }
    }
}
```

另外你可以用感叹号替代问好，`init?` = `init!`。你也可以在正常的初始化器中调用 `init!`，虽然这样做会在初始化失败时触发一个断言。

父类可以用 `required` 关键字定义一个初始化器，这样所有继承它的子类都必须实现这个初始化器。

```swift
class SomeClass {
    required init() {
        // initializer implementation goes here
    }
}
```

你的子类也需要 `required` 关键字保证它的子类也要实现这个初始化器，但是这里覆写不需要 `override` 关键字。

```swift
class SomeSubclass: SomeClass {
    required init() {
        // subclass implementation of the required initializer goes here
    }
}
```

> R：官网文档备注了一点，就是如果子类满足父类的必须初始化器的执行条件的话，可以不用实现这个初始化器，因为父类的初始化器可以被继承来。

用闭包或函数给类的属性设置默认值。

如果某个属性需要定制或者设定，你可以使用闭包或者某个全局函数来给它提供一个默认的值。

```swift
class SomeClass {
    let someProperty: SomeType = {
        // create a default value for someProperty inside this closure
        // someValue must be of the same type as SomeType
        return someValue
    }()
}
```

注意属性大括号后的小括号，这表示立刻执行闭包，如果没有这个括号，则表示你在将这个闭包赋值给该属性。

下面的结构体用闭包创建了一个 8x8 的国际象棋棋盘。用布尔值表示黑白。每次新的棋盘被创建时都会执行闭包，初始化创建一个新的棋盘。

```swift
struct Chessboard {
    let boardColors: [Bool] = {
        var temporaryBoard = [Bool]()
        var isBlack = false
        for i in 1...8 {
            for j in 1...8 {
                temporaryBoard.append(isBlack)
                isBlack = !isBlack
            }
            isBlack = !isBlack
        }
        return temporaryBoard
    }()
    func squareIsBlackAt(row: Int, column: Int) -> Bool {
        return boardColors[(row * 8) + column]
    }
}

let board = Chessboard()
print(board.squareIsBlackAt(row: 0, column: 1))
// Prints "true"
print(board.squareIsBlackAt(row: 7, column: 7))
// Prints "false"
```

### 卸载器（deinitializer）

卸载器用来在实例将被释放内存之前做一些操作。只有类才能定义卸载器。

Swift 会自动在一个实例不再需要的时候回收它来释放资源。内存管理基于自动引用计算（ARC）实现，你不需要手动去释放一个对象。但是当你操作你自己的资源时，有时你需要手动做一些清洁操作。例如你创建一个类打开一个文件写一些数据，你需要在实例被释放之前关闭文件释放资源。

一个类最多一个卸载器，而且不需要参数，不需要括号。

```swift
deinit {
    // perform the deinitialization
}
```

卸载器在实例被释放前自动调用，不允许手动调用。父类的卸载器自动被子类继承，并且在子类的卸载器执行完成之后被执行。父类的卸载器一定会被执行，即使子类没有提供一个卸载器。

下面是卸载器的一个实例。首先我们定义一局游戏，游戏中有 Bank 和 Player 两个类。

Bank 储存 coins，并保证市场上最多流通有 1 万枚硬币。它有发布和收集两个方法用来分发个回收硬币。

```swift
class Bank {
    static var coinsInBank = 10_000
    static func distribute(coins numberOfCoinsRequested: Int) -> Int {
        let numberOfCoinsToVend = min(numberOfCoinsRequested, coinsInBank)
        coinsInBank -= numberOfCoinsToVend
        return numberOfCoinsToVend
    }
    static func receive(coins: Int) {
        coinsInBank += coins
    }
}
```

`distribute(coins:)` 方法最多发行出 1 万枚硬币，如果要求的数量大于银行剩余的量，则会返回银行当前剩余的硬币。`receive(coins:)` 方法用来回收硬币。

Player 类描述这局游戏的玩家角色。每个玩家都有一个钱包，储存一定的硬币，使用 `coinsInPurse` 属性表示。

```swift
class Player {
    var coinsInPurse: Int
    init(coins: Int) {
        coinsInPurse = Bank.distribute(coins: coins)
    }
    func win(coins: Int) {
        coinsInPurse += Bank.distribute(coins: coins)
    }
    deinit {
        Bank.receive(coins: coinsInPurse)
    }
}
```

每个玩家被实例化时都会收到一份初始资金，当然如果银行硬币余量不够时可能回收到比预期少的资金。玩家有一个 `win(coins:)` 方法可以从银行那边赢取一定的硬币。Player 类还有一个卸载器，用来在玩家离开游戏后保证资金回转到银行。

```swift
var playerOne: Player? = Player(coins: 100)
print("A new player has joined the game with \(playerOne!.coinsInPurse) coins")
// Prints "A new player has joined the game with 100 coins"
print("There are now \(Bank.coinsInBank) coins left in the bank")
// Prints "There are now 9900 coins left in the bank"
```

上面的例子中我们用可选型变量创建了一个 Player 对象，因为玩家可能在任何时候退出游戏。而因为使用了可选型类型，每次访问 Player 类的属性和方法时都需要加上感叹号(`!`) 来断言其一定存在。

```swift
playerOne!.win(coins: 2_000)
print("PlayerOne won 2000 coins & now has \(playerOne!.coinsInPurse) coins")
// Prints "PlayerOne won 2000 coins & now has 2100 coins"
print("The bank now only has \(Bank.coinsInBank) coins left")
// Prints "The bank now only has 7900 coins left"
```

你看，这名玩家又赢得了 2，000 硬币，现在他有 2，100 枚硬币了。而银行还剩下 7，900 枚硬币。

```swift
playerOne = nil
print("PlayerOne has left the game")
// Prints "PlayerOne has left the game"
print("The bank now has \(Bank.coinsInBank) coins")
// Prints "The bank now has 10000 coins"
```

现在玩家退出游戏，我们可以看到银行回收了这笔资金，余量又恢复到了 1 万枚硬币。

# 相关

> 19.[Swift Subscripts and Inheritance](https://github.com/zfanli/notes/blob/master/swift/19.SubscriptsAndInheritance.md)
>
> 21.[Swift Optional Chaining](https://github.com/zfanli/notes/blob/master/swift/21.OptionalChaining.md)
