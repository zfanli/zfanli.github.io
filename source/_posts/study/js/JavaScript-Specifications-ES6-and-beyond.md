---
title: JavaScript 语法标准整理 - ES6 及以后版本
tags:
  - JavaScript
date: "2021-09-12T13:41:25.073Z"
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

// register any objects you want a cleanup callback for
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

与生成器需要执行函数 `next()` 和 `co` 模块执行不同。异步函数自带执行器，且自动返回 Promise。`async` 的主要作用是按照顺序完成操作，使用 Promise 和生成器同样能完成这一点，但是 Promise 需要大量的 Promise API 支持其完成处理，生成器也需要定义执行器去做真正的逻辑执行，而 `async` 的写法简化了生成器的执行器步骤，让逻辑更加简洁易读。

```javascript
// async 关键字表示函数内有异步操作
async function getSomethingByName(name) {
  // 异步获取条件
  const conditions = await getSomeConditions(name);
  // 异步获取结果
  const result = await getSomethingByConditions(conditions);

  // await 等待函数执行结果时，如果遇到报错可以使用 try catch 处理
  // 如果不处理，将会转成 reject 状态反应在结果的 Promise 中
  try {
    await doSomethingSpecial();
  } catch (err) {
    console.log(err);
  }

  // 另一种处理报错的写法
  await doAnotherThing().catch((err) => console.log(err));

  return result;
}

// async 函数返回 Promise
getSomethingByName("test")
  // 可以接 .then() 添加回调函数
  .then((result) => console.log(result))
  // 也可以接 .catch() 处理函数中的报错
  .catch((err) => console.log(err));
```

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

ES2016 给数组实例添加了 `.includes()` 方法判断数组中是否存在目标对象。以往我们会用 `.indexOf() > -1` 来完成这个判断。

```javascript
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

arr.includes(4);
// true

// 第二个参数可以指定搜索开始的位置
arr.includes(4, 4);
// false
```

#### 指数运算符：`**`

指数运算符提供了一个方便的方式计算数值的求幂结果。相当于 `Math.pow()` 方法。

```javascript
2 ** 2; // 4
2 ** 3; // 8

// 指数运算符优先计算，所以如果运算符右边的表达式依然是一个指数运算的话
// 将优先计算右边的结果，这里格式化工具自动给右边加上括号提示这部分将优先被计算
2 ** (3 ** 2); // 512
```

### ES6（ES2015）

ES6 是 ECMAScript 自 97 年的初版发布以来的最大的一次拓展性更新。ES6 的目标在于为大型应用开发、库的创建和以 ECMAScript 为标准的各种语言提供更好的支持。ES6 主要的更新内容包括模块化特性、类的声明、块级作用域、迭代器和生成器、非同步的 Promise、解构模式和尾调用优化。内置的库被扩展为支持新增的 map、set 和二进制数值数组结构，同时字符串和正则表达式支持新增的 Unicode 补充字符。这些内置库现在可以通过子类进行拓展。

#### `let` 和 `const`

在 ES5 中我们只能使用 `var` 关键字声明变量，受到 JavaScript 解释器机制影响，这样定义变量存在**变量提升（Variable Hoisting）**现象。变量的声明被提升到当前函数作用域的顶部，下面这个例子可以直观的看到这个现象。

```javascript
for (var i = 0; i < 4; i++) {
  // do something here
}

console.log(i); // 4
```

在 for 循环中我们定义了循环变量 `i` 在循环体中使用，逻辑上这个变量只属于这个循环体，结束循环之后我们不应该能访问到这个变量。但是由于这里使用了 `var` 关键字，存在变量提升，变量 `i` 的声明被提升到了当前函数作用域的顶部，在全局作用域中就是执行所有命令之前的位置。这造成这个变量在循环体结束之后仍然能被访问，这里我们看到 `i` 最终变成了 `4`，结束了循环。

ES6 中我们可以使用 `let` 关键字来声明变量，这样声明的变量将在块级作用域中有效。比如使用 `let` 改写上面的循环时，在循环体结束之后变量 `i` 将不再存在。

