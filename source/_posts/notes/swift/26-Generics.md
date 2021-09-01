---
title: 26.Swift Generics
tags:
  - Swift
date: '2019-07-12T14:28:35.099Z'
categories:
  - notes
  - swift
---

看完这篇主题只觉得：

- 泛型可以为所欲为；
- where 语句可以为所欲为。

开个玩笑。

泛型是这门语言的核心内容之一。它可以减少重复代码，拓宽相同逻辑能处理的类型。总结一下其基本思想就是，只要你满足我预期的要求，我就能帮你完成你预期的任务。

<!-- more -->

泛型最简单的应用就是直接在函数或类型上使用，这样的泛型函数或泛型类型的优势是对能处理的参数类型不设限制或者用类型限制语法设定一定的限制，但是和传统函数和类型相比，泛型函数和类型最大程度利用了相同逻辑，你不必因为类型不同而将相同逻辑复制一遍又一遍。

泛型的进阶用法是泛型协议。泛型协议更为灵活，在协议中使用 `associatedtype` 关键字定义一个关联类型的名称，然后对这个类型进行操作。灵活之处在于协议不去限定这个关联类型实际上是哪种类型，而实现这个协议对时候，你还可以选择直接指定关联类型是某个类型，或者仍然定义其为泛型类型，在被调用时才最终决定这个关联类型的实际类型。

泛型的话题大概就是这些。此外为了配合泛型的使用，where 语句提供了泛型的另外一部分强大能力。where 语句几乎能用于任何定义类型的地方，对声明类型进行一些限制，甚至配合扩展机制可以更灵活的根据条件对类型进行扩展。

相信用好泛型可以使代码质量上升不止一个层次。

## 泛型

泛型代码可以根据你所定义的需求让你写出更具有灵活性的、可复用的函数和类型，这些函数和类型可以和任何类型一起工作。能使你避免重复代码，并用更清晰和抽象的方式表达意图。

泛型是 Swift 最强大的功能之一，多数 Swift 标准库就是基于泛型建立的。实际上虽然你可能没有察觉到，在这片指南中你已经在使用泛型了。比如说 Swift 的数组和字典类型就是泛型集合。你可以创建整型数组，或者字符串数组，或者其他任何类型的数组。字典类型也是相同的，你可以创建储存任何指定类型的字典类型，实际上对字典类型能储存哪些类型是没有限制的。

### 泛型解决的问题

下面是一个标注的非泛型函数，包装了两个整型参数。

```swift
func swapTwoInts(_ a: inout Int, _ b: inout Int) {
    let temporaryA = a
    a = b
    b = temporaryA
}
```

这个函数使用 `inout` 参数。它的功能是给参数 `a` 和 `b` 的值对调。

```swift
var someInt = 3
var anotherInt = 107
swapTwoInts(&someInt, &anotherInt)
print("someInt is now \(someInt), and anotherInt is now \(anotherInt)")
// Prints "someInt is now 107, and anotherInt is now 3"
```

`swapTwoInts(_:_:)` 函数很有用，但却只能处理整型数据，如果你需要对调字符串，对调浮点数，你还得写更多的函数，比如下面的这些。

```swift
func swapTwoStrings(_ a: inout String, _ b: inout String) {
    let temporaryA = a
    a = b
    b = temporaryA
}

func swapTwoDoubles(_ a: inout Double, _ b: inout Double) {
    let temporaryA = a
    a = b
    b = temporaryA
}
```

你可能注意到了，这三个函数是完全一致的。唯一的区别在于它们能接受的参数类型。

如果能有一个函数可以对调任何类型的两个值将是非常有用的。泛型代码可以让你写出这个函数。

```swift
func swapTwoValues<T>(_ a: inout T, _ b: inout T) {
    let temporaryA = a
    a = b
    b = temporaryA
}
```

看出区别来了吗？没有？没关系我们将这个函数的第一行和上面的函数放在一起对比一下。

```swift
func swapTwoInts(_ a: inout Int, _ b: inout Int)
func swapTwoValues<T>(_ a: inout T, _ b: inout T)
```

没错，定义泛型的方法就是那个尖括号和里面的 T。T 在这里是 Types 的意思，它作为一个占位符在这里取代实际的类型名称。这个占位符不去声明类型 T 必须是什么类型，但在这里它说明了参数 `a` 和 `b` 必须是相同类型。具体 T 到底是什么类型是在每次调用这个函数时决定的。

