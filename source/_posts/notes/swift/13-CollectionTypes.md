---
title: 13.Swift Collection Types
tags:
  - Swift
date: '2019-06-29T13:28:35.099Z'
categories:
  - notes
  - swift
---

Array、Set、Dictionary 是很经典的三个集合类型。流行语言都有对应的实现。本章比较详细的介绍了每种集合类型的各种操作，内容本身就是一个总结，也就不需要小结多说什么了。熟悉完这章内容基本就摸清了 Swift 的集合类型。

<!-- more -->

## 集合类型

Swift 的集合类型有 Array、Set 和 Dictionary 三种。它们的值类型都是固定的，你无法插入一个不同类型的值到这些集合类型中。当声明一个变量时，这三种类型的数据是属于可修改是，可以添加和删除元素。但是如果声明一个常量时，将会是不可修改类型，内容无法修改。

### Array

声明数组使用 `Array<Element>`，有一个缩写方式是 `[Element]`。建议使用缩写。

```swift
var someInts = [Int]()
print("someInts is of type [Int] with \(someInts.count) items.")
// Prints "someInts is of type [Int] with 0 items."
```

如果变量类型定义过一次，或者被推测过一次，可以使用 `[]` 再次将其初始化为空数组而不需要提示类型。

```swift
someInts.append(3)
// someInts now contains 1 value of type Int
someInts = []
// someInts is now an empty array, but is still of type [Int]
```

创建数组时可以提供默认值。例如下面重复 `0.0` 3 次作为默认值。

```swift
var threeDoubles = Array(repeating: 0.0, count: 3)
// threeDoubles is of type [Double], and equals [0.0, 0.0, 0.0]
```

`+` 操作符可以直接合并两个 Array。

```swift
var anotherThreeDoubles = Array(repeating: 2.5, count: 3)
// anotherThreeDoubles is of type [Double], and equals [2.5, 2.5, 2.5]

var sixDoubles = threeDoubles + anotherThreeDoubles
// sixDoubles is inferred as [Double], and equals [0.0, 0.0, 0.0, 2.5, 2.5, 2.5]
```

通过字面量声明数组。

```swift
var shoppingList: [String] = ["Eggs", "Milk"]
// shoppingList has been initialized with two initial items
```

可以省略类型声明。

```swift
var shoppingList = ["Eggs", "Milk"]
```

数组有只读的 `count` 属性可以拿到数组长度。

```swift
print("The shopping list contains \(shoppingList.count) items.")
// Prints "The shopping list contains 2 items."
```

`isEmpty` 方法判断数组是否为空。

```swift
if shoppingList.isEmpty {
    print("The shopping list is empty.")
} else {
    print("The shopping list is not empty.")
}
// Prints "The shopping list is not empty."
```

`append` 在数组末尾添加新的元素。

```swift
shoppingList.append("Flour")
// shoppingList now contains 3 items, and someone is making pancakes
```

`+=` 快速合并另一个数组。

```swift
shoppingList += ["Baking Powder"]
// shoppingList now contains 4 items
shoppingList += ["Chocolate Spread", "Cheese", "Butter"]
// shoppingList now contains 7 items
```

可以使用下标语法同时修改一个范围的值。

```swift
shoppingList[4...6] = ["Bananas", "Apples"]
// shoppingList now contains 6 items
```

在指定位置插入元素。

```swift
shoppingList.insert("Maple Syrup", at: 0)
// shoppingList now contains 7 items
// "Maple Syrup" is now the first item in the list
```

或者移除指定位置的值。`.remove(_:at)` 移除元素同时将值返回，如果你不需要返回值，可以不去接收。

```swift
let mapleSyrup = shoppingList.remove(at: 0)
// the item that was at index 0 has just been removed
// shoppingList now contains 6 items, and no Maple Syrup
// the mapleSyrup constant is now equal to the removed "Maple Syrup" string
```

移除最后一个元素有一个简单的方法。

```swift
let apples = shoppingList.removeLast()
// the last item in the array has just been removed
// shoppingList now contains 5 items, and no apples
// the apples constant is now equal to the removed "Apples" string
```

for-in 直接遍历 Array。

```swift
for item in shoppingList {
    print(item)
}
// Six eggs
// Milk
// Flour
// Baking Powder
// Bananas
```

如果遍历时需要拿到索引，使用 `.enumerated()` 方法。

```swift
for (index, value) in shoppingList.enumerated() {
    print("Item \(index + 1): \(value)")
}
// Item 1: Six eggs
// Item 2: Milk
// Item 3: Flour
// Item 4: Baking Powder
// Item 5: Bananas
```

### Set