```javascript
for (let i = 0; i < 4; i++) {
  // do something here
}

console.log(i); // Uncaught ReferenceError: i is not defined
```

同时，ES6 还引入了一个新的关键字 `const` 来标记常量。它有和 `let` 相同的作用域，但是 `const` 一旦声明后将不能重新赋值。对基本类型来说这个限制可以有效防止值的修改，但是对于引用类型来说这个限制只能保证指针不会被修改，但是对象的属性依然可以被修改。在使用中推荐能使用 `const` 声明的场合都使用 `const`，如果变量需要重新赋值则使用 `let`，尽量不要使用 `var` 声明。

```javascript
const a = 1;
a = 2; // Uncaught TypeError: Assignment to constant variable.

const b = { test: "abc" };
b.test = "def";
b.test; // "def"
```

#### 模版字符串 Template Literals

在 JavaScript 中存在大量操作 HTML、CSS 等内容的字符串操作，这些字符串操作通过加号链接各种变量和表达式，让整个字符串变得难以阅读。ES6 添加了模版字符串来解决这个问题。

```javascript
const date = "2021/09/11";
const str = `Today is ${date}! Good day!`;
console.log(str);
// Today is 2021/09/11! Good day!
```

#### 对象解构/数组解构 Objects/Arrays Destructuring

ES6 允许通过数组和对象形式给目标对象解构（Destructuring）来给变量赋值。使用数组形式解构时会默认调用目标对象的迭代器方法遍历数据，给相应位置的变量赋值，变量数组的长度决定了迭代器的 `next()` 方法调用的次数，如果变量数组长度超过目标数据的可迭代长度，迭代器仍然会被调用，但是会返回 `undefined` 作为值赋予给变量，你可以在解构赋值时给变量指定默认值来处理 `undefined` 的情况。数组解构可以嵌套，但是因为解构需要迭代器实现，如果嵌套解构的目标没有实现迭代器接口的话将会报错，而不是给变量赋值为 `undefined`。

使用对象形式解构赋值时根据变量名称来从目标数据中获取属性赋值。对象解构赋值的写法 `const { foo } = obj;` 实际上是 `const { foo: foo } = obj;` 的简写，所以如果你想将属性的值以另一个名称赋值给变量可以使用 `const { foo: bar } = obj;` 的形式，这也叫定义别名（Alias）。

```javascript
// 数组解构赋值，需要目标对象是可迭代的（Iterable），变量通过迭代顺序赋值
const [str1, str2, str3, str4] = ["This", "is", "cool", "!"];
console.log(str1, str2, str3, str4); // This is cool !

// 嵌套数组也可以根据嵌套关系解构赋值
const [out1, [inner1, inner2], out2] = ["Nested", ["array", "is also"], "ok"];
console.log(out1, inner1, inner2, out2); // Nested array is also ok

// 对象解构赋值，通过属性名称匹配赋值
const { name, age } = { name: "John", age: 17 };
console.log(`This person's name is ${name} and age is ${age}`);
// This person's name is John and age is 17

// 对象解构赋值可以使用别名
const { employeeId: id, jobTitle: job } = { employeeId: 1, jobTitle: "AD" };
console.log(`This guy's id is ${id} and job title is ${job}`);
// This guy's id is 1 and job title is AD

// 对象解构也可以嵌套
const {
  profile: { superPower: power },
} = { profile: { superPower: "sleep" } };
console.log(`This cool guy has '${power}' as his super power!`);
// This cool guy has 'sleep' as his super power!
```

当解构失败时变量将被赋值 `undefined`。如果嵌套解构失败时会报错。你可以给解构变量设置默认值来处理 `undefined` 的情况。但是注意，默认值仅对 `undefined` 有效，如果值为 `null`，变量会被赋值。

```javascript
const [foo, defaultFoo = "default foo"] = [];
console.log(foo, defaultFoo); // undefined "default foo"

const { bar, defaultBar = "default bar" } = {};
console.log(bar, defaultBar); // undefined "default bar"