```swift
var someInt = 3
var anotherInt = 107
swapTwoValues(&someInt, &anotherInt)
// someInt is now 107, and anotherInt is now 3

var someString = "hello"
var anotherString = "world"
swapTwoValues(&someString, &anotherString)
// someString is now "world", and anotherString is now "hello"
```

> R：文档提示，Swift 标准库中存在一个函数 `swap(_:_:)` 提供上面例子中的函数功能，如果你真的需要，不需要自己去实现一个。

### 类型参数

在上面的例子中，类型参数 T 就是一个很好的例子。类型参数指定并命名一个占位符类型，以 `<T>` 的形式写在函数名的后面。你只要指定了一个占位符类型，你就可以在参数上指定该类型，或者声明返回值类型，甚至在函数体中，你也可以用它标注类型。无论哪种场合，占位符类型 T 最终会在函数被调用时被确定。

你可以指定多个占位符类型，使用逗号隔开。

### 命名类型参数

大多数场合，泛型参数的名称是描述性的，比如在 `Dictionary<Key, Value>` 中的 `Key` 和 `Value`，以及 `Array<Element>` 中的 `Element`，这些名称可以告诉读者它与函数之间的关系。不过，当两者之前不存在有意义的关系时，通常的做法是使用 `T`、`U` 或 `V` 等字母来作为类型参数的名称。

### 泛型类型

除了泛型函数，你还可以定义泛型类型。泛型类型是指可以处理任何类型的定制化类、结构体和枚举类型，就像字典类型和数组类型一样。

这一节告诉你如何写一个叫做 `Stack` 的泛型集合类型。一个 stack 是一组有序的值（Ordered set of values），它类似于数组，但在操作集上比 Swift 的数组有更多的限制。在数组中，新的元素可以从任何位置上加入/移除，但是一个 stack 只能将新元素加在末尾，同时只允许元素从末尾移除。

> R：如果你不好理解 `Stack` 对元素添加和删除的限制用意，请尝试思考以下网页上的面包屑导航元素，新的页面导航会加在后面，而返回前一个页面实际上就是删除最后一个页面元素，类似一个递归的流程。

下面看一个图解来理解一下 `Stack` 的添加和移除行为。

```text
  ↓   ↑
  □ ■ □
■ ■ ■ ■ ■
■ ■ ■ ■ ■
■ ■ ■ ■ ■
```

1. 当前三个值；
2. 第四个值放在顶部；
3. 现在四个值，最近的值在最上面；
4. 最上面的值移除；
5. 当前又变成三个值。

下面是非泛型版本的实现。

```swift
struct IntStack {
    var items = [Int]()
    mutating func push(_ item: Int) {
        items.append(item)
    }
    mutating func pop() -> Int {
        return items.removeLast()
    }
}
```

`IntStack` 实现了对整型数据的先进先出功能。但是它只能处理整数，下面是泛型版本。

```swift
struct Stack<Element> {
    var items = [Element]()
    mutating func push(_ item: Element) {
        items.append(item)
    }
    mutating func pop() -> Element {
        return items.removeLast()
    }
}
```

它们基本都是一致是，但是一旦加上泛型之后，它的功能就被拓宽了。你现在可以创建任何类型的 `Stack` 了。

```swift
var stackOfStrings = Stack<String>()
stackOfStrings.push("uno")
stackOfStrings.push("dos")
stackOfStrings.push("tres")
stackOfStrings.push("cuatro")
// the stack now contains 4 strings
```

移除一个值。

```swift
let fromTheTop = stackOfStrings.pop()
// fromTheTop is equal to "cuatro", and the stack now contains 3 strings
```

### 扩展一个泛型类型

扩展一个泛型类型不需要像定义时那样提供类型参数列表。但是定义过的泛型类型在扩展内部是可以直接使用的。

下面的例子扩展了 `Stack` 给其添加了一个只读属性。

```swift
extension Stack {
    var topItem: Element? {
        return items.isEmpty ? nil : items[items.count - 1]
    }
}
```

看看怎么访问这个属性。

```swift
if let topItem = stackOfStrings.topItem {
    print("The top item on the stack is \(topItem).")
}
// Prints "The top item on the stack is tres."
```

### 类型限制

