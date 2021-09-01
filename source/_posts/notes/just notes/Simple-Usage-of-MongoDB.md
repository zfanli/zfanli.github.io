---
title: 从需求来看 MongoDB 的最简单用法
date: '2018-12-22T15:51:37Z'
tags:
  - MongoDB
  - Python
categories:
  - notes
  - just notes
---

从需求来看 MongoDB，了解能满足我们需求的最简用法。

这篇文章介绍如何在 Python 中操作 MongoDB，面向初学者。我们使用 MongoDB 来储存一个网站的数据，去满足搭建一个博客网站可能会遇到的需求，以此为例来熟悉和了解 MongoDB。

以下是这篇文章讨论的内容：

- 设计符合需求的数据结构
- document 的增删改查

<!-- more -->

这些内容是基础知识。

## 设计符合需求的数据结构

// TODO or delete

// Or maybe extract this part as a single post.

## document 的增删改查

### 连接 MongoDB

这是一个连接 MongoDB 的示例代码，主要用来定义几个变量方便后面使用。

```python
from pymongo import MongoClient
from bson import ObjectId


mc = MongoClient() # connect to default client
db = mc['test'] # use 'test' database
col = db['test-collection'] # use 'test-collection' collection

```

### find 查询

查询是使用数据库的基础需求。在 MongoDB 中查询分为两种，查询单个值的 `find_one` 和查询多个值的 `find`。使用方法示例如下。

#### find_one & find

```python
# Query for only one document
col.find_one({
    'some_fields': 'values',
    'array_fields': ['value1', 'value2'],
    'object_fields': {'keys': 'values'}
})
# Query for one or more than one documents
col.find({
    'some_fields': 'values',
    'array_fields': ['value1', 'value2'],
    'object_fields': {'keys': 'values'}
})
```

从上面的例子可以知道，查询方法接收一个参数作为查询条件，且这个参数需要是 `dict` 对象类型。这个例子如果放在 SQL 语句中对应 `select * from ... where ...` 句式。

上面的例子查询条件是几个精确值，很多时候我们的查询条件无法准确到一个具体的值，需要限定一个范围查询。MongoDB 使用比较操作符来圈定范围，来看下面这个例子 🌰。

```python
col.find(
    {
        'views': {'$gte': 1000},
    }
)
```

这个例子中，我们可以拿到所有 `views` 值大于等于 1000 的文章。比较操作符 `$gte` 表达大于等于的关系，这是 `greater than or equal to` 的缩写，含义等同于 `>=`。

常用的比较操作符有下面这些：

- `$eq` equal to
- `$gt` greater than
- `$gte` greater than or equal to
- `$lt` less than
- `$lte` less than or equal to
- `$ne` not equal to
- `$in` match in an array
- `$nin` not match in an array

这些操作符中，`$in` 和 `$nin` 需要匹配数组，例如 `$in` 的表达方式如下：

```python
{'field_name': {'$in': ['value1', 'value2'...'values']}}
```

而其他的比较操作符需要匹配单个值，例如 `$eq` 的表达方式如下：

```python
{'field_name': {'$eq': 'value'}}
```

这些操作符可用于所有比较关系，不仅限于 `find` 查询，还包括更新、删除和 `aggregate` 聚合等场合。

#### project 计划字段

`find` 默认拉取整个 document 作为输出，类似 SQL 的 `select * from table`，这意味着即使你只想要这个文档中的一个字段，你也将先得到整个文档，然后从中取得你想要的字段。通常出于带宽的限制以及性能的考虑，这都不是一个好主意，好在有办法只取某几个字段，在 MongoDB 中这个概念被称作 `project`。

`find` 方法的第二个参数将被视为 `projection`，同样也需要是 `dict` 对象类型。

```python
col.find(
    {},
    {
        'title': 1,
        'author': 1,
        'content': 1,
    }
)
```