Set 是无序的，同时没有重复值。你可以在不需要排序或者要保证值不重复的时候使用 Set。

Set 需要 Hash 值用来储存一个值，这要求这个值的类型是可哈希的（hashable），即这个类型能够计算自己的 Hash 值。对象的 Hash 值是一个整数数值，用来比较两个对象是否相同。比如 `if a == b` 实际上比较的是 `if a.hashValue == b.hashValue`。

Swift 的基础类型默认都是 Hashable 的，可以作为 Set 或 Dictionary 的键值类型。枚举类型的 case 在不存在关联值的情况下默认也是要求 Hashable 的类型。

> NOTE: 自定义类型作为 Set 或者 Dictionary 的键值类型时必须要实现 Swift 标准库中的 Hashable 协议。这个协议要求一个类型需要有一个可取得的 `hashValue` 整数数值属性。由于 Hashable 协议继承了 Equatable 协议，所以你还需要实现双等号操作符比较，并且满足三个条件：
>
> - a == a (Reflexivity 自反性)
> - a == b implies b == a (Symmetry 对称性)
> - a == b && b == c implies a == c (Transitivity 传递性)

使用 `Set<Element>` 声明一个 Set。

```swift
var letters = Set<Character>()
print("letters is of type Set<Character> with \(letters.count) items.")
// Prints "letters is of type Set<Character> with 0 items."
```

同样，一旦确定了变量的信息，你对其重新初始化可以省略类型。

```swift
letters.insert("a")
// letters now contains 1 value of type Character
letters = []
// letters is now an empty set, but is still of type Set<Character>
```

字面量创建一个 Set。

```swift
var favoriteGenres: Set<String> = ["Rock", "Classical", "Hip hop"]
// favoriteGenres has been initialized with three initial items
```

字面量声明一个 Set 和声明一个 Array 的写法是相同的，所以如果不写变量类型，将会是一个 Array。这里 Set 类型是必须提示的，而值类型可以由 Swift 自动推测出来，所以可以省略。

```swift
var favoriteGenres: Set = ["Rock", "Classical", "Hip hop"]
```

拿长度、空 Set 判断、插入元素、移除元素都和 Array 类似。唯一的差异是 Set 是无序的，插入和移除元素的时候寻找的是元素值而不是索引。看看下面的示例。

```swift
print("I have \(favoriteGenres.count) favorite music genres.")
// Prints "I have 3 favorite music genres."

if favoriteGenres.isEmpty {
    print("As far as music goes, I'm not picky.")
} else {
    print("I have particular music preferences.")
}
// Prints "I have particular music preferences."

favoriteGenres.insert("Jazz")
// favoriteGenres now contains 4 items

if let removedGenre = favoriteGenres.remove("Rock") {
    print("\(removedGenre)? I'm over it.")
} else {
    print("I never much cared for that.")
}
// Prints "Rock? I'm over it."
```

此外 Set 可以检测是否包含一个元素。

```swift
if favoriteGenres.contains("Funk") {
    print("I get up on the good foot.")
} else {
    print("It's too funky in here.")
}
// Prints "It's too funky in here."
```

for-in 可以直接遍历 Set。

```swift
for genre in favoriteGenres {
    print("\(genre)")
}
// Classical
// Jazz
// Hip hop
```

Set 是无序的。需要排序的时候可以使用 `.sorted()`，其处理是将 Set 转化为 Array 并且用 < 操作符排序。

```swift
for genre in favoriteGenres.sorted() {
    print("\(genre)")
}
// Classical
// Hip hop
// Jazz
```

集合操作：

- intersection(\_:) 取交集
- symmetricDifference(\_:) 取反集
- union(\_:) 取并集
- subtracting(\_:) 取减集

```swift
let oddDigits: Set = [1, 3, 5, 7, 9]
let evenDigits: Set = [0, 2, 4, 6, 8]
let singleDigitPrimeNumbers: Set = [2, 3, 5, 7]

oddDigits.union(evenDigits).sorted()
// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
oddDigits.intersection(evenDigits).sorted()
// []
oddDigits.subtracting(singleDigitPrimeNumbers).sorted()
// [1, 9]
oddDigits.symmetricDifference(singleDigitPrimeNumbers).sorted()
// [1, 2, 9]
```

集合比较：

- 等号（=）比较两个集合是否有完全相同的元素
- isSubset(of:) 判断一个集合是否是另一个的子集
- isSuperset(of:) 判断一个集合是否是另一个的超集
- isStrictSubset(of:) 或 isStrictSuperset(of:) 判断一个集合是否是另一个的超集或者子集，但不包括两个集合相等的情况
- isDisjoint(with:) 判断两个集合是否不包含相同的元素