const [x = "x will be null because it's not undefined"] = [null];
console.log(x); // null

// 嵌套解构失败时会报错
const [[err]] = [1]; // Uncaught TypeError: [1] is not iterable
const {
  foo: { err },
} = { bar: 1 }; // Uncaught TypeError: Cannot read property 'err' of undefined
```

#### 对象字面量 Object Literals

ES6 允许在变量名和属性名相等时直接写入变量和函数当作属性。也允许表达式的结果作为对象的属性名。

```javascript
const foo = "123";
const obj = { foo };
// 等同于
const obj = { foo: foo };

const obj = {
  doSomething() {},
};
// 等同于
const obj = {
  doSomething: function () {},
};

const propertyName = "specifiedPropertyName";
const obj = { [propertyName]: "some values" };
// {specifiedPropertyName: "some values"}
```

#### 数据结构：`Set` 和 `Map`

ES6 提供了新的数据结构 `Set` 和 `Map`。`Set` 是一个类似数组的数据结构，但是成员的值是唯一的。可以理解为一个去重的数组。`Set` 是这个数据结构的构造函数，需要使用 `new` 关键字创建数据结构实例。下面是 `Set` 实例对象的方法。

| Method           | Description                 |
| ---------------- | --------------------------- |
| `.add(value)`    | 添加元素到 Set              |
| `.delete(value)` | 删除 Set 中的一个元素       |
| `.has(value)`    | 检查 Set 中是否存在目标元素 |
| `.clear()`       | 清空 Set                    |

```javascript
const set = new Set();
[1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 5].forEach((x) => set.add(x));

console.log(set); // Set(5) {1, 2, 3, 4, 5}

// Set 构造函数接受可迭代对象（比如数组）作为参数初始化一个 Set 数据结构
const set2 = new Set([1, 1, 1, 2, 2, 2, 3, 3, 4, 5, 5]);
// Set(5) {1, 2, 3, 4, 5}
```

`Map` 类似 `Object` 都是键值对储存的数据，不同之处在于 `Object` 的键只接受字符串，而 ES6 新加入的 `Map` 数据类型可以接受任何值作为键。这是一种更完善的 Hash 结构实现，所以如果你需要真正的键值对数据类型，`Map` 比 `Object` 更合适。当使用对象作为 `Map` 的键时需要格外注意，`Map` 使用对象的内存地址作为键关联与之对应的值，2 个对象就算其计算结果完全相等，只要内存地址不同都会当作不同的键处理。

| Method             | Description               |
| ------------------ | ------------------------- |
| `.set(key, value)` | 添加一对键值对到 Map 中   |
| `.get(key)`        | 读取 Map 中对应键的值     |
| `.delete(key)`     | 删除 Map 中的一个键       |
| `.has(key)`        | 检查 Map 中是否存在目标键 |
| `.clear()`         | 清空 Map                  |

```javascript
const map = new Map();
map.set("key1", "value1");
map.set(["a"], "value2");

console.log(map); // Map(2) {"key1" => "value1", Array(1) => "value2"}
console.log(map.get(["a"])); // undefined