这个例子中，我们在第二个参数中列出需要的字段名，并将其值设为 `1`， 我们就完成了对需要字段的声明。`projection` 中字段对应的值是一个 flag，当其为 `1` 的时候，代表**包含关系**，让 MongoDB 可以理解我们的需求，仅取出需要的字段。

或者，我们也可以声明不要获取哪些字段。

```python
col.find(
    {},
    {
        'comments': 0,
        'timestamp': 0,
        'reviews': 0,
    }
)
```

上面说到 `projection` 中字段对应的值是 flag，那么 `0` 就表示**不包含关系**。MongoDB 会知道我们的意思，并且把我们声明不需要的字段以外的数据都取出来，这在一些场景下很有用。

在使用 `projection` 时需要注意，`_id` 字段在 MongoDB 中有特殊的地位，即使没有被声明为需要获取的字段，其依然会被默认抽取出来。但如果你确实不需要它，可以在 `projection` 中手动设置为 `0`，它就不会出现了。

```python
col.find(
    {},
    {
        '_id': 0,
        'title': 1,
        'author': 1,
        'content': 1,
    }
)
```

**但是注意，除了 `_id` 以外，包含关系（`1`）和不包含关系（`0`）是不能共存的，否则你会得到下面这个错误。**

```
pymongo.errors.OperationFailure: Projection cannot have a mix of inclusion and exclusion.
```

所以需要记住，对于 `_id` 来说，想要不显示它需要手动设置为 `0`。但对其他字段来说，只能有两个选择，声明所有需要获取的字段，或者声明所有不需要获取的字段。如果你尝试同时要求 MongoDB 理解你需要哪些字段和不需要哪些字段，那么只能得到无情的报错。

#### project 进阶

声明获取和不获取的字段只是 `project` 的一个功能，除此之外它还有很多很实用的能力。例如当需要查询一个数组对象时，有时我们需要更高精度的操作，比如做评论的分页时，通常一次性取出所有评论是没有必要的，有时甚至是昂贵的，这时我们可以使用 `project` 来帮我们做一些更进一步的操作。来看看这个例子 🌰。

```python
col.find(
    {},
    {
        # Fetch the 0-3 of comments
        'comments': {
            '$slice': 3
        }
        # Fetch the 2-6 of comments
        'comments': {
            '$slice': [2, 6]
        }
        # Fetch the last comment
        'comments': {
            '$slice': -1
        }
    }
)
```

上面的例子中展示了数组切片操作符的用法，其效果等同于 Python 中数组的切片操作。第一个 comments 取了数组的前 3 条数据，第二个 comments 取得了第 2 条到第 6 条的数据，最后一个 comments 取得了倒数第 1 条数据。

或者，有时我们仅需要取出符合要求的第一个评论，

```python
col.find(
    {},
    {
        # Fetch the first deleted comment
        'comments': {
            '$elemMatch': {
                'deleted': True
            }
        }
    }
)

col.find(
    # Fetch the first element matched the condition
    {
        'comments': {
            'deleted': True
        }
    },
    {
        'comments.$': 1
    }
)
```

上面的两个查询的效果一样，都是获取评论数组中满足删除 Flag 为 `true` 这个条件的第一条评论。不过这个例子的匹配世界上用处有限，因为通常我们需要取出的是满足条件的多条评论，而非最初的某一条。但是 `project` 虽然有办法实现，却不是在 `find` 方法中实现，在之后的关于 `aggregate` 的文章中我们再继续讨论如何满足这个需求吧。

目前为止涉及的文档：

