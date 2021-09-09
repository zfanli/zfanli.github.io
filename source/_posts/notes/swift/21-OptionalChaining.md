---
title: 21.Swift Optional Chaining
tags:
  - Swift
date: "2019-07-03T14:28:35.099Z"
---

可选型操作链（Optional Chaining）是为了应对查询或调用当前可能是 `nil` 的变量的属性、方法和下标时的一个处理。当这个变量有值时操作会成功，否则会返回 `nil`。多个查询或调用操作可以链接在一起。链上的每个操作返回 `nil` 时，操作就会结束并返回 `nil`。

<!-- more -->

## 可选型操作链

### 可选型操作链作为强制解包（Forced Unwrapping）的一个替代

在对象后面放一个 `?` 构成一个可选型操作链，表示你希望在非 `nil` 时访问对象的属性和方法。这和强制解包很相似，强制解包在变量后使用 `!` 表示，它们之间最大的区别在于当变量是 `nil` 时，可选型操作链会优雅地返回 `nil`，但是强制解包会触发一个运行时错误。

由于实际上可选型操作链可以对 `nil` 操作，所以无论链式操作的属性和方法是不是可选型类型的，其结果将必定是一个可能为 `nil` 的可选型类型。你可以使用可用型操作链来判断一个操作是否成功，如果成功就会得到一个值，反之则得到 `nil`。

由此需要注意，可选型操作链的返回结果应该是可选型的预期返回结果。比如如果预期返回 `Int` 类型数据，那么经过可选型操作链返回的结果应该是 `Int?`。

下面的例子展示了可选型操作链和强制解包的区别。

```swift
class Person {
    var residence: Residence?
}

class Residence {
    var numberOfRooms = 1
}
```

定义两个类，Person 有一个 Residence 实例作为属性，它是可选的，所以在实例化 Person 时它没有被初始化，它将是 `nil`。

```swift
let john = Person()

let roomCount = john.residence!.numberOfRooms
// this triggers a runtime error
```

这是强制解包操作，它会触发一个运行时错误，原因是 john 的 residence 属性没有被初始化，还不能访问它的属性。使用可选型操作链可以处理这个情况。

```swift
if let roomCount = john.residence?.numberOfRooms {
    print("John's residence has \(roomCount) room(s).")
} else {
    print("Unable to retrieve the number of rooms.")
}
// Prints "Unable to retrieve the number of rooms."


john.residence = Residence()

if let roomCount = john.residence?.numberOfRooms {
    print("John's residence has \(roomCount) room(s).")
} else {
    print("Unable to retrieve the number of rooms.")
}
// Prints "John's residence has 1 room(s)."
```

### 定义模型类以展示可选型操作链的使用场景

下面对 Person 和 Residence 类进行重构，并添加 Room 和 Address 类。

```swift
class Person {
    var residence: Residence?
}

class Residence {
    var rooms = [Room]()
    var numberOfRooms: Int {
        return rooms.count
    }
    subscript(i: Int) -> Room {
        get {
            return rooms[i]
        }
        set {
            rooms[i] = newValue
        }
    }
    func printNumberOfRooms() {
        print("The number of rooms is \(numberOfRooms)")
    }
    var address: Address?
}

class Room {
    let name: String
    init(name: String) { self.name = name }
}

class Address {
    var buildingName: String?
    var buildingNumber: String?
    var street: String?
    func buildingIdentifier() -> String? {
        if let buildingNumber = buildingNumber, let street = street {
            return "\(buildingNumber) \(street)"
        } else if buildingName != nil {
            return buildingName
        } else {
            return nil
        }
    }
}
```

简单的看一下它们的关系。Person 类不变，拥有一个可选型 Residence 属性。Residence 改变比较大，它将储存一个 Room 数组，因此 numberOfRooms 可以转变成一个计算属性。Residence 还实现了下标操作，还有一个方法用来打印房间数，同时它还有一个可选型的 Address 类型属性。

Room 类相对简单，它只有一个名称，并在初始化时赋值。Address 保有三个可选型的字符串属性储存不同信息，一个方法来在属性有值的情况下构建地址信息。

### 用可选型操作链访问属性

可选型操作链访问属性，可以对执行成功与否进行判断。

```swift
let john = Person()
if let roomCount = john.residence?.numberOfRooms {
    print("John's residence has \(roomCount) room(s).")
} else {
    print("Unable to retrieve the number of rooms.")
}
// Prints "Unable to retrieve the number of rooms."
```

另一方面，可以对属性进行操作，如果访问的对象为 `nil`，那么操作不会成功，也不会报错。

