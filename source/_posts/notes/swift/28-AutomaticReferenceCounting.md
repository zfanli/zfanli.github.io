---
title: 28.Swift Automatic Reference Counting
tags:
  - Swift
date: '2019-07-13T15:28:35.099Z'
categories:
  - notes
  - swift
---

没想到这篇主题内容也是这么丰富。

Swift 中使用一个叫做自动引用计数的机制来决定什么时候销毁一个对象释放资源。简称 ARC。

ARC 只对强引用计数。预期是你不需要操心任何内存释放的问题，但实际上会有一种情况导致 ARC 不能有效的释放内存。强引用循环。

出于 ARC 的原理，只有强引用计数归零才能触发 ARC 对对象实例的释放操作。但是如果有两个实例相互进行强引用，那么就会陷入一个强引用的死循环。两者相互保持对方还活着，那么两个实例就永远不会被销毁，这会造成内存泄露或溢出。

<!-- more -->

解决方法很简单，不要让两个实例保持相互强引用即可。Swift 提供了 `weak` 标记弱引用，`unowned` 标注非持有引用来解决这个问题。两者都不算一个强引用，不会被 ARC 计数，区别在于前者相当于一个可选类型的引用，而后者不是。使用这两个关键字，则表示这个实例对引用对象没有强引用存在，那么引用对象就可能会被销毁，即使该实例仍然引用对方。但是在 `weak` 引用时，引用对象被销毁会触发 ARC 将其设置为 `nil`，我们可以据此检测引用对象是否被销毁了。但是对于 `unowned` 来说，引用对象被销毁之后再访问会造成一个运行时错误。

所以非持有引用仅在保证引用对象不会先于自己被销毁时使用。

除了类的实例，闭包也是引用类型，所以其也可能造成强引用循环。使用捕获列表定义闭包捕获的每一个引用的引用类型，可以是弱引用或者非持有引用之一。对于和闭包生命周期相同的引用使用非持有引用，对于生命周期短于闭包的引用使用弱引用。弱引用的对象被销毁后同样触发 ARC 将其设置为 `nil`。

## 自动引用计算

Swift 使用自动引用计算（简称 ARC）管理你的 App 的内存使用。在绝大多数情况下这意味着 Swift 的内存管理是自动的，你不需要对内存管理投入太多思考。ARC 会自动对不再使用的实例进行垃圾回收，释放内存。

然而，ARC 在一些场景下为了帮你管理内存需要你提供部分代码的更多关系信息。这篇主题描述这些场景并像你展示 ARC 如何管理你的 App 使用内存。

引用计算只针对类的示例有效。结构体和枚举类型是值类型而非引用类型，不是以引用方式储存和传递的。

### ARC 如何工作

每次当你创建一个类的实例时，ARC 都会分配一块内存用来储存和这个实例相关的信息。这个内存储存关于这个实例的所有类型信息和所有关联的属性值。

另外，当一个实例不再需要时，ARC 会释放这个实例使用的内存资源。这保证类的实例在不使用后不再占据内存。

然而如果 ARC 释放了一个仍然在使用中的实例，其后果是这个实例的属性和方法都将不能访问。实际上，这种情况下如果你尝试访问这个实例，你的应用应该会崩溃掉。

为了保证一个实例在仍然被需要的时候不会突然消失，ARC 会追踪有多少属性、常量、变量当前正在引用实例。只要还有一个引用存在，ARC 就不会对实例释放内存。

为了让这变成可能，当你赋值一个实例给属性、变量或常量时，这些属性、变量或常量会对实例进行强引用。之所以称之为“强”引用，是因为它将稳定的保持住实例，只要强引用还存在就不允许该实例被释放内存。

### ARC 实战

下面是一个例子展示了 ARC 是如何工作的。首先定义一个简单的类 `Person`，它有一个常量 `name`。

```swift
class Person {
    let name: String
    init(name: String) {
        self.name = name
        print("\(name) is being initialized")
    }
    deinit {
        print("\(name) is being deinitialized")
    }
}
```

> R：就不一行一行解释这个类了，相信都能看懂，文档真啰嗦。

下面定义三个 `Person?` 类型的变量，用来对之后的 `Person` 实例设置多个引用关系。它们是可选类型，所以它们会在没有赋值 `Person` 类型的值之前被初始化为 `nil`。

```swift
var reference1: Person?
var reference2: Person?
var reference3: Person?
```

先给一个变量赋值。

```swift
reference1 = Person(name: "John Appleseed")
// Prints "John Appleseed is being initialized"
```