// Map 构造函数接受可迭代对象（比如数组）作为参数初始化一个 Map 数据结构
const map2 = new Map([
  ["key1", "value1"],
  [["a"], "value2"],
]);
// Map(2) {"key1" => "value1", Array(1) => "value2"}
```

ES6 还添加了 `WeakSet` 和 `WeakMap`。这两个数据类型与 `Set` 和 `Map` 基本一致，区别在于 `WeakSet` 仅接受对象作为值，而 `WeakMap` 仅接受对象作为键，当对象作为值和键存入这两个数据结构中，储存的是该对象的弱引用，这个引用不会影响对象被垃圾回收。不过也因为垃圾回收前后会造成这两个数据结构中的数据变化，所以不同于 `Set` 和 `Map`， `WeakSet` 和 `WeakMap` 被规定为不可遍历。这两个数据类型的使用场景主要是为了检查对象是否存在，或为每个存在的对象关联一个数据比如名称，对于 `WeakMap` 来说，如果作为键的对象被垃圾回收，那么其对应的值也会自动消失，不需要手动处理，这样可以避免因为忘记删除而造成的内存泄漏。

#### 迭代器 Iterator

ES5 表示集合的数据机构有 `Array` 和 `Object`，ES6 添加了 `Map` 和 `Set` 两种数据类型，所以 JavaScript 中现在存在 4 种数据集合。这些集合数据可以相互嵌套，所以就需要统一的迭代接口来对整个数据进行遍历。

ES6 引入了迭代器机制给所有对象属性提供统一的 API 来遍历数据。迭代器主要给 `for of` 循环消费。迭代器遍历数据的原理如下：

1. 初始化指针指向数据结构的起始位置；
2. 每次调用 `next` 方法时返回一个对象包含 `value` 和 `done` 属性，并将指针指向下一个元素；
   1. `value`：遍历到当前位置的值
   2. `done`：是否遍历结束
3. 迭代完成时调用 `next` 方法返回的对象中 `done` 设为 `true`。

```javascript
const arr = [1, 2, 3];
// 通过执行数组上的 Symbol.iterator 方法可以拿到迭代器对象
const it = arr[Symbol.iterator]();

it.next(); // {value: 1, done: false}
it.next(); // {value: 2, done: false}
it.next(); // {value: 3, done: false}
it.next(); // {value: undefined, done: true}
```

四个集合数据结构中除了 `Object` 没有默认的迭代器实现，其他三个数据类型都可以通过 `Symbol.iterator` 访问到默认的迭代器生成方法。给 `Object` 实例添加 `Symbol.iterator` 迭代器生成方法之后也可以让其变成可迭代的数据类型。除了集合数据之外，**字符串也原生具有迭代器接口**。

```javascript
const it = "abc"[Symbol.iterator]();

it.next();
// {value: "a", done: false}
it.next();
// {value: "b", done: false}
it.next();
// {value: "c", done: false}
it.next();
// {value: undefined, done: true}
```

迭代器除了 `for of` 循环之外，下面这些情况会自动调用目标对象的 `Symbol.iterator` 方法。

1. 数组解构：`const [a, b, c] = iterableObject;` 会自动调用 `iterableObject` 的迭代器来依序给变量赋值；
2. 扩展运算符：`[...iterableObject]` 会自动调用 `iterableObject` 的迭代器将对象展开成数组；
3. 生成器关键字 `yield*`：在生成器中使用 `yield* iterableObject;` 会自动调用 `iterableObject` 的迭代器接口；
4. 其他任何接受数组作为参数的方法都可能会调用迭代器接口。

如果要自己实现一个迭代器方法，最方便的方法还是使用生成器机制。

#### 生成器 Generator

ES6 引入了类似 Python 中的生成器机制主要用来异步遍历数据。生成器通过 `function*` 和 `yield` 关键字实现，可以理解为封装了不同状态的函数，生成器中用 `yield` 表达式来指向一个状态。生成器需要使用 `.next()` 方法遍历，每次遍历时指针指向下一个状态，直到每个状态遍历结束为止。换言之生成器是分段执行的，每次 `.next()` 调用会执行上一次 `yield` 位置开始到下一次 `yield` 或 `return` 为止的命令。

```javascript
function* gen() {
  yield "Hello";
  // yield* 是在生成器中调用生成器或迭代对象的语法糖
  // 这一步将在迭代完这个数组之后才会结束
  yield* [",", "world"];
  yield "!";
}

