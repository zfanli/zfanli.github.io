---
title: 23.Swift Type Casting
tags:
  - Swift
date: "2019-07-05T14:28:35.099Z"
---

操作符 `is` 和 `as`，一个负责检查，一个负责转换。`as?` 优雅转换，失败可以返回 `nil`，`as!` 强制转换，失败就失败，失败就报错！

<!-- more -->

## 类型强转

Swift 提供 `is` 和 `as` 操作符用来检查类型和强制转换类型。

先定义几个类型。

下面是一个顶级类型。

```swift
class MediaItem {
    var name: String
    init(name: String) {
        self.name = name
    }
}
```

下面是两个子类。

```swift
class Movie: MediaItem {
    var director: String
    init(name: String, director: String) {
        self.director = director
        super.init(name: name)
    }
}

class Song: MediaItem {
    var artist: String
    init(name: String, artist: String) {
        self.artist = artist
        super.init(name: name)
    }
}
```

下面定义一个数组包含 2 个 Movie 和 3 个 Song。Swift 可以发现 Movie 和 Song 有共同的父类 MediaItem，所以 library 的类型将被推测为 `[MediaItem]`。

```swift
let library = [
    Movie(name: "Casablanca", director: "Michael Curtiz"),
    Song(name: "Blue Suede Shoes", artist: "Elvis Presley"),
    Movie(name: "Citizen Kane", director: "Orson Welles"),
    Song(name: "The One And Only", artist: "Chesney Hawkes"),
    Song(name: "Never Gonna Give You Up", artist: "Rick Astley")
]
// the type of "library" is inferred to be [MediaItem]
```

此时会出现一个问题，当你遍历 library 时，每个 item 的类型将是 MediaItem，而不是 Movie 或者 Song。你需要处理它们正确的原本的类型，此时你需要检查并强转它们。

### 检查类型

使用 `is` 操作符检查类型。下面检查 library 中每个元素的类型，并对 Movie 和 Song 进行计数。

```swift
var movieCount = 0
var songCount = 0

for item in library {
    if item is Movie {
        movieCount += 1
    } else if item is Song {
        songCount += 1
    }
}

print("Media library contains \(movieCount) movies and \(songCount) songs")
// Prints "Media library contains 2 movies and 3 songs"
```

### 向下强转类型转换

当你确定一个变量的原本类型的时候，你可以用强转操作符对其进行强制转换，操作符为 `as?` 或 `as!`。

由于强转操作有可能失败，所以操作符分成两个构成：`as?` 失败时返回 `nil`；`as!` 失败时触发一个运行时的断言错误。

下面是向下强制类型转换的例子。

```swift
for item in library {
    if let movie = item as? Movie {
        print("Movie: \(movie.name), dir. \(movie.director)")
    } else if let song = item as? Song {
        print("Song: \(song.name), by \(song.artist)")
    }
}

// Movie: Casablanca, dir. Michael Curtiz
// Song: Blue Suede Shoes, by Elvis Presley
// Movie: Citizen Kane, dir. Orson Welles
// Song: The One And Only, by Chesney Hawkes
// Song: Never Gonna Give You Up, by Rick Astley
```

### 对 `Any` 或 `AnyObject` 进行类型强制转换

Swift 提供两种方式处理非指定类型：

- `Any` 可以指定任何类型，包括函数类型；
- `AnyObject` 可以指定任何类的实例类型。

下面是使用 `Any` 的一个例子，这个数组可以储存任何类型的数据，包括函数类型。

```swift
var things = [Any]()

things.append(0)
things.append(0.0)
things.append(42)
things.append(3.14159)
things.append("hello")
things.append((3.0, 5.0))
things.append(Movie(name: "Ghostbusters", director: "Ivan Reitman"))
things.append({ (name: String) -> String in "Hello, \(name)" })
```

下面使用类型检查和强转操作符进行恢复。

```swift
for thing in things {
    switch thing {
    case 0 as Int:
        print("zero as an Int")
    case 0 as Double:
        print("zero as a Double")
    case let someInt as Int:
        print("an integer value of \(someInt)")
    case let someDouble as Double where someDouble > 0:
        print("a positive double value of \(someDouble)")
    case is Double:
        print("some other double value that I don't want to print")
    case let someString as String:
        print("a string value of \"\(someString)\"")
    case let (x, y) as (Double, Double):
        print("an (x, y) point at \(x), \(y)")
    case let movie as Movie:
        print("a movie called \(movie.name), dir. \(movie.director)")
    case let stringConverter as (String) -> String:
        print(stringConverter("Michael"))
    default:
        print("something else")
    }
}

// zero as an Int
// zero as a Double
// an integer value of 42
// a positive double value of 3.14159
// a string value of "hello"
// an (x, y) point at 3.0, 5.0
// a movie called Ghostbusters, dir. Ivan Reitman
// Hello, Michael
```

# 相关

> 22.[Swift Error Handling](https://github.com/zfanli/notes/blob/master/swift/22.ErrorHandling.md)
>
> 24.[Swift Extensions](https://github.com/zfanli/notes/blob/master/swift/24.Extensions.md)
