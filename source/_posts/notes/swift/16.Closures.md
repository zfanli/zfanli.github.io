---
title: 16.Swift Closure
tags:
  - Swift
date: "2019-06-29T16:28:35.099Z"
---

闭包没多少内容。新东西是 `@excaping` 和 `@autoclosure` 自动闭包。

<!-- more -->

## 闭包

```swift
var reversedNames = names.sorted(by: { (s1: String, s2: String) -> Bool in
    return s1 > s2
})
```

简洁写法。

```swift
reversedNames = names.sorted(by: { $0 > $1 } )

reversedNames = names.sorted() { $0 > $1 }

reversedNames = names.sorted { $0 > $1 }
```

用操作符方法可以更简单。

```swift
reversedNames = names.sorted(by: >)
```

### 逃逸闭包

这又是一个新东西。

闭包可以作为一个参数传递给一个函数或者一个方法。但是这个参数只能在函数内使用，在一些场景中我们需要把传递进来的闭包参数放到一个全局的数组中储存，并且在之后的某个时间点调用，此时需要 `@excaping` 关键字标注，否则会得到一个编译错误。

```swift
var completionHandlers: [() -> Void] = []
func someFunctionWithEscapingClosure(completionHandler: @escaping () -> Void) {
    completionHandlers.append(completionHandler)
}

func someFunctionWithNonescapingClosure(closure: () -> Void) {
    closure()
}

class SomeClass {
    var x = 10
    func doSomething() {
        someFunctionWithEscapingClosure { self.x = 100 }
        someFunctionWithNonescapingClosure { x = 200 }
    }
}

let instance = SomeClass()
instance.doSomething()
print(instance.x)
// Prints "200"

completionHandlers.first?()
print(instance.x)
// Prints "100"
```

### 自动闭包

```swift
var customersInLine = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
print(customersInLine.count)
// Prints "5"

let customerProvider = { customersInLine.remove(at: 0) }
print(customersInLine.count)
// Prints "5"

print("Now serving \(customerProvider())!")
// Prints "Now serving Chris!"
print(customersInLine.count)
// Prints "4"

// customersInLine is ["Alex", "Ewa", "Barry", "Daniella"]
func serve(customer customerProvider: () -> String) {
    print("Now serving \(customerProvider())!")
}
serve(customer: { customersInLine.remove(at: 0) } )
// Prints "Now serving Alex!"
```

上面的情况可以使用 `@autoclosure` 自动封装闭包。

```swift
// customersInLine is ["Ewa", "Barry", "Daniella"]
func serve(customer customerProvider: @autoclosure () -> String) {
    print("Now serving \(customerProvider())!")
}
serve(customer: customersInLine.remove(at: 0))
// Prints "Now serving Ewa!"
```

可以一起用。

```swift
// customersInLine is ["Barry", "Daniella"]
var customerProviders: [() -> String] = []
func collectCustomerProviders(_ customerProvider: @autoclosure @escaping () -> String) {
    customerProviders.append(customerProvider)
}
collectCustomerProviders(customersInLine.remove(at: 0))
collectCustomerProviders(customersInLine.remove(at: 0))

print("Collected \(customerProviders.count) closures.")
// Prints "Collected 2 closures."
for customerProvider in customerProviders {
    print("Now serving \(customerProvider())!")
}
// Prints "Now serving Barry!"
// Prints "Now serving Daniella!"
```

# 相关

> 15.[Swift Functions](https://github.com/zfanli/notes/blob/master/swift/15.Functions.md)
>
> 17.[Swift Enumerates & Structs & Classes](https://github.com/zfanli/notes/blob/master/swift/17.EnumeratesStructsClasses.md)