const genObj = gen();
genObj.next();
// {value: "Hello", done: false}
genObj.next();
// {value: ",", done: false}
genObj.next();
// {value: "world", done: false}
genObj.next();
// {value: "!", done: false}
genObj.next();
// {value: undefined, done: true}
```

生成器是 ES6 对协程（coroutine）的实现，但是由于生成器的执行权由调用者分配，所以是不完全实现，生成器函数被称作“半协程（semi-coroutine）”。生成器产生的环境上下文会在不执行的时候暂时退出调用栈冻结起来，然后执行的时候重新加入调用栈。

> 协程是指在同一个线程内不同任务合作分配执行权，每个任务拥有自己独立的调用栈，在获得执行器的时候任务将继续执行，而没有执行权的任务将被暂时挂起（suspended）。

生成器的 `yield` 表达式的返回值默认是 `undefined`，在迭代生成器调用 `.next()` 时可以传递一个参数，这个参数将作为生成器內 `yield` 的返回值反馈到生成器中。通过这个机制我们可以设计出在运行过程中改变行为的生成器。

```javascript
function* gen() {
  for (let i = 0; true; i++) {
    const res = yield i;
    if (res) {
      i = -1;
    }
  }
}

const genObj = gen();
genObj.next(); // {value: 0, done: false}
genObj.next(); // {value: 1, done: false}
genObj.next(); // {value: 2, done: false}

// 传递参数重置 i
genObj.next(true); // {value: 0, done: false}
genObj.next(); // {value: 1, done: false}
```

生成器对象的执行方法除了 `.next()` 还有 `.throw()` 和 `.return()`。其中 `.throw()` 方法可以通知生成器函数进行异常处理。

```javascript
function* gen() {
  try {
    yield;
  } catch (e) {
    console.log("Inside the generator!", e);
  }
}

const genObj = gen();
genObj.next();

try {
  // the first error will be catch by the generator
  genObj.throw(new Error("Something went wrong!"));
  // the second error will not be dealt by the generator because it's end of execution
  genObj.throw(new Error("Something went wrong! Again!"));
} catch (e) {
  console.log("Outside the generator!", e);
}
// Inside the generator! Error: Something went wrong!
// Outside the generator! Error: Something went wrong! Again!
```

`.return()` 方法让生成器立刻返回方法指定的参数，并且终结生成器的执行。如果未指定参数，生成器对象将返回 `undefined`。

```javascript
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

const genObj = gen();
genObj.next(); // {value: 1, done: false}
genObj.return("over"); // {value: "over", done: true}
genObj.next(); // {value: undefined, done: true}
```

使用生成器给对象实现一个迭代器方法非常方便。可以看到当生成器作为对象属性时，在名称前面加 `*` 即可标记这个属性是生成器。

```javascript
const obj = {
  name: "John",
  age: 17,
  gender: "male",
  // 等价于 [Symbol.iterator]: function* () {}
  *[Symbol.iterator]() {
    for (let key in this) {
      yield [key, this[key]];
    }
  },
};

for (let [key, val] of obj) {
  console.log(`Key: ${key}, Val: ${val}`);
  // Key: name, Val: John
  // Key: age, Val: 17
  // Key: gender, Val: male
}
```

#### `for of` 循环

ES6 引入了 `for of` 循环。一个数据结构只要实现了 `Symbol.iterator` 迭代器接口就可以使用 `for of` 循环进行遍历。最常用的场景是对数组使用 `for of` 循环遍历。

JavaScript 原有的 `for in` 循环只读取属性的名称，在对数组使用时循环变量拿到的是数组的索引，并且在数组定义了额外的属性时还会拿到这些属性的名称。而使用 `for of` 遍历数组可以直接拿到遍历位置的值，也不会获取到数组实例本身的属性。

```javascript
const arr = ["a", "b", "c"];
arr.anotherProperty = "hidden value";

for (let x in arr) {
  console.log(x); // 0, 1, 2, anotherProperty
}