注意初始化器中的信息被打印出来了，这确认了初始化器被执行了。

因为 `reference1` 变量被赋值了新的 `Person` 对象，这个对象有了一个强引用。而因为存在至少一个强引用存在，ARC 就会保持其存在内存之中而不去释放它。

如果你将其赋值给另外两个变量，则该对象就多了两个强引用。

```swift
reference2 = reference1
reference3 = reference1
```

现在这个实例有三个强引用。

通过给变量赋值为 `nil` 可以移除对实例的强引用。下面移除两个强引用，但是因为还存在一个强引用存在，它还不会被释放掉。

```swift
reference1 = nil
reference2 = nil
```

在第三个强引用被移除之前 ARC 都不会释放它。现在我们移除最后一个强引用，你可以看到卸载器中的消息被打印出来，表明这个实例以及被释放掉了。

```swift
reference3 = nil
// Prints "John Appleseed is being deinitialized"
```

### 类实例之间的强引用循环

上面的例子中，ARC 可以计算你所创建的 `Person` 实例的强引用数量，并且在不需要该实例的时候进行释放。

但是，也可能出现一个实例的强引用数量永远也不会为零的情况。这种情况一般是两个实例都保持对方的强引用，因此它们相互保持不被释放。这就是所谓的强引用循环。

要解决强引用循环，你可以将两个类的关系定义为弱引用，或者是非持有引用。这个处理在后文还会解释。但是在你尝试解决这个问题之前，先了解一下造成这个问题的原因吧。

下面是一个偶尔造成强引用循环的例子。这个例子定义了 `Person` 和 `Apartment` 类，用来表示一个公寓和其住户。

```swift
class Person {
    let name: String
    init(name: String) { self.name = name }
    var apartment: Apartment?
    deinit { print("\(name) is being deinitialized") }
}

class Apartment {
    let unit: String
    init(unit: String) { self.unit = unit }
    var tenant: Person?
    deinit { print("Apartment \(unit) is being deinitialized") }
}
```

每一个 `Person` 实例都有一个 name 属性和一个 apartment 属性。apartment 属性是可选的，因为可能这个人可能没有公寓。

相同的，每个 `Apartment` 实例会有一个 unit 属性和一个 tenant 属性。tenant 也是可选的，因为一个公寓可能也会没人住。

这两个类都定义了卸载器，在不需要这些实例的时候打印一些提示信息。这可以让你看看实例是否如你预期的一样被释放。

下面定义两个变量准备创建新的实例。它们的类型都是可选的，目前它们被初始化为 `nil`。

```swift
var john: Person?
var unit4A: Apartment?
```

现在我们来创建各自的实例。

```swift
john = Person(name: "John Appleseed")
unit4A = Apartment(unit: "4A")
```

现在，这两个变量拥有各自实例的强引用。

```text
john                                unit4A

↓强引用                             ↓强引用

Person 实例                         Apartment 实例
name: "John Appleseed"              unit: "4A"
apartment: nil                      tenant: nil
```

接下来将这两个实例关联起来，让 John 住进公寓，让公寓又一个住户。注意这里使用感叹号强制解包类型来赋值。

```swift
john!.apartment = unit4A
unit4A!.tenant = john
```

现在这两个实例直接相互持有对方的强引用关系。

```text
john                                        unit4A

↓强引用                                     ↓强引用

Person 实例                 ←强引用         Apartment 实例
name: "John Appleseed"      强引用→         unit: "4A"
apartment: <Apartment 实例>                 tenant: <Person 实例>
```

不幸的是，将这两个实例连接起来会造成强引用循环。两者互相持有对方的强引用，就算我们将两个变量设为 `nil`，它们的强引用计数也不会归零，ARC 无法释放它们。

```swift
john = nil
unit4A = nil
```

注意卸载器并没有执行。强引用循环阻止两个实例被 ARC 释放。这会造成你的 APP 内存泄露。

两个实例的关系如下。

```text
john                                        unit4A


Person 实例                 ←强引用         Apartment 实例
name: "John Appleseed"      强引用→         unit: "4A"
apartment: <Apartment 实例>                 tenant: <Person 实例>
```

两个实例之前的强引用仍然存在，且无法分隔。

### 解决两个类型之间的强引用循环

Swift 提供 2 种方式解决类型之间的强引用循环：弱引用和非持有引用（unowned references）。

这两种方式都可以让两者相互引用但不保持对方的强引用，这样就不会进入一个强引用循环了。