- [Query Documents](https://docs.mongodb.com/manual/tutorial/query-documents/)
- [Comparison Query Operators](https://docs.mongodb.com/manual/reference/operator/query-comparison/)
- [Project Fields to Return from Query](https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/)
- [collection – Collection level operations - find()](http://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.find)
- [collection – Collection level operations - find_one()](http://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.find_one)

### update 更新

修改已有的数据是普遍的需求。在我们要设计的博客系统中，用户主动以及被动的操作都会触发数据的变更，比如当用户打开一篇文章时，这篇文章的浏览数会得到更新；当用户赞了这篇文章时，这篇文章的点赞数也会得到更新；或者当用户在线修改了一篇文章的内容，这次修改也需要正确地更新到数据源上。

#### update_one

```python
# Get user inputted content
new_content = get_user_input()

# Update specified article
col.update_one(
    # Match article by id
    {'_id': ObjectId('5b432a42f04705565525529d')},
    # Update content
    {
        '$set': {'content': new_content}
    }
)
```

上面这个简单的例子中，我们假设通过 `get_user_input()` 函数拿到了用户的输入数据。接下来我们对指定的文章做了一次更新。

在例子中我们给 `update_one` 方法传递了两个参数，第一个是查询参数，对应 SQL 中的 `where` 小句。第二个参数是更新参数，`$set` 是更新操作的操作符，它的值也是一个 `dict` 对象，描述将什么字段更新成什么值，对应 SQL 中的 `update table set ...` 句式。

这是一个简单的更新操作，我们实际上做的是：

更新 `_id` 为给定值的文章，更新的字段是 `content（内容）`，更新的内容是我们之前拿到的用户输入值 `new_content`。

> `_id` 是 MongoDB 中自动生成的一个字段，作为主键来标识数据的唯一性，它是一个对象而非字符串，在 Python 中指定的时候需要用 `ObjectId(）` 方法来生成一个 ID 对象。

#### $inc 数值增量

回到更新文字阅读数和点赞数的例子 🌰，在这个场景中，我们希望阅读数和点赞数字段更新的结果是在原有的基础上增加 1，而不是设置一个具体的值给他。

```python
col.update_one(
    # Match article by id
    {'_id': ObjectId('5b432a42f04705565525529d')},
    # Update views
    {
        '$inc': {'views': 1}
    }
)
```

MongoDB 提供了一个 `$inc` 操作符来实现给指定的字段做增量操作。所有我们实际的操作是：更新 `_id` 为给定值的文章，更新的字段是 `views（点击量）`，更新的内容是在原有的基础上加 1。当然增量的值是根据需要设定的。

```python
col.update_one(
    # Match user by username
    {'username': 'Richard',
    # Update points
    {
        '$inc': {'points': 100}
    }
)
```

上面的例子中，我们给名为 Richard 的用户增加了 100 积分来激励他继续使用我们的网站。

```python
col.update_one(
    # Match user by username
    {'username': 'Richard',
    # Update points
    {
        '$inc': {'points': -999}
    }
)
```

负值当然也是允许的，接着因为剧情需要我们发现了 Richard 的违规行为，谨慎考虑后我们决定扣除 999 积分以示惩戒。

这些操作都可以使用 `$inc` 完成。不过当然我们的博客也不需要积分系统。

上面的例子都使用了 `update_one` 方法，顾名思义其只对一个目标进行更新，当更新多个目标时我们用到另一个方法。

#### update_many

我们对所有点击量超过 1000 的文章进行一次更新，将它们标注为热点文章。

```python
col.update_many(
    {'views': {'$gte': 1000}},
    {
        '$set': {'hot_topic': True}
    }
)
```

使用 `update_many` 进行批量更新操作时，同样的第一个参数将作为查询参数来负责筛选出我们需要的数据，第二个参数则将指定的字段更新为新的值。

`update_many` 会返回一个 `UpdateResult` 对象，里面包含诸如匹配行数和修改行数等信息。

但是当我们在设计 RESTful API 的时候，一个比较好的实践是，更新操作完成后将更新后的对象作为响应对象交付给客户端，这样可以减少请求数量，并且准确的保持服务端和客户端的数据一致性。

要满足这个需求，就目前所了解到的信息，我们可以先执行一次更新操作，然后在执行一次查询操作，将更新后的数据再次取出来。但这太繁琐了，没关系，有一个更好的办法可以使用。

#### find_one_and_update

从名称上我们就可以轻松的理解这个方法的含义，就是查找一个对象并且更新它。

```python
from time import time
from pymongo import ReturnDocument

# Get user inputted content
new_content = get_user_input()

col.find_one_and_update(
    # Match article by id
    {
        '_id': ObjectId('5b432a42f04705565525529d')
    },
    # Update content and timestamp
    {
        '$set': {
            'content': new_content,
            'updated_time': time()
        }
    },
    # Project fields
    {
        'title': 1,
        'username': 1,
        'content': 1,
        'reviews': 1,
        'comment': 1,
        'updated_time': 1
    },
    # Return modified document
    return_document=ReturnDocument.AFTER
)
```

例子 🌰 稍微有点长，首先我们导入了两个工具。和之前一样，假设我们从 `get_user_input()` 方法拿到了用户的输入内容，这是我们将要更新的数据。接着使用 `find_one_and_update` 来更新数据。

第一个参数是作为查询参数，匹配一个唯一的 `_id`；第二个参数是更新内容，我们将 `content` 更新为新的用户输入，并且使用 `time()` 工具更新时间戳；注意，这里出现了**第三个参数**，由于要进行一次查找文档，我们可以利用 `project` 计划字段来指定需要的字段。关于更新和查找的参数就是这些。

第四个参数是一个选项，是可以省略的，但是要小心，默认情况下，`find_one_and_update` 方法就如其名，会先查找出文档，再进行更新操作，这样的话返回的就是**更新前的文档**。

显然，为了保持数据一致性我们需求的应该是更新后的文档，`return_document` 选项就是用来指定这个行为的。从 `pymongo` 包中导入的 `ReturnDocument` 工具可以提供几个选项，在这里我们将 `ReturnDocument.AFTER` 设置给 `return_document` 即可告诉 MongoDB 给我们更新后的文档。

关于更新，了解这些想必搭建一个 blog 网站是够用了。

这一部分涉及的文档：

- [Field Update Operators](https://docs.mongodb.com/manual/reference/operator/update-field/)
- [collection – Collection level operations - update_one()](http://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.update_one)
- [collection – Collection level operations - update_many()](http://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.update_many)
- [collection – Collection level operations - find_one_and_update()](http://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.find_one_and_update)

### delete 删除

一般的删除操作我们仅在逻辑层面上对数据进行删除，具体的操作是设定一个删除 Flag，对需要删除的数据进行更新，将该 Flag 值更新为 `True`，这样只需要用到上述的更新方法就可以完成了。

逻辑删除的好处之一是在于留有一些余地，当某些数据被误删除时能够及时得到恢复，毕竟数据是最重要的，而储存空间是便宜的。

不过当某些数据被最终认定为无用数据时，就是时候进行物理删除了。

**删除操作非常简单，但同时需要非常慎重。**

#### delete_one

```python
col.delete_one(
    # Delete specified article
    {'_id': ObjectId('5b432a42f04705565525529d')}
)
```

上面的例子将删除 `_id` 匹配的文章。

#### delete_many

```python
col.delete_many(
    # Delete articles which deleted flag is True
    {'deleted': True}
)
```

上面的例子将删除所有被逻辑删除的文章。在这里逻辑删除 Flag 名称是 `deleted`。

可以看到，无论是删除一个目标还是删除多个目标，对于删除方法来说只需要一个匹配参数来识别数据。

#### find_one_and_delete

有时我们可能会需要将删除的文档放在 response 中返回给客户端，来看看例子 🌰。

```python
col.find_one_and_delete(
    # Match article by id
    {
        '_id': ObjectId('5b432a42f04705565525529d')
    },
    # Project field_names
    {
        'title': 1,
        'username': 1,
        'content': 1,
        'reviews': 1,
        'comment': 1,
        'updated_time': 1
    }
)
```

上面这个例子很简单，匹配 `_id` 对应的文章，删除它，第二个参数作为 `project` 声明获取的字段，最终我们会得到一个文档，但是在数据库上这个文档已经被删除了。

删除操作看上去很简单，但是一份数据被删除的后果可能会很严重，对于删除操作我们应该小心慎行，毕竟数据无价。

这部分内容涉及的文档：

- [collection – Collection level operations - delete_one()](http://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.delete_one)
- [collection – Collection level operations - delete_many()](http://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.delete_many)
- [collection – Collection level operations - find_one_and_delete()](http://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.find_one_and_delete)

### insert 插入

插入操作是保存数据的核心。了解完查询、更新和删除操作的使用方法，插入操作则显得很简单。

#### insert_one

当用户发表了 1 条评论，我们需要将这条评论保存到正确的文档下面。

```python
col.insert_one(
    {
        'username': 'Richard',
        'article_id': ObjectId('5b432a42f04705565525529d'),
        'comment': 'Awesome!',
        'timestamp': 1531211551.682105
    }
)
```

上面的例子将保存一条来自用户 Richard 的评论，虽然评论内容没什么意义，但是它还是被正常的保存在数据库了。或许我们应该把这条评论的 ID 发回客户端，让我们稍微修改下这个例子。

```python
result = col.insert_one(
    {
        'username': 'Richard',
        'article_id': ObjectId('5b432a42f04705565525529d'),
        'comment': 'Awesome!',
        'timestamp': 1531211551.682105
    }
)
comment_id = result.inserted_id
```

用一个变量接受插入操作的结果对象，里面包含了我们需要的 ID，使用 `inserted_id` key 可以将其取出来。你或许觉得有些麻烦，为何我们不能手动设置 ID，或者设置我们想要的 ID？

再修改一下代码。

```python
col.insert_one(
    {
        '_id': 'cid007',
        'username': 'Richard',
        'article_id': ObjectId('5b432a42f04705565525529d'),
        'comment': 'Awesome!',
        'timestamp': 1531211551.682105
    }
)
```

当我们手动指定了 ID 字段，MongoDB 将不会自动为我们生成新的 ID，有些时候会比较有用，根据你的习惯来决定是否需要手动来设定 ID 吧！

#### insert_many

有时我们可能需要考虑到减少请求数量，仅在收集了一些评论之后才真正到进行更新，当然这里我们关注的重点是如何同时更新多条评论。

```python
col.insert_many(
    [
        {
            'username': 'Richard',
            'article_id': ObjectId('5b432a42f04705565525529d'),
            'comment': 'Awesome!',
            'timestamp': 1531211551.682105
        },
        {
            'username': 'Richard',
            'article_id': ObjectId('5b432a42f04705565525529d'),
            'comment': 'Awesome again!',
            'timestamp': 1531212418.92356
        }
    ]
)
```

我们又插入了两条没有意义的评论。

可以看到 `insert_many` 接收一个文档 list，同样的，如果需要得到 ID，可以用一个变量接收插入操作的结果，使用 `inserted_ids` 来获得 ID，但是注意，获得的将会是一个 ID 的 list。

插入操作同样很简单。但是目前为止，我们似乎默认了一个事实，将评论储存在一个单独的 collection 中。

MongoDB 是一个文档数据库，不应该用传统的关系型数据库的思路来看待它，对于文章和评论这种典型的一对多的关系，内嵌数组会是一种更好的数据结构。

```python
articles = {
    # Article ID
    '_id': '5b33af56d2cbe686e00b75c9',
    # Other field_names
    # ...
    # Comments
    'comments': [
        {
            # Comment ID
            'cid': '5b3dc242f0470538510b28d7',
            # Username
            'from': 'Richard',
            # Comment body
            'body': 'Content of comment.',
            # Created or updated timestamp
            'timestamp': 1529248843.301676,
            # Deleted flag
            'deleted': False
        },
        # ...
    ],
    # Created or updated timestamp
    'timestamp': 1529248869.717813,
    # ...
}
```

评论作为一个 list 内嵌在所属的文章文档里，这时添加一个评论不再是插入操作了，它变成了一个更新操作。

#### update array use $push

```python
col.update_one(
    {'_id': Object('5b33af56d2cbe686e00b75c9')},
    {
        '$push': {
            'comments': {
                'username': 'Richard',
                'cid': ObjectId(),
                'comment': 'Awesome!',
                'timestamp': 1531211551.682105
            }
        }
    }
)
```

使用 `$push` 操作符可以将一条评论添加到评论 list 中。而由于评论不再是单独的文档，不再自动生成 ID 属性，如果需要的话我们可以通过调用不带参数的 `ObjectId()` 来手动生成一个 ID 属性。

这部分涉及的文档：

- [collection – Collection level operations - insert_one()](http://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.insert_one)
- [collection – Collection level operations - insert_many()](hhttp://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.insert_many)
- [results – Result class definitions - InsertOneResult](http://api.mongodb.com/python/current/api/pymongo/results.html#pymongo.results.InsertOneResult)
- [results – Result class definitions - InsertManyResult](http://api.mongodb.com/python/current/api/pymongo/results.html#pymongo.results.InsertManyResult)
- [Array Update Operators](https://docs.mongodb.com/manual/reference/operator/update-array/)

### 总结

现在我们已经了解了 MongoDB 的增删改查的操作。无论增删改查，都有两种模式，操作单一文档的方法后缀都是 `one`:

- insert_one
- delete_one
- update_one
- find_one

而操作多个文件基本都是加后缀 `many`，只有 `find` 是特殊的，什么都不加：

- insert_many
- delete_many
- update_many
- find

对于更新或者删除之后的数据，有时我们需要拿到更新后或者删除前的文档返回给客户端，有两个方法很实用：

- find_one_and_update
- find_one_and_delete

但是注意，`find_one_and_update` 默认返回更新前的文档，设定 `return_document=ReturnDocument.AFTER` 可以变更默认行为，让它返回修改后的文档。

对于查询来说，我们还了解了 `project` 的概念，以此来声明我们需要哪些字段。

对于 `project` 要注意两点：

- `_id` 是默认会取出的，除非在 `project` 中显示地声明不包含关系（设为 `0`）
- `_id` 以外的字段，在 `project` 中不可以同时声明包含关系（设为 `1`）和不包含关系（设为 `0`），否则将会报错

除此之外，我们还看了看 MongoDB 中的比较操作符，快速扫一眼：

- `$eq` equal to
- `$gt` greater than
- `$gte` greater than or equal to
- `$lt` less than
- `$lte` less than or equal to
- `$ne` not equal to
- `$in` match in an array
- `$nin` not match in an array

然后，还有更新操作符：

- `$set` 设置更新字段内容
- `$inc` 设置更新字段增量
- `$push` 添加一个对象到内嵌数组

感觉如何？是不是很简单？

但是等等！如果你熟悉 SQL 的话可能会想，除了这些基础的功能，在 SQL 中实用的 `GROUP BY`、`MAX`、`SUM` 甚至 `PARTITION BY` 等分析函数在 MongoDB 中没有对应的实现吗？

答案当然是有的！并且我们需要的大部分分析函数在 MongoDB 中都有相应的实现。MongoDB 使用 `aggregate` 来满足各种数据分析的需求，如果有机会在之后的文章中我们再来讨论一下聚合的用法吧。

切实需要的东西才能在我们的记忆中保留一席之地，过多实际用不到的，或者近期用不到的信息，只会让记忆系统趋于混沌。目前我们已经了解了足够的知识来使 MongoDB 为我们所用了。等到需求或者求知欲继续延伸，就是进一步学习的最好时机。