for (let x of arr) {
  console.log(x); // a, b, c
}
```

另外由于字符串也原生实现了迭代器方法，所以字符串也可以用 `for of` 循环进行遍历。

```javascript
for (let i of "Hello!") {
  console.log(i); // H, e, l, l, o, !
}
```

#### 箭头函数 Arrow Functions

ES6 允许使用 `=>` 定义函数。使用箭头函数来表示函数体只有一行的函数非常简洁。剪头函数的一个用处就是简化回调函数。

```javascript
const af = (x) => x ** 2;
// 等同于
const af = function (x) {
  return x ** 2;
};
```

箭头函数使用时需要注意下面几点：

1. 箭头函数内的 `this` 指向定义它的对象，而非使用时的对象；
2. 箭头函数不可当构造函数使用，使用 `new` 关键字会报错；
3. 箭头函数内不存在 `arguments` 对象，如需要可使用 rest 参数；
4. 箭头函数不可定义为生成器对象，不能使用 `yield` 表达式。

其中第一点箭头函数中的 `this` 对实际使用影响最大，一般函数中的 `this` 指向运行时的作用域的 `this`，比如下面的 `setTimeout()` 的回调函数在延迟 `100` 毫秒后会在全局作用域中执行，如果使用普通函数的写法输出 `this` 将打印 `window` 对象，但是箭头函数会打印调用者对象。

```javascript
const obj = {
  printThis() {
    setTimeout(function () {
      console.log("this in general function:", this);
    }, 100);
    setTimeout(() => console.log("this in arrow function:", this), 100);
  },
};

obj.printThis();
// this in general function: Window {…}
// this in arrow function: {printThis: ƒ}
```

#### 默认参数 Default Params

ES6 允许对函数的参数设定默认值。这在处理参数为 `undefined` 时非常有用。虽然默认参数可以写在任何位置，但是如果你希望调用者可以省略这个参数，则你应该考虑把所有默认参数放在最后定义，否则调用者将无法省略默认参数。

```javascript
function f(a, power = 2) {
  return a ** power;
}

console.log(f(2)); // 4

// 如果将默认参数放在前面，则无法省略这个参数
function f2(power = 2, a) {
  return a ** power;
}
console.log(f2(2)); // NaN
console.log(f2(undefined, 2)); // 4
```

#### 类的声明 Class Declaration

ES6 加入了 `class` 概念来消除 JavaScript 中实例对象的创建过程与其他语言（比如 Java）的差异。ES6 的类声明在 ES5 中大部分都可以用 `prototype` 的写法实现，但是使用 `class` 声明的类更加清晰易懂。

```javascript
class Person {
  // constructor 是类的保留方法，这个方法将作为构造器被使用
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  toString() {
    return `${this.name} is ${this.age} years old.`;
  }
}

const john = new Person("John", 17);
console.log(john.toString());
// John is 17 years old.

// 可以将 class 视作 prototype 的语法糖
// 从下面的结果来看实际上 class 定义会转变成 prototype 上的属性
typeof Person; // "function"
Person === Person.prototype.constructor; // true

// 因此我们可以给 class 动态添加方法，并且所有实例对象可以立即使用该方法
Object.assign(Person.prototype, {
  sayHi() {
    return "Hi!";
  },
});

john.sayHi(); // "Hi!"
```

使用类时需要注意下面的细节：

1. 类的定义默认就是严格模式（strict mode）；
2. 类的定义不存在提升（hoisting），先于类定义的实例化命令会报错；
3. 类本质上是构造函数，所以函数的很多特性会被类继承；
4. 类的方法可以定义生成器；
5. 类的 `this` 指向实例对象，但是根据 JavaScript 的机制只有在实例对象后接方法调用才是如此。

**实例属性**

类的实例属性除了以 `this.property` 的形式在方法中定义，还可以写在类定义的顶部。

```javascript
class Person {
  name = "John";
  age = 17;

  toString() {
    return `${this.name} is ${this.age} years old.`;
  }
}

const john = new Person();
// Person {name: "John", age: 17}
```

**静态方法与属性**

默认类中定义的所有方法和属性都会被实例对象继承，但是如果方法或属性使用了 `static` 关键字，则该方法或属性将作为类的静态方法或属性存在，不会被实例继承。静态方法中的 `this` 指向类的定义而非实例对象。

```javascript
class Person {
  static type = "person";
  static thisIsStaticMethod() {
    console.log("Static method called!");
  }
}

