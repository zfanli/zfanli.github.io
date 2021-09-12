---
title: JavaScript 语法标准整理 - ES6 及以后版本
tags:
  - JavaScript
categories:
  - study
  - js
---

我们通常说的 JavaScript 其实指的是 ECMAScript 的子集。JavaScript 遵从 ECMAScript 定义的语言标准提供接口，但是内部实现则完全取决于运行环境。根据 ECMAScript 规格实现的语言还有 ActionScript、JScript 等等。这些实现了同一个规范的语言可以类比做使用了同一种引擎的不同汽车，每辆车的外观都不尽相同，而每种语言都有其独特的风格。

ECMAScript 是 Netscape 的 Brendan Eich 所开发的一个脚本语言的标准化规格，这个脚本语言最初叫 Mocha，随后改名为 LiveScript，最后改名为我们熟知的 JavaScript。可以说 ECMAScript 就是当时的 “JavaScript”，但是因为种种原因这个名称没能保留下来，我们现在经常使用的 JavaScript 主要是各浏览器实现的版本。

ECMAScript 的作用在于定义 JavaScript 语言的核心标准和 API，经过多个版本的迭代之后，ECMAScript 如今稳定每一年会发布一个新版本，给 JavaScript 添加一些新的语言特性以及改善。这篇文章将主要讨论 ECMAScript 第 6 个版本（即 ES6）及往后版本中推出的新特性和推出这些特性的缘由。

> 内容包括**更新时间截止**的所有已添加的特性。

<!-- more -->

## ECMAScript

ECMAScript 也叫 ECMA-262，是 JavaScript 的语言规范。下面是截止本文更新时间 ECMAScript 的版本列表。整体上来说，ECMAScript 在 ES3 为止都是对初版的修补，但到了第 4 版（ES4）时，由于提案的很多特性的引入会导致与先前版本的不兼容，被 Netscape、Mozilla 和微软等方面指责为“breaking the web”。随后雅虎、微软和谷歌牵头构成了工作小组在 ES3 的基础上做了一些安全方面、库的更新方面的工作，并且着重强调了兼容性。这两个小组并行工作了一段时间后做出了妥协，ES4 的版本被废止，后来的这个版本作为 ES5 发布。ES4 中的部分特性在 ES6 以后得到引入。并且从 ES6 开始，ECMAScript 每一年会发布一个新版本，添加一些新特性和做出一些改善。

| Edition | Date Published       | Name                     | Changes                                                                                                                                                         |
| ------- | -------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1       | 1997 年 6 月         |                          | 初版                                                                                                                                                            |
| 2       | 1998 年 6 月         |                          | 修改以符合 ISO/IEC 16262 国际标准                                                                                                                               |
| 3       | 1999 年 12 月        |                          | 加入正则表达式、更好的字符串处理、新的流程控制语句、Try Catch 异常处理、更细致的 Errors 定义、数值输出以及其他改善。                                            |
| 4       | （废弃）2003 年 6 月 |                          | 由于语言复杂度上的策略分歧而被分歧，其中的部分提案被完全抛弃，另一部分在第 6 版中发布。                                                                         |
| 5       | 2009 年 12 月        | ECMAScript 2015 (ES2015) | 加入严格（`strict`）模式；解决了第 3 版中的很多模糊定义，并且包容与规格有所不同的实际语言实现；添加了 setter 和 getter、JSON 支持以及更加完整的对象属性的反射。 |
| 5.1     | 2011 年 6 月         |                          | 修改以符合 ISO/IEC 16262:2011 国际标准                                                                                                                          |
| 6       | 2015 年 6 月         | ECMAScript 2016 (ES2016) | \*见下文                                                                                                                                                        |
| 7       | 2016 年 6 月         | ECMAScript 2016 (ES2016) | \*见下文                                                                                                                                                        |
| 8       | 2017 年 6 月         | ECMAScript 2017 (ES2017) | \*见下文                                                                                                                                                        |
| 9       | 2018 年 6 月         | ECMAScript 2018 (ES2018) | \*见下文                                                                                                                                                        |
| 10      | 2019 年 6 月         | ECMAScript 2019 (ES2019) | \*见下文                                                                                                                                                        |
| 11      | 2020 年 6 月         | ECMAScript 2020 (ES2020) | \*见下文                                                                                                                                                        |
| 12      | 2021 年 6 月         | ECMAScript 2021 (ES2021) | \*见下文                                                                                                                                                        |

