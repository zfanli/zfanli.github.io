(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["post7"],{"52a2":function(n,e){n.exports={attributes:{title:"关于 VBA 的笔记",subtitle:"工作中使用 VBA 写了个小工具提高了一些效率，记录一下相关的资料。虽然据说这东西快要被淘汰了。",date:"2017-10-29T07:20:10.000Z",tags:["VBA"]},body:'\n我为什么会去研究 VBA 呢？\n\n工作中要整理一堆电子表格，有些表格里面存在一些宏，有些已经不好用了，所以无奈之下我要做一些调试，甚至还要弄一些新的工具出来。\n\n当然不可否认的是，用 VBA 写出来的工具确实可以提高几倍整理文档的效率，但是老实说，我还是不太乐意花时间在研究这东西上。毕竟微软要淘汰 VBA 的消息层出不穷，而且据说微软还计划将 Python 内置进 Excel 里面取代 VBA，还听说微软在用 JS 重写 Office 系列产品...\n\n不过，既然花了时间了也别让消耗的时间白白浪费，做一些笔记以备以后需要，虽然我还是希望以后用不上才好！\n\n### VBA 的基本实现\n\n说到 VBA，这货是 Excel 的根本实现。我们在 Excel 中的任何操作都可以转化成 VBA 代码代替我们实现。于是，如果我们有一段重复性的对 Excel 操作的流程的话，可以将其转化为 VBA 来提升效率。这样我们就可以动动手指，看着程序自动帮我们完成工作了。\n\n要了解 VBA 的工作原理，最方便的做法是用宏录制工具录制一些操作，生成一些 VBA 代码，来看看这些代码是如何帮助我们完成我们所需的操作的。\n\n作为前提，我们需要在 Excel 中启用开发工具。\n\n**在工具栏空白处点击鼠标右键，选择自定义功能区**\n\n![自定义功能区](/img/memo-vba/open-tool.gif)\n\n**在弹出的菜单中勾选开发工具**\n\n![启用开发工具](/img/memo-vba/open-tool-2.gif)\n\n开启后我们就可以在工具栏看到下面的界面了。\n\n![开发工具](/img/memo-vba/tool.gif)\n\n工具开启了，接下来我们就窥看一下究竟何谓 VBA 吧！\n\n首先想一个需求。大概做成下面这个样子吧，先来简单点的，看看效果。这里我是随手写了几个名字，然后给表头加上了筛选。\n\n![sheet1](/img/memo-vba/sheet1.gif)\n\n我们在这个数据上做一个筛选，把小林剔除掉。\n\n![sheet1-2](/img/memo-vba/sheet1-2.gif)\n\n我们点击录制宏工具之后按照上面这样操作一遍。\n\n![使用录制宏](/img/memo-vba/use-tool.gif)\n\n结束时再点击一下停止录制。\n\n![停止录制宏](/img/memo-vba/use-tool-2.gif)\n\n然后我们按`Alt+F11`打开 VBA 界面。找到刚才生成的 VBA 代码，一般在下面这个文件中。\n\n![宏文件](/img/memo-vba/vba-1.gif)\n\n点开它，我们就可以看到工具自动生成的代码。\n\n![宏代码](/img/memo-vba/vba-2.gif)\n\n我们仔细一看，可以发现每一行都是我们的一个操作。\n\n下面逐行理解一下这段代码。首先 VBA 的方法以 `Sub 方法名()` 开头，以 `End Sub` 结尾，中间被包括起来的部分就是方法体了。\n\n其次我们了解到在 VBA 中，以 `\'（单引号）` 表示注释。我们来看方法体。`Range("A1").Select` 表示我们的第一个操作，鼠标左键点击 A1 单元格，这时 A1 是被选中的状态。`ActiveCell.FormulaR1C1 = "姓名"` 是我们的第二个操作，给激活的单元格赋值为 `姓名`。这里使用了 `FormulaR1C1` 方法赋值，这个方法可以给单元格赋值公式。（具体后面提到的话再详细说）\n\n选择单元格并且赋值的操作循环了几次，直到 `Selection.AutoFilter` 这一步，这一步的前一句和一开始一样 `Range("A1").Select`，我们重新点击选中了单元格 A1，然后给 A1 打开了筛选。到这里我们的数据展示基本完成了。下面就是进一步筛选数据了。\n\n`ActiveSheet.Range("$A$1:$A$7").AutoFilter Field:=1, Criteria1:=Array("李四", _` 这一句表示在 `$A$1:$A$7` 这个绝对引用的范围内调用 `AutoFilter` 方法，其参数是 `Field` 筛选基准字段的偏移量为 1，`Criteria1` 筛选条件为后面列出的一个数组，这个数组中包括的值是显示的值。但是这句话没有结束，这里使用了 `_（下划线）` 表示换行，下一行仍然是这一句代码。\n\n`"南宫", "欧阳", "王五", "张三"), Operator:=xlFilterValues` 这是上一行的后续，补充完整了显示出来的值的数组，并且 `Operator` 属性指定了筛选的类型。（这个筛选类型暂时还不太清楚是什么意思）这里我们把小林给筛除了，所以数组中并没有小林。\n\n我们可以尝试的运行一下宏，我们先添加一个新的 sheet，在新的 sheet 上按 `Alt+F8` 打开宏选框，选择刚才录制的宏，点执行。\n\n![使用宏](/img/memo-vba/use-macro.gif)\n\n宏运行结束之后，我们可以看到在新的 sheet 上我们得到了和一开始操作完全一致的结果。\n\n到这里我们的首次尝试结束了。但是我们的重点其实并不是如何使用录制宏。这里录制宏生成的代码也有些呆板，如果是我们自己写的话，应该会写成下面这样，得到的结果和我们第一次操作的结果一致。\n\n```c\nSub Test()\n    With ActiveSheet\n        .Cells(1, 1).Value = "姓名"\n        .Cells(2, 1).Value = "张三"\n        .Cells(3, 1).Value = "李四"\n        .Cells(4, 1).Value = "王五"\n        .Cells(5, 1).Value = "欧阳"\n        .Cells(6, 1).Value = "南宫"\n        .Cells(7, 1).Value = "小林"\n    End With\n    ActiveSheet.Range("A1").AutoFilter Field:=1, Criteria1:=Array("李四", _\n        "南宫", "欧阳", "王五", "张三"), Operator:=xlFilterValues\nEnd Sub\n```\n\n通过这些代码的阅读，其实我们已经可以看出 VBA 的基本构成了。\n\n我个人使用 VBA 写了一些代码之后的感受（并没有用很久）：\n\n**VBA 是面向对象的基于 API 操作 Excel 的语言。**\n\nVBA 内部封装了很多 Excel 元素的对象，例如 sheet，cell，column，row 等。我们对 Excel 可以做的任何操作用 VBA 同样可以实现。\n\n同时，VBA 操作 Excel 具有先天优势，虽然可能同样的操作在其他语言中有更简单的写法，但不同与其他语言需要依赖开发环境，运行环境以及 Excel 对接，VBA 仅依赖于 Office 软件，而不依赖系统，IDE，或者其他任何运行环境。\n\n好了，废话有点多，接下来看看 VBA 的基础吧。\n\n### VBA 基础-对象，属性，方法，事件\n\n之前提到 VBA 面向对象，其实也是我想岔了。\n\nVBA 里面确实封装了很多对象，所有我们能操作的元素都是对象，但是并非我们面向对象编程，而是我们使用这些存在的对象编写操作过程。其实对我们来说还是面向过程编程，即函数式编程。\n\n我们不能新建一个类，然后实例化它（至少就我不多的了解是不行的），我们做的最大程度也无非写几个 function 在 sub 里面 call 一下它们。\n\n相对于没有返回值的 sub，function 是有返回值的函数。\n\n虽然 VBA 存在一些缺点，也无法做到类似 Java 或者其他语言能完成的复杂工作，但是在操作 Excel 方面还是没人能比得过它的。\n\n先说几个概念。\n\n对象，这个不多说，OOP 太熟悉了，VBA 中我们能遇到的所有 Excel 组成成分都以对象的身份参与到我们的代码中。\n\n属性，这个也没什么好说的，对象的属性，影响对象的存在。\n\n方法，这个就是我们编程的主要内容了，我们要写出操作对象和属性的代码，这些代码都在各个方法里面等待被执行。\n\n事件，熟悉 JS 的话也很好理解，Java 里面 GUI 也涉及到事件，VBA 中的事件有鼠标操作，键盘操作，单元格的选择与值的修改等等都是一个个事件，我们可以编写在这些事件触发时的程序来满足我们的需求。也是很方便的东西。\n\n以上，虽然我解释的并不是很多，毕竟我是以有其他编程语言基础的角度来简单的介绍这些概念的。如果阅读这篇文章的你不理解对象的概念的话，简单百度一下 OOP。\n\n说到这里，都很好理解吧？\n\n接下来有点枯燥，让我们来看看数据类型，虽然枯燥却是很重要的内容。\n\n### VBA 数据类型和变量\n\n编写程序免不了处理各种数据，这些数据有些会储存在各种资源中，当然更多的是储存在变量之中的。所以我们需要了解 VBA 的数据类型，以及如何声明各个类型的变量。\n\n| 数据类型              | 存储空间大小          | 范围                                                                                                                                                                         |\n| :-------------------- | :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |\n| Byte                  | 1 个字节              | 0 到 255                                                                                                                                                                     |\n| Boolean               | 2 个字节              | True 或 False                                                                                                                                                                |\n| Integer               | 2 个字节              | -32,768 到 32,767                                                                                                                                                            |\n| Long(长整型)          | 4 个字节              | -2,147,483,648 到 2,147,483,647                                                                                                                                              |\n| Single (单精度浮点型) | 4 个字节              | 负数时从 -3.402823E38 到 -1.401298E-45；正数时从 1.401298E-45 到 3.402823E38                                                                                                 |\n| Double (双精度浮点型) | 8 个字节              | 负数时从 -1.79769313486232E308 到 -4.94065645841247E-324；<br>正数时从 4.94065645841247E-324 到 1.79769313486232E308                                                         |\n| Currency (变比整型)   | 8 个字节              | 从 -922,337,203,685,477.5808 到 922,337,203,685,477.5807                                                                                                                     |\n| Decimal               | 14 个字节             | 没有小数点时为 +/-79,228,162,514,264,337,593,543,950,335，而小数点右边有 28 位数时为 +/-7.9228162514264337593543950335；<br>最小的非零值为 +/-0.0000000000000000000000000001 |\n| Date                  | 8 个字节              | 100 年 1 月 1 日 到 9999 年 12 月 31 日                                                                                                                                      |\n| Object                | 4 个字节              | 任何 Object 引用                                                                                                                                                             |\n| String (变长)         | 10 字节加字符串长度   | 0 到大约 20 亿                                                                                                                                                               |\n| String(定长)          | 字符串长度            | 1 到大约 65,400                                                                                                                                                              |\n| Variant(数字)         | 16 个字节             | 任何数字值，最大可达 Double 的范围                                                                                                                                           |\n| Variant(字符)         | 22 个字节加字符串长度 | 与变长 String 有相同的范围                                                                                                                                                   |\n| 用户自定义            | 所有元素所需数目      | 每个元素的范围与它本身的数据类型的范围相同。                                                                                                                                 |\n\n定义变量的方式：\n\n```c\nDim 变量名 As 数据类型\n```\n\n定义变量除了可以使用 Dim 语句外，比较常的还有：static 语句，Private 语句，Public 语句。\n\n给变量赋值的方式：\n\n```c\n变量名 = 值\n```\n\n定义一个常量：\n\n```c\nConst 常量名 As 数据类型 ＝ 常量的值\n```\n\n### 逻辑判断语句\n\nIf 语句就不多说啦。\n\n```c\nif  逻辑表达式 then\n    内容\nElseIf 逻辑表达式 then\n    内容\nElse\n    内容\nend if\n```\n\nFor 语句其实和其他语言一样，就是要注意一下步长，就是 Java 的 for 的第三段，循环结束后对循环变量的操作。\n\n```c\nFor 循环变量＝初值 to 终值 step 步长\n     循环体1\n    [exit for]\n    循环体2\nnext 循环变量\n```\n\nFor Each 也不必多说。\n\n```c\nFor Each 元素变量 In 对象集合或数组名称\n      语句块1\n      [Exit For]\n      语句块2\nnext 元素变量\n```\n\n下面是 While 语句。\n\n```c\nDo While 循环条件\n      语句块1\n     [Exit Do]\n      语句块2\nLoop\n```\n\n```c\nDo\n    语句块1\n   [Exit Do]\n    语句块2\nLoop While 循环条件\n```\n\n有点匆忙，是因为我觉得没必要用太多篇幅介绍了，到这里我们已经了解到了大部分我们需要的 VBA 基础了。\n\n我们知道了数据类型，怎么定义变量，给变量赋值，如何使用逻辑判断和循环，我们已经可以写出实用的 VBA 小程序了。或许你还觉得我们缺少对 Excel 元素的认识？没关系，如果你想要的效果你不知道用什么对象的话，录制宏手动操作一遍，你就知道了！\n\n我们做个小例子。\n\n### 尝试使用 VBA\n\n在说 VBA 基本实现的时候我们举得那个小例子，我们再次升级一下，我们在 sheet 里放两个按钮，其中一个点击写书据到当前 sheet，另一个用来清除这些数据。想想该怎么写，不知道操作什么？录制宏帮助你排忧解难！\n\n不过我们先来看看怎么放置按钮在页面上吧。我们点开开发工具页面，点击插入，选择第一个按钮工具。\n\n![设置按钮](/img/memo-vba/set-button.gif)\n\n再想放置按钮的地方拉出一个按钮，这时一般会弹出指定宏的界面，当然我们也可以之后再设置。\n\n![指定宏](/img/memo-vba/set-macro.gif)\n\n（这里我已经准备好了要使用的宏）\n\n我再贴一次写书据的方法：\n\n```c\nSub Test()\n    With ActiveSheet\n        .Cells(1, 1).Value = "姓名"\n        .Cells(2, 1).Value = "张三"\n        .Cells(3, 1).Value = "李四"\n        .Cells(4, 1).Value = "王五"\n        .Cells(5, 1).Value = "欧阳"\n        .Cells(6, 1).Value = "南宫"\n        .Cells(7, 1).Value = "小林"\n    End With\n    ActiveSheet.Range("A1").AutoFilter Field:=1, Criteria1:=Array("李四", _\n        "南宫", "欧阳", "王五", "张三"), Operator:=xlFilterValues\n\nEnd Sub\n```\n\n根据我们的需求还需要一个清除数据的方法：\n\n```c\nSub clear()\n    Dim i As Integer\n    For i = 1 To 7\n        ActiveSheet.Cells(i, 1).Value = ""\n    Next i\n    ActiveSheet.AutoFilterMode = False\nEnd Sub\n```\n\n我们在 sheet 中放置两个按钮，并且指定这两个宏给按钮。大概是下面这个样子。\n\n![放置按钮](/img/memo-vba/put-button.gif)\n\n（样式就不用管啦，演示一下而已）\n\n下面是个动图，看看效果。\n\n![演示效果](/img/memo-vba/show-usage.gif)\n\n一个最简单的例子就这样完成了。\n\n研究到此为止。\n',frontmatter:"title: 关于 VBA 的笔记\nsubtitle: 工作中使用 VBA 写了个小工具提高了一些效率，记录一下相关的资料。虽然据说这东西快要被淘汰了。\ndate: 2017-10-29 15:20:10 +8\ntags:\n  - VBA"}}}]);
//# sourceMappingURL=post7.2a965a9f.js.map