console.log(Person.type); // person
console.log(Person.thisIsStaticMethod()); // Static method called!
```

**私有方法与属性**

ES6 并未提供定义私有方法和属性的途径。现有的解决方法大致分为 3 种。

1. 以下划线开始命名属性和方法，比如 `_property` 和 `_method()`，这只是一种约定，外部依然能访问到私有方法和属性；
2. 将私有方法和属性移出模块，让外部无法访问，但是不够优雅；
3. 使用 Symbol 定义方法名称，外部拿不到这个 Symbol 也就无法访问私有方法和属性。

```javascript
// 在模块外定义方法
function doSomething() {}

// 定义类方法名 Symbol
const foo = Symbol("foo");

class Person {
  // 约定命名规则定义私有方法，但是外部依然能够访问
  _privateMethod() {
    // ...
  }

  publicMethod() {
    // 将私有方法移除模块阻止外部访问
    doSomething(/* ... */);

    // 使用 Symbol 组织外部访问
    this[foo](/* ... */);
  }

  [foo]() {
    // ...
  }
}
```

**类的继承**

类可以通过 `extends` 关键字实现继承。子类会继承父类的方法和属性，包括静态方法和属性。子类实现 `constructor` 时要调用 `super()` 先实例化父类对象后才能访问到 `this` 的上下文。从这一点来看，子类实例对象只是父类实例对象上的定制化。

子类中可以通过 `super` 对象访问到父类的方法实现。在 ES5 中使用 `prototype` 方式无法继承原生属性的构造器，比如你无法定义一个新的 `Array` 类型。在 ES6 中你可以通过 `extends` 实现对原生类型的继承。

```javascript
class Person {
  name = "John";
  age = 17;
  static type = "person";
  constructor() {
    // ...
  }
  toString() {
    return `${this.name} is ${this.age} years old.`;
  }
}

class Student extends Person {
  constructor() {
    super();
    // ...
  }
  toString() {
    return "Student " + super.toString();
  }
}

console.log(Student.type); // person
console.log(new Student().toString()); // Student John is 17 years old.

// Object.getPrototypeOf() 可以判断一个类是否继承了另一个类
Object.getPrototypeOf(Student) === Person; // true
```

#### 模块 Module

ES6 实现了静态加载的模块化，结束了 JavaScript 长久以来没有原生模块化机制，只能靠第三方实现依赖管理的历史。模块化通过 `export` 和 `import` 命令完成，依赖的导入是静态的，先于模块内容执行，将 `import` 放在逻辑中会报错。这样的设计会提高编译器的效率，但是也导致不能实现动态加载。另外，ES6 的模块化自动采用严格模式，无论你有没有声明 `use strict;`。

`export` 负责将模块内的遍历暴露出来，向外提供接口。暴露接口可以指定名称，或者使用 `default` 关键字不指定名称。`export` 只能在全局作用域中使用。

```javascript
const foo = 1
const bar = 2

// 暴露变量
export foo

// 暴露多个变量
export { foo, bar }

// 暴露默认接口
export default foo

// 其他 export 方式
export default function() {}

export default class AnyClass {}
```

`import` 同样只能在全局作用域中使用。使用 `export` 定义了模块的接口之后，可以通过 `import` 命令加载这个模块。

```javascript
// 加载默认接口
import component from "./module.js";

// 加载模块中的指定接口
import { foo, bar } from "./module.js";

// 上面 2 个方式可以放一块
import component, { foo, bar } from "./module.js";

// 整体加载模块
import * as myModule from "./module.js";
```

#### Symbol

ES6 引入 `Symbol` 来解决对象属性名称冲突的问题。ES5 中的对象属性名称只能是字符串，这在大型应用开发中，如果你使用了一个他人定义的对象，并且像往里面添加属性的话，就存在属性名称冲突的风险。ES6 添加了 `Symbol` 原始数据类型，用来表示独一无二的值。也就是说现在对象属性名称可以有 2 种类型，一种是字符串，另一种就是这个 Symbol。

```javascript
const s = Symbol();

typeof s; // "symbol"

const obj = { [s]: "value of symbol" };
// {Symbol(): "value of symbol"}