```swift
let someAddress = Address()
someAddress.buildingNumber = "29"
someAddress.street = "Acacia Road"
john.residence?.address = someAddress
```

上面对 john 对操作会失败，因为此时 john 对 residence 属性仍未初始化。但是可能你不太能看出来右边是否有被执行，下面的代码对上面的操作进行了改写，如果右边被执行的话，会打印一段信息告诉你。

```swift
func createAddress() -> Address {
    print("Function was called.")

    let someAddress = Address()
    someAddress.buildingNumber = "29"
    someAddress.street = "Acacia Road"

    return someAddress
}
john.residence?.address = createAddress()
```

如果你执行了这段代码，你会知道，左边为 `nil` 时，右边的 `createAddress()` 实际上并没有被执行。

### 用可选型操作链调用方法

你可以使用可选型操作链调用一个可选型变量的方法，并且判断方法是否调用成功了，即使这个方法不存在返回值。比如上面 Residence 的方法。

```swift
func printNumberOfRooms() {
    print("The number of rooms is \(numberOfRooms)")
}
```

这个方法没有返回值，但是实际上函数和方法有一个默认返回值 `Void`，表现为空元组 `()`。用可选型操作链执行这个方法，它的返回值将是 `Void?`。可以通过判断其是否返回 `nil` 来检查方法是否调用成功。

```swift
if john.residence?.printNumberOfRooms() != nil {
    print("It was possible to print the number of rooms.")
} else {
    print("It was not possible to print the number of rooms.")
}
// Prints "It was not possible to print the number of rooms."
```

这解释了上一节最后的例子。赋值操作的返回值应该是 `Void?`，所以能判断它是否执行成功。

```swift
if (john.residence?.address = someAddress) != nil {
    print("It was possible to set the address.")
} else {
    print("It was not possible to set the address.")
}
// Prints "It was not possible to set the address."
```

### 使用可选型操作链访问下标

使用可选型操作链访问下标时要注意问号必须在变量名的后面，在下标的前面。

```swift
if let firstRoomName = john.residence?[0].name {
    print("The first room name is \(firstRoomName).")
} else {
    print("Unable to retrieve the first room name.")
}
// Prints "Unable to retrieve the first room name."
```

你可以用下标赋值。

```swift
john.residence?[0] = Room(name: "Bathroom")

let johnsHouse = Residence()
johnsHouse.rooms.append(Room(name: "Living Room"))
johnsHouse.rooms.append(Room(name: "Kitchen"))
john.residence = johnsHouse

if let firstRoomName = john.residence?[0].name {
    print("The first room name is \(firstRoomName).")
} else {
    print("Unable to retrieve the first room name.")
}
// Prints "The first room name is Living Room."
```

操作字典类型稍有不同。

```swift
var testScores = ["Dave": [86, 82, 84], "Bev": [79, 94, 81]]
testScores["Dave"]?[0] = 91
testScores["Bev"]?[0] += 1
testScores["Brian"]?[0] = 72
// the "Dave" array is now [91, 82, 84] and the "Bev" array is now [80, 94, 81]
```

### 多级链

你可以链接很长一串操作。

```swift
if let johnsStreet = john.residence?.address?.street {
    print("John's street name is \(johnsStreet).")
} else {
    print("Unable to retrieve the address.")
}
// Prints "Unable to retrieve the address."

let johnsAddress = Address()
johnsAddress.buildingName = "The Larches"
johnsAddress.street = "Laurel Street"
john.residence?.address = johnsAddress

if let johnsStreet = john.residence?.address?.street {
    print("John's street name is \(johnsStreet).")
} else {
    print("Unable to retrieve the address.")
}
// Prints "John's street name is Laurel Street."


if let buildingIdentifier = john.residence?.address?.buildingIdentifier() {
    print("John's building identifier is \(buildingIdentifier).")
}
// Prints "John's building identifier is The Larches."

if let beginsWithThe =
    john.residence?.address?.buildingIdentifier()?.hasPrefix("The") {
    if beginsWithThe {
        print("John's building identifier begins with \"The\".")
    } else {
        print("John's building identifier does not begin with \"The\".")
    }
}
// Prints "John's building identifier begins with "The"."
```

# 相关

> 20.[Swift Initialization and Deinitialization](https://github.com/zfanli/notes/blob/master/swift/20.InitializationAndDeinitialization.md)
>
> 22.[Swift Error Handling](https://github.com/zfanli/notes/blob/master/swift/22.ErrorHandling.md)