目前为止定义的泛型类型都是可以处理任何类型的。但是有时对泛型类型进行一定的限制是非常有用的。类型限制指定类型参数必须继承自某个类，或者实现某个特殊的协议或是协议组合。

比如 Swift 的字典类型要求 Key 的值必须是可哈希的，也就是说，它必须提供一方式让其变得唯一。字典类型要求 Key 必须是可哈希的，这样它就可以检查一个 Key 是否有对应的值了。如果没有这个限制，那字典类型插值时就不能发现一个 Key 是否已经被赋值，也不能通过一个 Key 去找指定的值了。

Swift 中，`Dictionary` 的 key 声明了类型限制，强制要求 key 类型必须是实现了标准库中的特殊协议 `Hashable`。在 Swift 中所有基础类型都是默认实现了这个协议的。

你在声明自己的泛型类型时可以定义你需要的类型限制，这些限制给泛型编程提供了强大的能力。

像 `Hashable` 之类的抽象概念是用其概念上的特性来表述其类型的，而不是它的实际类型。

### 类型限制语法

声明一个泛型的类型限制，在其名称之后加冒号，接预期的类名或者协议名称即可。

```swift
func someFunction<T: SomeClass, U: SomeProtocol>(someT: T, someU: U) {
    // function body goes here
}
```

上面的例子中有两个泛型类型，`T` 和 `U`。其中 `T` 要求是指定类型 `SomeClass` 的子类，而 `U` 需要是实现了 `SomeProtocol` 协议的任何类型。

### 类型限制实践

下面的例子中定义了一个非泛型的函数，其功能是接受一个字符串和字符串数组，遍历这个数组然后匹配字符串，在找到相同的元素时返回数组的索引，否则返回 `nil`。

```swift
func findIndex(ofString valueToFind: String, in array: [String]) -> Int? {
    for (index, value) in array.enumerated() {
        if value == valueToFind {
            return index
        }
    }
    return nil
}
```

下面是它的使用示例。

```swift
let strings = ["cat", "dog", "llama", "parakeet", "terrapin"]
if let foundIndex = findIndex(ofString: "llama", in: strings) {
    print("The index of llama is \(foundIndex)")
}
// Prints "The index of llama is 2"
```

这个原理不仅对字符串有用，你可以写一个泛型函数来处理任何类型，执行相同的操作。你可能预期下面这个函数来应对所有类型。它的返回值还是 `Int?` 因为其返回数组的索引，或者 `nil` 如果数组不存在这个元素。

```swift
func findIndex<T>(of valueToFind: T, in array:[T]) -> Int? {
    for (index, value) in array.enumerated() {
        if value == valueToFind {
            return index
        }
    }
    return nil
}
```

但实际上上面这个函数无法编译，原因在于这一句：`if value == valueToFind`。Swift 中不是所有类型都可以使用双等号操作符进行比较。假如你自己定义了一个类或者结构体用来表述一个复杂的数据模型，Swift 无法猜测出这个类型的实例直接的”等于“的关系。因为这一点，无法保证所有类型都能让这段代码正常执行，所以在编译时会报出一个适当的错误。

不过还有机会。Swift 标准库定义了一个称作 `Equatable` 的协议，要求符合该协议的类型实现相等和不等比较操作符（== and !=）。Swift 中所有标准类型都实现了这个协议。

所有符合 `Equatable` 协议的类型都可以安全的执行上面这个函数，因为可以保证双等号操作是有效的。为了表达这一点，你需要给这个泛型函数添加类型限制。

```swift
func findIndex<T: Equatable>(of valueToFind: T, in array:[T]) -> Int? {
    for (index, value) in array.enumerated() {
        if value == valueToFind {
            return index
        }
    }
    return nil
}
```

现在这个函数可以和预期一样使用了。

```swift
let doubleIndex = findIndex(of: 9.3, in: [3.14159, 0.1, 0.25])
// doubleIndex is an optional Int with no value, because 9.3 isn't in the array
let stringIndex = findIndex(of: "Andrea", in: ["Mike", "Malcolm", "Andrea"])
// stringIndex is an optional Int containing a value of 2
```

### 关联类型（Associated Types）

在协议中声明关联类型是很有用的操作。协议中的关联类型是指一个类型名称的占位符。在协议中不指定具体类型，由实现这个协议的类型来指定。声明关联类型需要 `associatedtype` 关键字。