console.log(obj[s]); //value of symbol
```

`Symbol` 可以接受一个字符串参数作为这个 Symbol 的描述。这个描述主要是用来区分不同的 `Symbol` 的。注意 `Symbol` 的描述只是用来区分当前的 `Symbol`，描述信息相同不代表 `Symbol` 相同。另外 `Symbol` 的值不能与其他类型做运算。

```javascript
const s1 = Symbol("foo");
const s2 = Symbol("bar");

s1.toString(); // "Symbol(foo)"
s2.toString(); // "Symbol(bar)"

s1 === Symbol("foo"); // false
```

`Symbol` 作为属性名时不会出现在 `for in` 和 `for of` 循环中，也不会被 `Object.values()`、`Object.getOwnPropertyNames()` 和 `JSON.stringify()` 方法返回。你可以使用 `Object.getOwnPropertySymbols()` 获取指定对象的 Symbol 属性名。利用这个特性，我们可以定义一些非私有而又希望仅在内部使用的属性和方法。

```javascript
const s1 = Symbol("foo");
const s2 = Symbol("bar");

const obj = { [s1]: "value1", [s2]: "value2" };

Object.getOwnPropertyNames(obj);
// []
Object.getOwnPropertySymbols(obj);
// (2) [Symbol(foo), Symbol(bar)]
```

有时我们希望重复使用同一个 Symbol 值。`Symbol.for()` 方法获取的 Symbol 值会现在全局中搜索是否存在对应描述符的 Symbol，如果没有则新建一个 Symbol 并将其注册到全局中，方便之后使用。但是注意 `Symbol.for()` 拿到的值与 `Symbol()` 不会相同。

```javascript
const s1 = Symbol.for("foo");
const s2 = Symbol.for("foo");

s1 === s2; // true
s1 === Symbol("foo"); // false
```

还有另一个方法 `Symbol.keyFor()` 配合使用，可以拿到从全局中获取的 Symbol 的键。如果这个 Symbol 没有登记到全局则会返回 `undefined`。

```javascript
const s1 = Symbol.for("foo");
Symbol.keyFor(s1); // "foo"

const s2 = Symbol("foo");
Symbol.keyFor(s2); // undefined
```

ES6 提供了 11 个内置的 Symbol 值，指向语言内部使用的方法。

| Name                        | Description                                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| `Symbol.hasInstance`        | 使用 `instanceof` 关键字时实际上会调用对象的 `Symbol.hasInstance` 方法来进行判断             |
| `Symbol.isConcatSpreadable` | 布尔值用来判断对象在使用数组实例的 `.concat()` 时是否能够展开                                |
| `Symbol.species`            | 属性指向一个构造函数，在创建衍生对象时会使用该属性                                           |
| `Symbol.match`              | 当执行 `str.match(obj)` 时如果对象存在这个属性，则会调用它进行判断                           |
| `Symbol.replace`            | 当执行 `str.replace(obj)` 时如果对象存在这个属性，则会调用它进行处理                         |
| `Symbol.search`             | 当执行 `str.search(obj)` 时如果对象存在这个属性，则会调用它进行处理                          |
| `Symbol.split`              | 当执行 `str.split(obj)` 时如果对象存在这个属性，则会调用它进行处理                           |
| `Symbol.iterator`           | 定义对象的迭代器，在遇到需要迭代对象时会自动调用                                             |
| `Symbol.toPrimitive`        | 对象被转为初始类型时会调用该方法                                                             |
| `Symbol.toStringTag`        | 当调用对象的 `.toString()` 时会调用，用来替换 `[object Object]` 中的 `Object` 表示对象的类型 |
| `Symbol.unscopables`        | 一系列属性在使用 `with` 关键字时会被 `with` 环境排除                                         |

## References

- [ECMAScript - Wikipedia](https://en.wikipedia.org/wiki/ECMAScript)
- [ECMA-262 - Ecma International](https://262.ecma-international.org/6.0/)
- [ES6 入门教程](https://www.bookstack.cn/read/es6-3rd/README.md)