在另一个实例生命周期较短时使用弱引用，因为另一个实例可能会先一步被释放掉。在上面的例子中，Apartment 的生命周期中可能有部分时间是没有住户的，所以这里住户属性可以是一个弱引用，这样就不会造成一个强引用循环了。相反，在另一个实例有类似或者更长的生命周期时使用非持有引用。

### 弱引用

弱引用不保持类型的强引用关系，ARC 不会将其作为引用计数的一个，弱引用也就不会阻止 ARC 释放实例。这个行为可以阻止陷入一个强引用循环中。要使用弱引用，在属性声明前加上 `weak` 关键字。

由于不保持引用类型的强引用关系，所以有可能会出现所引用的类型已经被 ARC 释放的情况，对于这种情况，ARC 会自动将其设为 `nil`，也因此弱引用类型必须是一个可选的类型，因为在运行时它可能被设置为 `nil`。

你可以像处理可选类型那样检查弱引用的类型是否还存在。

> R：文档提示，属性监视会在弱引用类型被设置为 `nil` 时触发。

下面的示例和之前一样，不同之处在于这次 Apartment 的属性 tenant 是弱引用的。

```swift
class Person {
    let name: String
    init(name: String) { self.name = name }
    var apartment: Apartment?
    deinit { print("\(name) is being deinitialized") }
}

class Apartment {
    let unit: String
    init(unit: String) { self.unit = unit }
    weak var tenant: Person?
    deinit { print("Apartment \(unit) is being deinitialized") }
}
```

当变量关联到两个实例时，由变量保持它们的强引用，就如之前一样。

```swift
var john: Person?
var unit4A: Apartment?

john = Person(name: "John Appleseed")
unit4A = Apartment(unit: "4A")

john!.apartment = unit4A
unit4A!.tenant = john
```

下面是变量与实例的关系。

```text
john                                        unit4A

↓强引用                                     ↓强引用

Person 实例                 ←弱引用         Apartment 实例
name: "John Appleseed"      强引用→         unit: "4A"
apartment: <Apartment 实例>                 tenant: <Person 实例>
```

与之前的不同之处在于 Apartment 对 Person 现在是弱引用了。这意味着当你不需要了 john 时，将变量设置为 `nil`，实例就没有其他强引用了。

```swift
john = nil
// Prints "John Appleseed is being deinitialized"
```

结果就是，Person 实例被释放了，Apartment 实例对其的引用被设置为 `nil`。

```text
john                                        unit4A

                                            ↓强引用

Person 实例                                 Apartment 实例
name: "John Appleseed"                      unit: "4A"
apartment: <Apartment 实例>                 tenant: nil
```

Apartment 实例剩下的唯一一个强引用就是变量 unit4A。如果你移除这个强引用，Apartment 实例就没有强引用了。

```swift
unit4A = nil
// Prints "Apartment 4A is being deinitialized"
```

两个实例都被释放了。

```text
john                                        unit4A



Person 实例                                 Apartment 实例
name: "John Appleseed"                      unit: "4A"
apartment: <Apartment 实例>                 tenant: nil
```

> R：文档提示。在系统中使用垃圾回收机制时，弱引用有时被用来实现一个简单的缓存机制，因为没有强引用的对象只有在被内存压力触发垃圾回收时才会被释放。但是 ARC 会在强引用归零时立即释放对象，弱引用在这里不适合用于此目的。

### 非持有引用（Unowned References）

非持有引用和弱引用相同，都不保持实例的强引用。与弱引用不同，非持有引用用于其他实例生命周期相同或长于自己的情况。指定非持有引用，在声明变量和属性前添加 `unowned` 关键字。

非持有引用预期引用的实例会一直存在。所以其结果是 ARC 不会像处理弱引用那样在引用被释放时给其设置 `nil`。这也导致非持有引用要使用非可选类型进行声明。

> 重要 ⚠️
>
> 仅在你确定直到实例生命周期结束其所引用的对象始终不会被释放时才使用非持有引用。
>
> 不然，你会得到一个运行时错误。

下面定义两个类，Customer 和 CreditCard，用来模拟银行客户和一张客户可以使用的信用卡。两者互相将对方的实例作为自己的属性。它们有潜在的可能造成强引用循环。

Customer 和 CreditCard 之间的关系和上面公寓和住户的关系有些许不同。用户可能有也可能没有信用卡，但是信用卡肯定会被用户持有。没有哪张信用卡会抛弃用户独活。为了表达这一点，对用户来说信用卡属性是可选类型的，但是对于信用卡来说，客户属性是非持有引用的。