### 脚本引擎的支持情况

ECMA 国际标准化组织为 ECMAScript 语言规格开发了一套测试代码集 Test262，用来检验每一种 JavaScript 实现遵守语言标准的程度。下面是目前为止各个主流的脚本引擎对新语言特性的支持情况。可见对于主流浏览器来说，就算是最新推出的语言标准也能得到快速适配。

> 数据来自[维基百科](https://en.wikipedia.org/wiki/ECMAScript#Conformance)。

| Scripting engine | Reference application(s)                      | ES5  | ES6 (2015) | ES7 (2016) | Newer (2017+) |
| ---------------- | --------------------------------------------- | ---- | ---------- | ---------- | ------------- |
| Chakra           | Microsoft Edge 18                             | 100% | 96%        | 100%       | 33%           |
| SpiderMonkey     | Firefox 79                                    | 100% | 98%        | 100%       | 100%          |
| V8               | Google Chrome 84, Microsoft Edge 84, Opera 70 | 100% | 98%        | 100%       | 100%          |
| JavaScriptCore   | Safari 13.1                                   | 99%  | 99%        | 100%       | 84%           |

### ES12（ES2021）

#### 字符串实例：`.replaceAll()`

或许你注意到 JavaScript 中的字符串实例上的置换方法一次只能替换一个值。现在可以一次置换所有匹配值了。方便。

```javascript
let str =
  "ES2021 was published in June 2021, and ES2020 was published in June 2020";
// ...
str.replace("2020", "11");
// "ES2021 was published in June 2021, and ES11 was published in June 2020"
str.replaceAll("2021", "2019");
// "ES2019 was published in June 2019, and ES2020 was published in June 2020"
```

#### Promise `.any()`

Promise 机制中有几个 API 用来处理一系列 Promise 的结果，ES2021 添加了 `.any()` 方法，有些类似于 `.race()`，但是不会再发生错误时立刻中止。基本覆盖了所有使用场景。

| Method                             | Description                                 |
| ---------------------------------- | ------------------------------------------- |
| `promise.all([p1, p2, p3])`        | 等待所有 promise 完成，在发生错误时中止     |
| `promise.race([p1, p2, p3])`       | 等待直到第一个 promise 完成或发生错误       |
| `promise.allSettled([p1, p2, p3])` | 等待所有 promise 完成                       |
| `promise.any([p1, p2, p3])`        | 等待直到第一个 promise 完成，无视发生的错误 |

#### 逻辑赋值运算符 Logical Assignment Operator

逻辑赋值运算符让以往的写法更加简洁易读。参考下面的代码例子。算是语法糖。

```javascript
// 以往的写法
a || (a = "default");
// 使用逻辑赋值运算符
a ||= "default";
```

可以做逻辑赋值的运算符如下。

| 运算符  | Description                                                   |
| ------- | ------------------------------------------------------------- |
| `\|\|=` | 左边为 `falsy` 时赋值，`false`、`0`、`""` 都属于 `falsy`      |
| `&&=`   | 左边为 `truthy` 时赋值，非 `falsy` 的值都属于 `truthy`        |
| `??=`   | 左边为 `nullish` 时赋值，`null` 和 `undefined` 属于 `nullish` |

#### 数值分隔符 Numerical Separator

数值中添加下划线进行分隔，提高数值的可读性。

```javascript
const billion = 1_000_000_000;
```

#### WeakRef & Finalization Registry

`WeakRef` 会创建一个对象的弱引用，这种引用不会影响对象被垃圾回收（GC），如果目标对象不存在弱引用以外的引用的话，在脚本引擎执行垃圾回收时会销毁该对象。

弱引用在处理大文件缓存和映射的场景时比较有用，比如有一组图片文件，你想给每个图片进行命名但又不希望名称的映射让其无法被垃圾回收机制销毁，这时使用弱引用可以满足这个需求。用弱引用将字符串与图片一一绑定，而图片在不再被使用时会随时被 GC。

> 不过也因为弱引用的目标对象可能随时被 GC，使用时需要慎重考虑。

```javascript
// An object to reference weakly
const obj = { name: "John", age: 18, favColor: "pink" };

// creating a WeakRef of this object
const weakRefObj = new WeakRef(obj);

// To read the weak ref object
const weakRefInstance = weakRefObj.deref();

console.log(weakRefInstance.age);
// Output: 18
```

Finalization Registry 是配合 `WeakRef` 使用的一个机制。**Finalization** 指的是一个对象不再使用后执行清除操作的过程。而 Finalization Registry 本质上就是一个对象被 GC 之后的回调函数。

```javascript
// create a registry
const registry = new FinalizationRegistry((heldValue) => {
  // Do something here
});

//register any objects you want a cleanup callback for
registry.register(theObject, "some value");
```

### ES11（ES2020）

#### 全局对象 `globalThis`

在浏览器中 `globalThis` 实际指向 `window` 对象，但是 Worker 中我们无法直接使用全局对象，而是需要通过 `self` 访问，这造成在对不同程序进行开发时全局对象的名称不同。为了解决这个问题，ES2020 引入了 `globalThis` 统一了每个环境下的全局对象名称。

#### 新数据类型：`BigInt`

JavaScript 中的 `Number` 类型数据以双精度 64 位浮点数（float64）表示，这表示其对整数值来说只保证能正确显示 -2^53 ～ 2^53 的值。

> From Wikipedia
>
> - Integers from −253 to 253 (−9,007,199,254,740,992 to 9,007,199,254,740,992) can be exactly represented
> - Integers between 253 and 254 = 18,014,398,509,481,984 round to a multiple of 2 (even number)
> - Integers between 254 and 255 = 36,028,797,018,963,968 round to a multiple of 4

看下面的例子，我们先拿到能保证安全操作的最大数字，然后尝试对比这个值加 1 和加 2 的结果，你会发现结果是 `true`。

```javascript
let num = Number.MAX_SAFE_INTEGER;
// ...
num;
// 9007199254740991
num + 1 === num + 2;
// true
```

ES2020 中引入了 `BigInt` 数据类型来处理任意长度的数字，你可以使用其构造函数声明，也可以在数字后添加后缀 `n` 实现。

```javascript
let num = BigInt(Number.MAX_SAFE_INTEGER);
// ...
num;
// 9007199254740991n
num + 1n === num + 2n;
// false
```

`BigInt` 使用时需要注意下面限制：

- `BigInt` 不能直接与 `Number` 进行运算；
- `BigInt` 可以与 `Number` 进行比较，但严格比较（`===`）就算字面量相等也会返回 `false`；
- 由于一元加号运算符（`+`）在 JavaScript 中存在隐式数值转换，`BigInt` 使用 `+1n` 的形式表达时会报类型转换错误；
- `BigInt` 与 `Number` 之间换算会损失精度，使用时需要避免频繁换算；
- `BigInt` 的运算非常量时间，不适合用于密码学计算。

#### Promise `.allSettled()`

新的 Promise 方法。等待到所有 Promise 都结束后触发。适合等待所有依赖都完成后立即执行的场景。

```javascript
const p1 = new Promise((resolve) => resolve());
const p2 = new Promise((resolve, reject) => setTimeout(reject, 200));

Promise.allSettled([p1, p2]).then((res) =>
  console.log(res.map((a) => a.status))
);
// (2) ["fulfilled", "rejected"]
```

#### 空值结合运算符 Nullish Coalescing Operator

首先要解释 **Nullish**，在 JavaScript 中 `undefined` 和 `null` 属于 **Nullish**，空值结合运算符的意义在于判断变量是否是空值（Nullish），如果是的话则返回右边的值，通常用来做默认值赋值。

```javascript
// 对比 `||` 运算符，只要左边是 falsy 就返回右边的的结果
undefined || "some string";
// "some string"
null || "some string";
// "some string"
false || "some string";
// "some string"
0 || "some string";
// "some string"

// 空值结合运算符 `??`，仅在 nullish 时返回右边的的结果
undefined ?? "some string";
// "some string"
null ?? "some string";
// "some string"
false ?? "some string";
// false
0 ?? "some string";
// 0
```

#### 可选链运算符 Optional Chaining Operator

可选链运算符在链式调用中处理空值非常有用，可以完美避免空指针问题。

```javascript
const obj = { info: { name: "John", age: 17 } };
// ...
obj?.info?.name;
// "John"
obj?.any?.name;
// undefined
```

### ES10（ES2019）

#### 数组实例：`.flat()` 和 `.flatMap()`

ES2019 给数组添加了扁平化方法 `.flat(depth=1)`，这个方法接收一个参数 `depth` 表示需要提取的嵌套层数，默认为 1 层。这个方法会返回新的数组，不会影响原数组。

```javascript
// 默认只提取一层嵌套数组进行扁平化
[1, 2, [3, 4, 5, [6, 7, [8], 9], 10]].flat();
// (7) [1, 2, 3, 4, 5, Array(4), 10]

// 可以指定层数，或者使用 `Infinity` 表示提取所有嵌套层数
[1, 2, [3, 4, 5, [6, 7, [8], 9], 10]].flat(Infinity);
// (10) [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

ES2019 还给数组添加了另一个方法 `.flatMap(func[, thisArg])`，这个方法与 `.map()` 类似，但是会将返回的数组结果进行扁平化。同 `.map()` 一样，这个方法会返回新的数组。

```javascript
let arr1 = ["it's Sunny in", "", "California"];

arr1.map((x) => x.split(" "));
// [["it's","Sunny","in"],[""],["California"]]

arr1.flatMap((x) => x.split(" "));
// ["it's","Sunny","in", "", "California"]
```

#### 字符串实例：`.trimStart()` 和 `.trimEnd()`

字符串的新方法 `.trimStart()` 和 `.trimEnd()` 执行如字面意思相同的处理，算是语法糖。

```javascript
let str = "    hello!    ";
// ...
str.trimStart();
// "hello!    "
str.trimEnd();
// "    hello!"
```

### ES9（ES2018）

#### 扩展运算符 Spread Operator

ES2018 引入了针对对象的扩展运算符。扩展运算符之前只能对数组使用，现在也能对对象进行方便的复制和合并。对对象使用时类似 `Object.assign()` 的效果，但是扩展运算符不会调用属性的 setter 而 `Object.assign()` 会。

```javascript
const a = [1, 2, 3];
const b = [4, 5, 6];
const c = [...a, 3.5, ...b];
// (7) [1, 2, 3, 3.5, 4, 5, 6]

const obj = { name: "John", age: 17 };
const result = { ...obj, gender: "male" };
// {name: "John", age: 17, gender: "male"}
```

#### Rest 参数

扩展运算符用在方法参数上有相反的效果。

```javascript
function test(...args) {
  console.log(args);
}

test("many", "args", "here");
// (3) ["many", "args", "here"]
```

#### 异步迭代 Asynchronous Iteration

我们知道对象是不能用 `for of` 语句遍历的，因为这个语句会调用目标的迭代器来完成便利。ES2015 引入的迭代器让我们通过给对象定义迭代器 Symbol 后可以对其使用迭代方法 `next()`。

```javascript
const iterableObject = {
  name: "John",
  age: 17,
  *[Symbol.iterator]() {
    for (let key in this) yield this[key];
  },
};

const it = iterableObject[Symbol.iterator]();
it.next();
// {value: "John", done: false}
it.next();
// {value: 17, done: false}
it.next();
// {value: undefined, done: true}
```

在 ES2018 中添加了**异步迭代去**，与普通迭代器返回一个包含 `value` 和 `done` 的对象不同，异步迭代器返回 Promise 对象。

```javascript
const iterableObject = {
  name: "John",
  age: 17,
  async *[Symbol.asyncIterator]() {
    for (let key in this) yield this[key];
  },
};

const it = iterableObject[Symbol.asyncIterator]();
it.next();
// Promise {<fulfilled>: {…}}
it.next().then((res) => console.log(res));
// {value: 17, done: false}
it.next().then((res) => console.log(res));
// {value: undefined, done: true}
```

与此配套还有 `for await of` 循环语句可以用来迭代异步生成器和异步函数。

```javascript
const iterableObject = {
  name: "John",
  age: 17,
  async *[Symbol.asyncIterator]() {
    for (let key in this) yield this[key];
  },
};

for await (let x of iterableObject) {
  console.log(x);
}
// John
// 17
// undefined
```

#### Promise `.finally()`

这是 Promise 的新方法，类似 `try catch` 语句中的 `finally` 语句。以前我们想执行一些 cleanup 操作需要将逻辑分别写在 `.then()` 和 `.catch()` 中，现在可以统一在 `.finally()` 中了。

```javascript
fetch(API)
  .then((res) => {
    /* do something */
  })
  .catch((err) => {
    /* do something */
  })
  .finally(() => {
    /* clean up */
  });
```

#### 正则表达式的更新

ES2018 对正则表达式做出了一些更新，让 JavaScript 对字符串的处理能力进一步提升。

ES2018 添加了 **Unicode 属性转义**，可以使用 `\p{PropertyName}` 和 `\P{PropertyName}` 分别表示匹配的结果匹配或者不匹配某个 Unicode 属性，要注意使用这两个转义符时需要配合使用正则修饰符 `u` 声明处理 Unicode。Unicode 属性多种多样，所以这个特性的添加实际上很有用处，比如以往我们想要匹配汉字字符时会使用 Unicode 的码点范围来判断，但是随着汉字字符的增加，码点的范围也在不断扩大。现在可以通过下面这个属性 `Unified_Ideograph` 来判断了，这样这个正则就不需要维护了。

```javascript
/^\p{Unified_Ideograph}+$/u.test("这是汉字吗");
// true
/^\P{Unified_Ideograph}+$/u.test("这是汉字吗");
// false

// Unified_Ideograph 指表意文字，匹配中日韩越多汉字
// 这个属性外还有些属性可以针对匹配汉字，但是在范围上有一定差异
/^\p{Ideographic}+$/u.test("这是汉字吗");
// true
/^\p{Script=Han}+$/u.test("这是汉字吗");
// true
/^\p{Script_Extensions=Han}+$/u.test("这是汉字吗");
// true
```

ES2018 还给正则添加了**具名捕获分组**的特性。在之前获取分组内的数据只能通过下标完成，这会造成修改正则表达式的分组顺序将造成取值逻辑的修改。现在我们可以给分组命名获取数据了。

```javascript
const result = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/.exec(
  "2021-09-10"
);

console.log(result.groups.year, result.groups.month, result.groups.day);
// 2021 09 10

// 具名捕获分组可以用对象结构给变量赋值
const {
  groups: { year, month },
} = /^(?<year>\d{4})-(?<month>\d{2})$/.exec("2021-09");
console.log(`Year: ${year}, Month: ${month}`);
// Year: 2021, Month: 09

// 具名捕获分组也可以在字符串替换中使用
"2021/09".replace(/^(?<y>\d{4})\/(?<m>\d{2})$/, "Year: $<y>, Month: $<m>!");
// "Year: 2021, Month: 09!"

// 具名捕获分组可以使用 \k 转义符进行引用，来判断之前被捕获的内容是否重复出现
/^(?<var>\d{4})\?\k<var>\!$/.test("2021?2021!");
// true
/^(?<var>\d{4})\?\k<var>\!$/.test("2021?2022!");
// false
```

**dotAll** 模式。点（`.`）在正则中匹配所有字符，但是有 4 个字符除外，分别是 `\n`、`\r`、`U+2028`（行分隔符）、`U+2029`（段分隔符）。

```javascript
// 一般模式下点（.）不匹配换行
/^.+$/.test("abc\ndef");
// false

// 指定 s 修饰符使用 dotAll 模式，点将匹配换行
/^.+$/s.test("abc\ndef");
// true
```

ES2018 还添加了**后行断言**特性。在此之前 JavaScript 中的正则只支持先行断言和先行否定断言，也就是说断言放在匹配字符的后面，比如要匹配百分号前面的数字。后行断言和后行否定断言则相反。

```javascript
// 先行断言获取百分号前的数字
/\d+(?=%)/.exec("Get the number part of 99%");
// ["99", index: 23, input: "Get the number part of 99%", groups: undefined]

// 先行否定断言获取非百分比的数字
/\d+(?!%)/.exec("Guess you'll get the 123 or the 99%?");
// ["123", index: 21, input: "Guess you'll get the 123 or the 99%?", groups: undefined]

// 后行断言获取美元符号后的数字
/(?<=\$)\d+/.exec("Get the number part of $12345");
// ["12345", index: 24, input: "Get the number part of $12345", groups: undefined]

// 后行否定断言获取非金额的数字
/(?<!\$)\d+/.exec("Guess you'll get the 123 or the $12345?");
// ["123", index: 21, input: "Guess you'll get the 123 or the $12345?", groups: undefined]
```

### ES8（ES2017）

#### 异步操作：`async` 和 `await`

ES2017 引入了异步函数 （Async Functions）。其本质上是 Promise 和生成器的组合，以简化 Promise 的调用。异步函数的写法实际上就是用 `async` 和 `await` 代替了生成器函数的 `*` 和 `yield` 关键字。

#### `Object.values()` 和 `Object.entries()`

ES2017 给 `Object` 添加了 2 个静态方法用来方便对象的便利。

```javascript
const obj = { name: "John", age: 17, gender: "male" };

Object.values(obj);
// (3) ["John", 17, "male"]

Object.entries(obj);
// (3) [Array(2), Array(2), Array(2)]
// 0: (2) ["name", "John"]
// 1: (2) ["age", 17]
// 2: (2) ["gender", "male"]
// length: 3
// [[Prototype]]: Array(0)
```

#### `Object.getOwnPropertyDescriptors()`

ES2017 给 `Object` 添加了方法 `.getOwnPropertyDescriptors()` 用来获取对象非继承的所有属性的描述符。与 ES5 中存在的 `.getOwnPropertyDescriptor()` 功能类似，但是这次添加的方法返回**所有**属于对象自身的 property 的 attribute 数组。

在 JavaScript 的对象中，每个 property 都有一组 attribute 描述这个属性的一些特性。由于这俩个词的中文含义相似，所以在一起出现时通常不做翻译，但如果遇到需要翻译时通常翻译为属性（property）和特性（attribute）。

目前存在以下描述符（Descriptor）：

| Name           | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| `value`        | 属性值                                                       |
| `writable`     | 属性值是否可写入                                             |
| `get`          | 属性的 getter                                                |
| `set`          | 属性的 setter                                                |
| `configurable` | 属性是否可以配置，影响属性能否被删除以及其他属性能不能被修改 |
| `enumerable`   | 属性是否可以可枚举                                           |

这个方法的添加是因为 `Object.assign()` 在复制对象时不会考虑属性的描述符，也就是说将定义了 `setter` 的 property 使用 `Object.assign()` 方式赋值给另一个对象时只有值（`value`）会被复制，`setter` 处理会被丢失。在 `.getOwnPropertyDescriptors()` 被添加后，可以使用 `Object.defineProperties()` 来配合复制描述符。

```javascript
const obj = {
  set name(str) {
    this._name = str;
  },
  get name() {
    return `Name: ${this._name}`;
  },
};

// obj 定义了 name 的 setter，在设置这个属性时会编辑字符串
obj.name = "John";
obj.name;
// "Name: John"

// 通过 Object.assign() 将 obj 的属性拷贝给 copied
const copied = Object.assign({}, obj);
// obj 已经编辑过的值被保留了
copied.name;
// "Name: John"

// 尝试给 copied 的 name 重新复制
copied.name = "Howard";
// obj 的 setter 没有被复制，所以属性被直接赋值
copied.name;
// "Howard"

// 尝试给 obj 的 name 赋值
obj.name = "Howard";
// setter 生效并编辑了字符串
obj.name;
// "Name: Howard"

// 使用 .getOwnPropertyDescriptors() 进行复制并保留 setter
const kept = Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));
kept.name = "Sheldon";
kept.name;
// "Name: Sheldon"
```

#### 字符串实例：`.padStart()` 和 `.padEnd()`

ES2017 添加了字符串实例方法 `.padStart()` 和 `.padEnd()`，两功能就如字面意思。提升了字符串处理的能力。

```javascript
const str = "Test String";
// Test String