```swift
let houseAnimals: Set = ["🐶", "🐱"]
let farmAnimals: Set = ["🐮", "🐔", "🐑", "🐶", "🐱"]
let cityAnimals: Set = ["🐦", "🐭"]

houseAnimals.isSubset(of: farmAnimals)
// true
farmAnimals.isSuperset(of: houseAnimals)
// true
farmAnimals.isDisjoint(with: cityAnimals)
// true
```

### Dictionary

字典类型储存键值对，字典类型是无序的。每一个值对应一个唯一的键。

声明一个 Dictionary 使用 `Dictionary<Key, Value>`。但是可以简写为 `[Key: Value]` 形式。建议使用简写。

```swift
var namesOfIntegers = [Int: String]()
// namesOfIntegers is an empty [Int: String] dictionary
```

可以使用 `[:]` 初始化一个现有的字典类型而不需要提供类型信息。

```swift
namesOfIntegers[16] = "sixteen"
// namesOfIntegers now contains 1 key-value pair
namesOfIntegers = [:]
// namesOfIntegers is once again an empty dictionary of type [Int: String]
```

字面量创建一个字典类型。

```swift
var airports: [String: String] = ["YYZ": "Toronto Pearson", "DUB": "Dublin"]
```

字面量的信息足够 Swift 推测类型，所以这时类型信息是可以省略的。

```swift
var airports = ["YYZ": "Toronto Pearson", "DUB": "Dublin"]
```

拿字典信息的长度、判断非空与 Array 和 Set 一致。

```swift
print("The airports dictionary contains \(airports.count) items.")
// Prints "The airports dictionary contains 2 items."

if airports.isEmpty {
    print("The airports dictionary is empty.")
} else {
    print("The airports dictionary is not empty.")
}
// Prints "The airports dictionary is not empty."
```

插入元素和修改元素操作一致，提供一个 key 然后赋值。

```swift
airports["LHR"] = "London"
// the airports dictionary now contains 3 items

airports["LHR"] = "London Heathrow"
// the value for "LHR" has been changed to "London Heathrow"
```

除了下标操作之外，`updateValue(_:forKey:)` 方法提供同样的能力，可以用来添加和更新元素，不同之处在于它会返回旧的值，这样可以方便检查一个修改是否发生。它会在存在值的情况下更新新的值并返回旧的值，在不存在值的情况下添加新的值但是返回 `nil`。

```swift
if let oldValue = airports.updateValue("Dublin Airport", forKey: "DUB") {
    print("The old value for DUB was \(oldValue).")
}
// Prints "The old value for DUB was Dublin."
```

下面的方式可以简单的判断对应一个 key 是否存在值。

```swift
if let airportName = airports["DUB"] {
    print("The name of the airport is \(airportName).")
} else {
    print("That airport is not in the airports dictionary.")
}
// Prints "The name of the airport is Dublin Airport."
```

将 `nil` 赋值给一个 key 来移除一个值。

```swift
airports["APL"] = "Apple International"
// "Apple International" is not the real airport for APL, so delete it
airports["APL"] = nil
// APL has now been removed from the dictionary
```

下面是 OOP 的方式去移除一个字典类型的值。

```swift
if let removedValue = airports.removeValue(forKey: "DUB") {
    print("The removed airport's name is \(removedValue).")
} else {
    print("The airports dictionary does not contain a value for DUB.")
}
// Prints "The removed airport's name is Dublin Airport."
```

for-in 直接遍历字典类型，注意用两个参数分别接收 key 和 value。

```swift
for (airportCode, airportName) in airports {
    print("\(airportCode): \(airportName)")
}
// YYZ: Toronto Pearson
// LHR: London Heathrow
```

或者你可以仅遍历 key 或 value。

```swift
for airportCode in airports.keys {
    print("Airport code: \(airportCode)")
}
// Airport code: YYZ
// Airport code: LHR

for airportName in airports.values {
    print("Airport name: \(airportName)")
}
// Airport name: Toronto Pearson
// Airport name: London Heathrow
```

可以把字典类型的 key 或者 value 单独输出一个 Array。

```swift
let airportCodes = [String](airports.keys)
// airportCodes is ["YYZ", "LHR"]

let airportNames = [String](airports.values)
// airportNames is ["Toronto Pearson", "London Heathrow"]
```

不过由于字典类型是无序的，要保证输出的顺序每次都一致的话，需要执行 `.sorted()` 方法。

# 相关

> 12.[Swift Strings and Characters](https://github.com/zfanli/notes/blob/master/swift/12.StringsAndCharacters.md)
>
> 14.[Swift Control Flow](https://github.com/zfanli/notes/blob/master/swift/14.ControlFlow.md)
