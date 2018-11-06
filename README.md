## 安装与配置

Watermelon

安装

`yarn add @nozbe/watermelondb`

安装装饰器插件

`yarn add --dev @babel/plugin-proposal-decorators`

添加ES6装饰器 `.babelrc` 文件:

`{
  "presets": ["module:metro-react-native-babel-preset"],
  "plugins": [
​    ["@babel/plugin-proposal-decorators", { "legacy": true }]
  ]
}`

### Android RN

在`android/setting.gradle`中添加：

```
include ':watermelondb'
project(':watermelondb').projectDir =
    new File(rootProject.projectDir, '../node_modules/@nozbe/watermelondb/native/android')
```

在`android/app/build.gradle`，添加：

```
apply plugin: "com.android.application"
apply plugin: 'kotlin-android'  // ⬅️ This!
// ...
dependencies {
    // ...
    compile project(':watermelondb')  // ⬅️ This!
}
```

在`android/build.gradle`，为项目添加Kotlin支持：

```
buildscript {
    ext.kotlin_version = '1.2.61'
    // ...
    dependencies {
        // ...
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}
```

在`android/app/src/main/java/{YOUR_APP_PACKAGE}/MainApplication.java`，添加：

```
import com.nozbe.watermelondb.WatermelonDBPackage; // ⬅️ This!
// ...
@Override
protected List<ReactPackage> getPackages() {
  return Arrays.<ReactPackage>asList(
    new MainReactPackage(),
    new WatermelonDBPackage() // ⬅️ Here!
  );

```



  ### IOS RN

Link WatermelonDB's native library with the Xcode project:

`react-native link`



## 建立Database

在项目中创建`model/schema.js`:

[Schema帮助文档](https://github.com/Nozbe/WatermelonDB/blob/master/docs/Schema.md)

```js
import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const mySchema = appSchema({
  version: 1,
  tables: [
    // tableSchemas go here...
  ]
})
```

修改index.js：



```js
import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import { mySchema } from './model/schema'
// import Post from './model/Post' // ⬅️ You'll import your Models here

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  dbName: 'myAwesomeApp', // ⬅️ Give your database a name!
  schema: mySchema,
})

// Then, make a Watermelon database from it!
const database = new Database({
  adapter,
  modelClasses: [
    // Post, // ⬅️ You'll add Models to Watermelon here
  ],
})
```

## 创建实体

[Model帮助文档](https://github.com/Nozbe/WatermelonDB/blob/master/docs/Model.md)

```js
import { Model } from '@nozbe/watermelondb'
import { field, relation, children, readonly, date } from '@nozbe/watermelondb/decorators'

class Post extends Model {
  static table = 'posts'
  // 只读字段，在数据create时，无需传值， created_at存入当前时间
  @readonly @date('created_at') createdAt
  // 只读字段，在数据update时，无需传值， updated_at更新为当前时间
  @readonly @date('updated_at') updatedAt
  
  // @field字段
  @field('title')
  title

  @field('subtitle')
  subtitle

  @field('body')
  body
  
  // @relation关联字段 一对一关系 例如Post的作者
  @relation('blogs', 'blog_id')
  blog
  // @children 一对多的关系 指向此模型的记录列表， 例如属于Post的所有评论
  @children('comments')
  comments
}
```

### 高级

#### 动作

定义操作来简化创建和更新记录，[查看更多](https://github.com/Nozbe/WatermelonDB/blob/master/docs/Actions.md)

#### 查询

除了`@children`, 你可以定义或扩展现有的自定义查询，[查看更多](https://github.com/Nozbe/WatermelonDB/blob/master/docs/Query.md)

查询条件对照：

| Query                                                 | JavaScript equivalent                                        |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| `Q.where('is_verified', true)`                        | `is_verified === true` (shortcut syntax)                     |
| `Q.where('is_verified', Q.eq(true))`                  | `is_verified === true`                                       |
| `Q.where('archived_at', Q.notEq(null))`               | `archived_at !== null`                                       |
| `Q.where('likes', Q.gt(0))`                           | `likes > 0`                                                  |
| `Q.where('likes', Q.weakGt(0))`                       | `likes > 0` (slightly different semantics — [see "null behavior"](https://github.com/Nozbe/WatermelonDB/blob/master/docs/Query.md#null-behavior) for details) |
| `Q.where('likes', Q.gte(100))`                        | `likes >= 100`                                               |
| `Q.where('dislikes', Q.lt(100))`                      | `dislikes < 100`                                             |
| `Q.where('dislikes', Q.lte(100))`                     | `dislikes <= 100`                                            |
| `Q.where('likes', Q.between(10, 100))`                | `likes >= 10 && likes <= 100`                                |
| `Q.where('status', Q.oneOf(['published', 'draft']))`  | `status === 'published' || status === 'draft'`               |
| `Q.where('status', Q.notIn(['archived', 'deleted']))` | `status !== 'archived' && status !== 'deleted'`              |

#### 高级字段 

你还可以使用这些修饰符

- `@text` 用户输入的文本中去除空格
- `@json`  复杂的序列化数据
- `@readonly` 设置字段只读
- `@nochange` 在字段第一次被创建后，就不允许更改字段



## 数据操作方法

###  基本增删改查

[增删改查](https://github.com/Nozbe/WatermelonDB/blob/master/docs/CRUD.md)

```js
import { Model,Q } from '@nozbe/watermelondb'
import { field, relation, children, readonly, date } from '@nozbe/watermelondb/decorators'

const database = new Database({
  adapter,
  modelClasses: [
    Post,
    Comments,
    // Post, // ⬅️ You'll add Models to Watermelon here
  ],
})
// 获取实体对象
const postsCollection = database.collections.get('posts')
// 根据id获取某条数据
const somePost = await postsCollection.find('abcdef')
// 查询
const allPosts = await postsCollection.query().fetch()
// 根据条件查询
const starredPosts = await postsCollection.query(Q.where('is_starred', true)).fetch()
// 添加一条数据
const newPost = await postsCollection.create(post => {
  post.title = 'New post'
  post.body = 'Lorem ipsum...'
})
// 更新一条数据 somePost为查询得到的对象
await  somePost.update(post => {
  post.title = 'Updated title'
})

```

### 高级操作

- `Model.observe()` -  通常只在记录与[组件关联](https://github.com/Nozbe/WatermelonDB/blob/master/docs/Components.md)时使用该方法。但是你可以手动观察相应组件外的记录，返回观察的 [RxJS](https://github.com/reactivex/rxjs),将在订阅后立即发送记录，并且每次更新记录。
- `Query.observe()`,`Relation.observe()` —  [Queries](https://github.com/Nozbe/WatermelonDB/blob/master/docs/Query.md) 和[Relations](https://github.com/Nozbe/WatermelonDB/blob/master/docs/Relation.md)
- `Query.observeWithColumns()`  — 用于[排序列表](https://github.com/Nozbe/WatermelonDB/blob/master/docs/Components.md)
- `Collection.findAndObserve(id)`  — `.find(id)`  然后调用 `record.observe()`
- `Model.prepareUpdate()` - `Collection.prepareCreate`, `Database.batch` — used for [batch updates](https://github.com/Nozbe/WatermelonDB/blob/master/docs/Actions.md) (用于批量操作)