// 只指定长度时将用空格填充
console.log(str.padStart(15));
//     Test String

// 或者指定填充字符
console.log(str.padStart(15, "-"));
// ----Test String

// padEnd 相同
console.log(str.padEnd(15, "!"));
// Test String!!!!
```

### ES7（ES2016）

#### 数组实例：`.includes()`

### ES6（ES2015）

ES6 是 ECMAScript 自 97 年的初版发布以来的最大的一次拓展性更新。ES6 的目标在于为大型应用开发、库的创建和以 ECMAScript 为标准的各种语言提供更好的支持。ES6 主要的更新内容包括模块化特性、类的声明、块级作用域、迭代器和生成器、非同步的 Promise、解构模式和尾调用优化。内置的库被扩展为支持新增的 map、set 和二进制数值数组结构，同时字符串和正则表达式支持新增的 Unicode 补充字符。这些内置库现在可以通过子类进行拓展。

#### `let` 和 `const`

#### 模版字符串 Template Literals

#### 对象解构/数组结构 Objects/Arrays Destructuring

#### 对象字面量 Object Literals

#### `for of` 循环

#### 箭头函数 Arrow Functions

#### 默认参数 Default Params

#### 类的声明 Class Declaration

#### 模块 Module

#### 数据结构：`Set`

#### Symbol

## References

- [ECMAScript - Wikipedia](https://en.wikipedia.org/wiki/ECMAScript)
- [ECMA-262 - Ecma International](https://262.ecma-international.org/6.0/)