此外，CreditCard 实例还需要通过传递一个数字和一个用户实例才可以创建。这可以保证 CreditCard 实例创建时始终关联着某个用户。

```swift
class Customer {
    let name: String
    var card: CreditCard?
    init(name: String) {
        self.name = name
    }
    deinit { print("\(name) is being deinitialized") }
}

class CreditCard {
    let number: UInt64
    unowned let customer: Customer
    init(number: UInt64, customer: Customer) {
        self.number = number
        self.customer = customer
    }
    deinit { print("Card #\(number) is being deinitialized") }
}
```

> R：文档提示，这里信用卡的 number 属性声明为 `UInt64` 是为了保证不管在 32 位系统或 64 位系统上，这个属性都有足够的空间储存一个 16 位的信用卡号。

下面声明一个变量将要用来创建一个顾客。这是个可选类型，现在它被初始化为 `nil` 了。

```swift
var john: Customer?
```

现在可以创建一个顾客实例了，然后再发一张信用卡给它。

```swift
john = Customer(name: "John Appleseed")
john!.card = CreditCard(number: 1234_5678_9012_3456, customer: john!)
```

现在实例之间的关系是这样的。

```text

john

↓强引用

Customer                    强引用→         CreditCard
name: "John Appleseed"      ←非持有引用     number: 123..6
card: <CreditCard 实例>                     customer: <Customer 实例>
```

两者之间的关系：顾客实例对信用卡实例持有强引用；信用卡实例对顾客实例是非持有引用关系。

此时如果移除 john 变量对顾客实例的引用，顾客实例的强引用就归零了，ARC 会对其进行释放，同时也导致信用卡实例的强引用归零，ARC 再对信用卡实例进行释放。

> R：一尸两命！(๑✧◡✧๑)

```swift
john = nil
// Prints "John Appleseed is being deinitialized"
// Prints "Card #1234567890123456 is being deinitialized"
```

> R：文档提示上面已经告诉你如何正确使用非持有引用了，之后使用非持有引用的安全性问题你要自己负责了，反之你用错了你的 App 就会崩溃。＼＼\\\ ٩( 'ω' )و //／／

### 非持有引用和隐式的可选类型属性解包

上面关于弱引用和非持有引用的两个例子刚好完美解决了问题。但是有时问题不会这么简单，比如下面这个例子。

定义一个 Country 和 City 类。这两个类型都持有对方的实例作为自己的属性。对于 City 来说它必须属于一个国家，而对于 Country 来说它必须有一个首都城市。于是，City 的初始化器需要关联一个 Country 实例，而 Country 被创建时会自动创建一个 City 实例作为首都城市。但是矛盾是，在 Country 的属性没有初始化完成是它还不能使用 `self`。但是要创建一个 City 实例则必须提供一个 Country 实例。

> R：根据初始化器章节的描述，实例初始化过程分两步进行，第一步保证所有属性初始化完成，第二步才能访问 `self`。这里 City 作为其属性没有完成初始化，所以无法将 `self` 作为参数传递给 City 的初始化器。

为了解决这个问题，使用感叹号对属性进行隐式解包。这样声明的属性是可选类型属性，在初始化时会分配 `nil` 保证完成初始化步骤的第一步，于是在第二步中可以将 `self` 传递给 City 的初始化器创建一个 City 实例，赋值给 Country 实例作为首都城市属性。而外部访问 Country 的首都城市属性可以正常访问，而不用像处理可选类型那样添加感叹号。

先捋一下关系，首先 Country 存在，它必须有一个 capitalCity 属性，所以其对 City 类型是强引用。City 类型则必须属于某个 Country，没有 Country 的话 City 不应该存在，City 的 country 属性应该是非持有引用。

然后为了先完成初始化再给 capitalCity 属性具体赋值，Country 类型需要先将其声明为可选类型，但是在初始化器中完成属性初始化后在第二步为其赋值，所以对外部来说其 capitalCity 属性是始终存在的，并不是一个可选类型。为了做到这一点，Country 在定义属性类型后添加感叹号对其进行隐式解包。

```swift
class Country {
    let name: String
    var capitalCity: City!
    init(name: String, capitalName: String) {
        self.name = name
        self.capitalCity = City(name: capitalName, country: self)
    }
}

class City {
    let name: String
    unowned let country: Country
    init(name: String, country: Country) {
        self.name = name
        self.country = country
    }
}


var country = Country(name: "Canada", capitalName: "Ottawa")
print("\(country.name)'s capital city is called \(country.capitalCity.name)")
// Prints "Canada's capital city is called Ottawa"
```