### 关联类型实践

看看下面的例子。

```swift
protocol Container {
    associatedtype Item
    mutating func append(_ item: Item)
    var count: Int { get }
    subscript(i: Int) -> Item { get }
}
```

这个协议要求实现它的类型提供三个能力：

- 必须能使用 `append(_:)` 方法添加新的元素；
- 必须能提供 `count` 属性返回一个整数值；
- 必须能通过下标用整数值索引访问元素。

但这个协议不指定所储存的类型，它只定义了一个类型名称的占位符 `Item`。

下面是一个非泛型版本的实现。

```swift
struct IntStack: Container {
    // original IntStack implementation
    var items = [Int]()
    mutating func push(_ item: Int) {
        items.append(item)
    }
    mutating func pop() -> Int {
        return items.removeLast()
    }
    // conformance to the Container protocol
    typealias Item = Int
    mutating func append(_ item: Int) {
        self.push(item)
    }
    var count: Int {
        return items.count
    }
    subscript(i: Int) -> Int {
        return items[i]
    }
}
```

`IntStack` 实现了协议的三个要求。而且它还是用了类型别名，将 `Int` 类型定义别名 `Item`，将协议中的关联类型转换为了一个具体的类型。当然，Swift 可以自己推测关联类型的实际类型，所以 `typealias Item = Int` 这一句是可以省略的。

下面是一个泛型版本的实现，它能应对的类型更多。

```swift
struct Stack<Element>: Container {
    // original Stack<Element> implementation
    var items = [Element]()
    mutating func push(_ item: Element) {
        items.append(item)
    }
    mutating func pop() -> Element {
        return items.removeLast()
    }
    // conformance to the Container protocol
    mutating func append(_ item: Element) {
        self.push(item)
    }
    var count: Int {
        return items.count
    }
    subscript(i: Int) -> Element {
        return items[i]
    }
}
```

Swift 可以推测出泛型 Element 是关联类型的实际类型，虽然此时依旧没有确定下来，但是在实例化的时候会最终被确定。

### 扩展现有类型指定关联类型

你可以使用扩展机制给现有的类型添加某个协议的实现，这包括关联类型。

Swift 的 Array 类型已经满足了 `Container` 协议的三个要求，你可以用一个空的扩展直接声明 Array 实现该协议。

```swift
extension Array: Container {}
```

### 给关联类型添加类型限制

类型限制适用于关联类型，看看下面的例子。

```swift
protocol Container {
    associatedtype Item: Equatable
    mutating func append(_ item: Item)
    var count: Int { get }
    subscript(i: Int) -> Item { get }
}
```

### 在类型限制中使用协议本身

协议本身可以作为自身要求的一部分。例如这里有一个协议改善了 `Container` 协议。它添加了一个 `suffix(_:)` 方法，功能是指定一个长度，从容器最后往前数，返回这个长度的元素。

```swift
protocol SuffixableContainer: Container {
    associatedtype Suffix: SuffixableContainer where Suffix.Item == Item
    func suffix(_ size: Int) -> Suffix
}
```

`Suffix` 是一个关联类型，有两个限制：它必须实现本身协议（在这里是 `SuffixableContainer`）；并且它的 `Item` 类型必须和当前容器的 `Item` 类型相同。

下面对 Stack 进行扩展使其符合 `SuffixableContainer` 协议。

```swift
extension Stack: SuffixableContainer {
    func suffix(_ size: Int) -> Stack {
        var result = Stack()
        for index in (count-size)..<count {
            result.append(self[index])
        }
        return result
    }
    // Inferred that Suffix is Stack.
}
var stackOfInts = Stack<Int>()
stackOfInts.append(10)
stackOfInts.append(20)
stackOfInts.append(30)
let suffix = stackOfInts.suffix(2)
// suffix contains 20 and 30
```

上面的例子中关联类型 `Suffix` 的类型同样是 Stack，所以用 suffix 操作返回的对象类型依旧是 Stack。

或者 `Suffix` 类型其实并不需要一定是其本身，只要符合 `SuffixableContainer` 协议就可以。比如下面的例子，suffix 操作返回的是 Stack<Int> 而并不是 IntStack 类型。

```swift
extension IntStack: SuffixableContainer {
    func suffix(_ size: Int) -> Stack<Int> {
        var result = Stack<Int>()
        for index in (count-size)..<count {
            result.append(self[index])
        }
        return result
    }
    // Inferred that Suffix is Stack<Int>.
}
```

