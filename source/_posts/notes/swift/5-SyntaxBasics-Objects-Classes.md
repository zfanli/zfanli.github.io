---
title: 5.Swift Syntax Basics (对象和类)
tags:
  - Swift
date: '2019-06-18T14:28:35.099Z'
categories:
  - notes
  - swift
---

Swift 中创建一个类、创建一个对象、访问对象的属性等操作和一般的 OOP 语言并无两样。

相对特殊一点的是，Java 中的构造器在 Swift 是初始化器，并且还有一个卸载器与之对应，用 `init` 和 `deinit` 表示。

另外特殊的一点是，Swift 的类中所有声明的变量都需要赋值，无论是声明时赋值或者初始化器中赋值。继承关系通过类名后接冒号接父类名，对父类方法的覆盖需要显式的 `override` 前缀，如果复写的方法在父类中不存在，编译时会报错。

<!-- more -->

类的属性可以定义 setter 和 getter。在对变量进行读取和赋值操作的时候进行一些额外的操作。另外还有 willSet 和 didSet 可以在 setter 调用前后执行一些操作，更加灵活。

如果一个对象可能是 `nil`，那么对它进行任何操作前可以使用 `?` 快速处理，如果它真的是 `nil`，后续操作不会执行。

## 对象和类

使用 `class` 关键字创建一个类。属性和方法的声明和平时并无区别。

```swift
class Shape {
    var numberOfSides = 0
    func simpleDescription() -> String {
        return "A shape with \(numberOfSides) sides."
    }
}
```

实例化一个类，使用点语法访问对象的属性和方法。

```swift
var shape = Shape()
shape.numberOfSides = 7
var shapeDescription = shape.simpleDescription()
// "A shape with 7 sides."
```

> R：也是和 OOP 并无两样。

类的初始化器可以在创建对象时做些自定义。使用 `init()` 来做初始化。

```swift
class NamedShape {
    var numberOfSides: Int = 0
    var name: String

    init(name: String) {
       self.name = name
    }

    func simpleDescription() -> String {
       return "A shape with \(numberOfSides) sides."
    }
}
```

> R：`init()` 注意没有 func 前缀，是个特殊的构造。作用就是 Java 的构造函数。

`init()` 会在创建对象的时候被调用。注意类的所有属性都需要赋值，赋值操作可以直接声明，也可以在初始化器中赋值，例如上面的例子中的两个属性。

还有一个 `deinit()` 可以在对象被释放时做一些操作，或许应该叫卸载器？在对象被销毁时做一些清洁操作比较实用。

> R：`init()` 和 `deinit()` 就是对象生命周期中的初始化和销毁时自定义的操作。一个钩子。

定义一个子类，在声明类名的时候用冒号分隔父类名。创建类时没有要求继承任何顶级父类，所以你可以根据需要继承某个父类，或者省略父类。

在子类中如果要覆盖父类的方法实现需要显式的 `override` 前缀。如果没有前缀，在子类中定义了和父类方法同名的函数时，编译器会报错。如果有 `override` 前缀但实际上父类没有这个方法时同样会报错。

```swift
class Square: NamedShape {
    var sideLength: Double

    init(sideLength: Double, name: String) {
        self.sideLength = sideLength
        super.init(name: name)
        numberOfSides = 4
    }

    func area() -> Double {
        return sideLength * sideLength
    }

    override func simpleDescription() -> String {
        return "A square with sides of length \(sideLength)."
    }
}
let test = Square(sideLength: 5.2, name: "my test square")
test.area()
// 27.04
test.simpleDescription()
// "A square with sides of length 5.2."
```

可以给属性定义 getter 和 setter 简化属性储存。

```swift
class EquilateralTriangle: NamedShape {
    var sideLength: Double = 0.0

    init(sideLength: Double, name: String) {
        self.sideLength = sideLength
        super.init(name: name)
        numberOfSides = 3
    }

    var perimeter: Double {
        get {
             return 3.0 * sideLength
        }
        set {
            sideLength = newValue / 3.0
        }
    }

    override func simpleDescription() -> String {
        return "An equilateral triangle with sides of length \(sideLength)."
    }
}
var triangle = EquilateralTriangle(sideLength: 3.1, name: "a triangle")
print(triangle.perimeter)
// prints 9.3
triangle.perimeter = 9.9
print(triangle.sideLength)
// prints 3.3000000000000003
```

> R：看上去像 Vue 中的 `computed` 和 `watch`。属性本身不储存值，需要的时候计算出来，赋值的时候也经过计算。普通的赋值用不上 setter 和 getter，只有那种修改某个值影响其他值的情况才需要。

上面这个例子，在 `perimeter` 的 setter 中，新的值默认被赋予 `newValue` 名称，如要自定义名称，添加在 set 关键字后面。

注意初始化器的不同。

- 给子类声明的属性赋值
- 调用父类的初始化器
- 修改父类属性的值（此时类的方法、getter、setter 是有效的）

如果你需要的不是计算属性，而是在属性的值变更前后作出相应的操作，可以使用 `willSet` 和 `didSet` 钩子。定义的代码将在初始化器之外每次被更改时被执行。例如下面的类保证三角形的边长始终保持和四边形的边长一致。

```swift
class TriangleAndSquare {
    var triangle: EquilateralTriangle {
        willSet {
            square.sideLength = newValue.sideLength
        }
    }
    var square: Square {
        willSet {
            triangle.sideLength = newValue.sideLength
        }
    }
    init(size: Double, name: String) {
        square = Square(sideLength: size, name: name)
        triangle = EquilateralTriangle(sideLength: size, name: name)
    }
}
var triangleAndSquare = TriangleAndSquare(size: 10, name: "another test shape")
print(triangleAndSquare.square.sideLength)
// prints 10
print(triangleAndSquare.triangle.sideLength)
// prints 10
triangleAndSquare.square = Square(sideLength: 50, name: "larger square")
print(triangleAndSquare.triangle.sideLength)
// prints 50
```

但一个值是可选的时候，在调用方法、访问属性或者订阅的时候可以在前面加上 `?`。如果这个值是 `nil`，则之后的处理都不会执行，表达式会返回 `nil` 作为结果。反之后面的操作会对这个值进行处理。使用 `?` 后这个表达式的值也将变成可选的。

```swift
let optionalSquare: Square? = Square(sideLength: 2.5, name: "optional square")
let sideLength = optionalSquare?.sideLength
```

# 相关

> 4.[Swift Syntax Basics (函数和闭包)](<https://github.com/zfanli/notes/blob/master/swift/4.SyntaxBasics(Functions&Closures).md>)
>
> 6.[Swift Syntax Basics (枚举类型和结构体)](<https://github.com/zfanli/notes/blob/master/swift/6.SyntaxBasics(Enumerations&Structures).md>)