### 闭包的强引用循环

闭包同样是一个引用类型，所以闭包也可能会造成一个强引用循环。来看下面的例子。

```swift
class HTMLElement {

    let name: String
    let text: String?

    lazy var asHTML: () -> String = {
        if let text = self.text {
            return "<\(self.name)>\(text)</\(self.name)>"
        } else {
            return "<\(self.name) />"
        }
    }

    init(name: String, text: String? = nil) {
        self.name = name
        self.text = text
    }

    deinit {
        print("\(name) is being deinitialized")
    }

}
```

注意这里定义了一个 HTMLElement 类，用来描述一个 HTML 元素。它有一个卸载器在被释放时打印一些信息。它的属性 `asHTML` 是一个闭包，在闭包中调用了 `self` 的属性。这里 `asHTML` 属性被声明为 lazy，因为其在初始化阶段是无法访问 `self` 的。这里的问题是 `asHTML` 是一个闭包，因为在里面使用了 `self`，所以实际上这个闭包对实例的 `self` 保持了一个强引用，同时它是实例的属性，实例对其也保持了强引用，这就造成了一个强引用循环。

`asHTML` 实际上是一个方法，将其定义为闭包的好处在于你可以随时更换这个方法的实现。比如下面这样。

```swift
let heading = HTMLElement(name: "h1")
let defaultText = "some default text"
heading.asHTML = {
    return "<\(heading.name)>\(heading.text ?? defaultText)</\(heading.name)>"
}
print(heading.asHTML())
// Prints "<h1>some default text</h1>"
```

现在我们定义一个变量。

```swift
var paragraph: HTMLElement? = HTMLElement(name: "p", text: "hello, world")
print(paragraph!.asHTML())
// Prints "<p>hello, world</p>"
```

再尝试销毁它。

```swift
paragraph = nil
```

卸载器没有被调用，完蛋！它陷入了一个和自己的闭包属性之间的强引用循环，并且无法自拔！

### 解决闭包的强引用循环

解决闭包和实例之间的强引用循环，使用一个捕获列表来定义闭包对其捕获的引用是属于弱引用或者非持有引用。这个捕获列表写在闭包里面。

注意捕获列表中的引用是弱引用或者非持有引用，只能二选一。写法是放在闭包参数和返回值类型的前面。

```swift
lazy var someClosure: (Int, String) -> String = {
    [unowned self, weak delegate = self.delegate!] (index: Int, stringToProcess: String) -> String in
    // closure body goes here
}
```

如果闭包没有参数并且返回值类型可以被推测，则将捕获列表写在闭包体前。

```swift
lazy var someClosure: () -> String = {
    [unowned self, weak delegate = self.delegate!] in
    // closure body goes here
}
```

如果如例子中的 HTMLElement 和其闭包属性 `asHTML` 这样的关系，应该在闭包中使用非持有引用捕获实例的 `self`，原因是它们将在同时被销毁释放，它们本身就是同一个生命周期。

相反，如果引用类型生命周期比闭包短则定义一个弱引用，引用对象被销毁时 ARC 会将其设置为 `nil`，你可以据此检查这个引用是否还存在。

原则上，如果这个引用始终不会变成 `nil` 则应该始终使用非持有引用。

下面用捕获列表定义实例的 `self` 为闭包的非持有引用，解决实例和闭包之间的强引用循环问题。

```swift
class HTMLElement {

    let name: String
    let text: String?

    lazy var asHTML: () -> String = {
        [unowned self] in
        if let text = self.text {
            return "<\(self.name)>\(text)</\(self.name)>"
        } else {
            return "<\(self.name) />"
        }
    }

    init(name: String, text: String? = nil) {
        self.name = name
        self.text = text
    }

    deinit {
        print("\(name) is being deinitialized")
    }

}


var paragraph: HTMLElement? = HTMLElement(name: "p", text: "hello, world")
print(paragraph!.asHTML())
// Prints "<p>hello, world</p>"


paragraph = nil
// Prints "p is being deinitialized"
```

看，它正常销毁了。

# 相关

> 27.[Swift Opaque Types](https://github.com/zfanli/notes/blob/master/swift/27.OpaqueTypes.md)
>
> 29.[Swift Memory Safety](https://github.com/zfanli/notes/blob/master/swift/29.MemorySafety.md)