### 泛型 Where 语句

对关联类型进行类型限制也是很实用的。下面的例子中使用 where 语句对参数中两个容器的关联类型 Item 进行了类型限制。

```swift
func allItemsMatch<C1: Container, C2: Container>
    (_ someContainer: C1, _ anotherContainer: C2) -> Bool
    where C1.Item == C2.Item, C1.Item: Equatable {

        // Check that both containers contain the same number of items.
        if someContainer.count != anotherContainer.count {
            return false
        }

        // Check each pair of items to see if they're equivalent.
        for i in 0..<someContainer.count {
            if someContainer[i] != anotherContainer[i] {
                return false
            }
        }

        // All items match, so return true.
        return true
}
```

它可以这样用。

```swift
var stackOfStrings = Stack<String>()
stackOfStrings.push("uno")
stackOfStrings.push("dos")
stackOfStrings.push("tres")

var arrayOfStrings = ["uno", "dos", "tres"]

if allItemsMatch(stackOfStrings, arrayOfStrings) {
    print("All items match.")
} else {
    print("Not all items match.")
}
// Prints "All items match."
```

> R：文档对其解释了一大堆，实际上我觉得看代码一看就懂。只是好像没说到如果 where 语句的条件不满足会怎么样，但是想想也能知道，肯定编译报错了呗，(・ω<)。

### 扩展使用泛型 Where 语句

这个就是按条件进行扩展了，但是条件是一个泛型。

```swift
extension Stack where Element: Equatable {
    func isTop(_ item: Element) -> Bool {
        guard let topItem = items.last else {
            return false
        }
        return topItem == item
    }
}
```

实际使用起来。

```swift
if stackOfStrings.isTop("tres") {
    print("Top element is tres.")
} else {
    print("Top element is something else.")
}
// Prints "Top element is tres."
```

如果这个 Stack 的 Element 类型没有实现 Equatable 呢？会报错。

```swift
struct NotEquatable { }
var notEquatableStack = Stack<NotEquatable>()
let notEquatableValue = NotEquatable()
notEquatableStack.push(notEquatableValue)
notEquatableStack.isTop(notEquatableValue)  // Error
```

再换一个例子。

```swift
extension Container where Item: Equatable {
    func startsWith(_ item: Item) -> Bool {
        return count >= 1 && self[0] == item
    }
}
```

再用一用。

```swift
if [9, 9, 9].startsWith(42) {
    print("Starts with 42.")
} else {
    print("Starts with something else.")
}
// Prints "Starts with something else."
```

例子三连。

```swift
extension Container where Item == Double {
    func average() -> Double {
        var sum = 0.0
        for index in 0..<count {
            sum += self[index]
        }
        return sum / Double(count)
    }
}
print([1260.0, 1200.0, 98.6, 37.0].average())
// Prints "648.9"
```

### 关联类型和泛型 Where 语句

> R：这几个小节连续下来只告诉了我什么叫啰嗦，还有 where 是只要指定类型就是能用的。咱啥也不多说了，看例子吧。

```swift
protocol Container {
    associatedtype Item
    mutating func append(_ item: Item)
    var count: Int { get }
    subscript(i: Int) -> Item { get }

    associatedtype Iterator: IteratorProtocol where Iterator.Element == Item
    func makeIterator() -> Iterator
}
```

协议继承也能用 Where 对关联类型进行点什么要求。

```swift
protocol ComparableContainer: Container where Item: Comparable { }
```

### 泛型下标

> R：没想到吧，下表也能泛型，还用上了 where 呢！

```swift
extension Container {
    subscript<Indices: Sequence>(indices: Indices) -> [Item]
        where Indices.Iterator.Element == Int {
            var result = [Item]()
            for index in indices {
                result.append(self[index])
            }
            return result
    }
}
```

这里 Indices 其实可以理解成一个数组，传递这个对象给下标，可以得到一个 Item 数组，包含 Indices 中所有索引对应的元素。

> R：泛型真的是可以为所欲为！

# 相关

> 25.[Swift Protocols](https://github.com/zfanli/notes/blob/master/swift/25.Protocols.md)
>
> 27.[Swift Opaque Types](https://github.com/zfanli/notes/blob/master/swift/27.OpaqueTypes.md)
