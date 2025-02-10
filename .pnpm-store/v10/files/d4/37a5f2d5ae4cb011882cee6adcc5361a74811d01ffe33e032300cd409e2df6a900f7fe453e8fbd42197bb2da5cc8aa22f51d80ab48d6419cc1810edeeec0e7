# DolphinDB JavaScript API

<p align='center'>
    <img src='./ddb.svg' alt='DolphinDB' width='256'>
</p>

<p align='center'>
    <a href='https://www.npmjs.com/package/dolphindb' target='_blank'>
        <img alt='npm version' src='https://img.shields.io/npm/v/dolphindb.svg?style=flat-square&color=brightgreen' />
    </a>
    <a href='https://www.npmjs.com/package/dolphindb' target='_blank'>
        <img alt='npm downloads' src='https://img.shields.io/npm/dt/dolphindb?style=flat-square&color=brightgreen' />
    </a>
</p>

## [English](./README.md) | 中文

## 简介
DolphinDB JavaScript API 是一个 JavaScript 库，封装了操作 DolphinDB 数据库的能力，如：连接数据库、执行脚本、调用函数、上传变量等

https://www.npmjs.com/package/dolphindb

## 特性
- 使用 WebSocket 与 DolphinDB 数据库通信，用二进制格式进行数据交换，支持流数据实时推送
- 支持在浏览器环境和 Node.js 环境中运行
- 使用了 JavaScript 中的 Int32Array 等 TypedArray 处理二进制数据，性能较高
- 单次调用支持最大 2 GB 数据的序列化上传，下载数据量不受限制

## 用法
### 初始化并连接到 DolphinDB

#### 方法一：在浏览器中直接使用构建好的 CDN 版本

保存以下内容到 `example.html` 文件，用浏览器打开即可运行，F12 打开调试控制台可以看到日志

```html
<!doctype html>
<html>
    <head>
        <title>DolphinDB</title>
        <meta charset='utf-8' />
    </head>
    <body>
        <script type="module">
            import { DDB } from 'https://cdn.dolphindb.cn/assets/api.js'
            
            let ddb = new DDB('ws://127.0.0.1:8848')
            
            await ddb.connect()
            
            console.log(
                await ddb.execute('1 + 1')
            )
            
            console.log(
                await ddb.invoke('add', [1, 1])
            )
        </script>
    </body>
</html>
```

#### 方法二：在项目中安装 npm 包并导入

##### 1. 安装

1.1. 在机器上安装最新版的 Node.js 及浏览器。  
- windows: https://nodejs.org/en/download/prebuilt-installer/current
- linux: https://github.com/nodesource/distributions?tab=readme-ov-file#debian-and-ubuntu-based-distributions  

1.2. （可选）使用以下命令创建新项目。如果已有项目，可跳过此步。
```bash
mkdir dolphindb-example
cd dolphindb-example
npm init --yes
```

1.3. 用编辑器打开 package.json 文件，在 `"main": "./index.js"` 下方加入一行 "type": "module", 这样能够启用 ECMAScript modules，在后面代码中可以使用 `import { DDB } from 'dolphindb'` 导入 npm 包。

1.4. 在项目中安装 npm 包。
```bash
npm install dolphindb
```

##### 2. 使用

```ts
// 2.1 在浏览器环境中用下面的方法导入
import { DDB } from 'dolphindb/browser.js'

// 2.1 在 Node.js 环境中用下面的方法导入
// import { DDB } from 'dolphindb'
// 已有的使用 CommonJS 模块的项目的导入方法为 const { DDB } = await import('dolphindb')

// 2.2 使用 WebSocket URL 初始化连接到 DolphinDB 的实例（不建立实际的网络连接）
let ddb = new DDB('ws://127.0.0.1:8848')

// 使用 HTTPS 加密
// let ddb = new DDB('wss://dolphindb.com')

// 2.3 建立到 DolphinDB 的连接（要求 DolphinDB 数据库版本不低于 1.30.16 或 2.00.4）
await ddb.connect()
```

#### 代码补全、函数提示数据
- https://cdn.dolphindb.cn/assets/docs.zh.json  
- https://cdn.dolphindb.cn/assets/docs.en.json


#### DDB 连接选项

```ts
let ddb = new DDB('ws://127.0.0.1:8848', {
    // 是否在建立连接后自动登录，默认 `true`
    autologin: true,
    
    // DolphinDB 登录用户名，默认 `'admin'`
    username: 'admin',
    
    // DolphinDB 登录密码，默认 `'123456'`
    password: '123456',
    
    // 设置 python session flag，默认 `false`
    python: false,
    
    // 设置当前会话执行的 sql 标准, 请使用 SqlStandard 枚举进行传参，默认 `DolphinDB`
    // sql: SqlStandard.MySQL,
    // sql: SqlStandard.Oracle,
    
    // 设置该选项后，该数据库连接只用于流数据，详细用法见后文 `5. 流数据`
    streaming: undefined
})
```


### 调用函数
#### `invoke` 方法
##### `invoke` 方法代码示例
```ts
const result = await ddb.invoke('add', [1, 1])
// TypeScript: const result = await ddb.invoke<number>('add', [1, 1])

console.log(result === 2)  // true
```

上面例子中，上传了两个参数 1 (对应 DolphinDB 中的 int 类型) 到 DolphinDB 数据库，作为 add 函数的参数，并接收函数调用的结果 result

`<number>` 用于 TypeScript 推断返回值的类型

##### `invoke` 方法声明
```ts
/** 调用 dolphindb 函数，传入 js 原生数组作为参数，返回 js 原生对象或值（调用 DdbObj.data() 后的结果）*/
async invoke <TResult = any> (
    /** 函数名 */
    func: string, 
    
    /** `[ ]` 调用参数，可以是 js 原生数组 */
    args?: any[], 
    
    /** 调用选项 */
    options?: {
        /** 紧急 flag。使用 urgent worker 执行，防止被其它作业阻塞 */
        urgent?: boolean
        
        /** 设置结点 alias 时发送到集群中对应的结点执行 (使用 DolphinDB 中的 rpc 方法) */
        node?: string
        
        /** 设置多个结点 alias 时发送到集群中对应的多个结点执行 (使用 DolphinDB 中的 pnodeRun 方法) */
        nodes?: string[]
        
        /** 设置 node 参数且参数数组为空时必传，需指定函数类型，其它情况下不传 */
        func_type?: DdbFunctionType
        
        /** 设置 nodes 参数时选传，其它情况不传 */
        add_node_alias?: boolean
        
        /** 处理本次 rpc 期间的消息 (DdbMessage) */
        listener?: DdbMessageListener
    } = { }
): Promise<TResult>
```

#### `call` 方法
##### `call` 方法代码示例
```ts
import { DdbInt } from 'dolphindb'

const result = await ddb.call('add', [new DdbInt(1), new DdbInt(1)])
// TypeScript: const result = await ddb.call<DdbInt>('add', [new DdbInt(1), new DdbInt(1)])

console.log(result.value === 2)  // true
```

###### 用 DdbObj 对象来表示 DolphinDB 中的数据类型

上面例子中，上传了两个参数 1 (对应 DolphinDB 中的 int 类型) 到 DolphinDB 数据库，作为 add 函数的参数，并接收函数调用的结果 result

`<DdbInt>` 用于 TypeScript 推断返回值的类型

- result 是一个 `DdbInt`，也是 `DdbObj<number>`
- result.form 是 `DdbForm.scalar`
- result.type 是 `DdbType.int`
- result.value 是 JavaScript 中原生的 `number` (int 的取值范围及精度可以用 JavaScript 的 number 准确表示)

建议先了解一下 JavaScript 中的 TypedArray 相关的概念，可以参考:  
https://stackoverflow.com/questions/42416783/where-to-use-arraybuffer-vs-typed-array-in-javascript  
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray  

```ts
/** 可以表示所有 DolphinDB 数据库中的数据类型 */
class DdbObj <T extends DdbValue = DdbValue> {
    /** 是否为小端 (little endian) */
    le: boolean
    
    /** 数据形式 https://www.dolphindb.cn/cn/help/DataTypesandStructures/DataForms/index.html */
    form: DdbForm
    
    /** 数据类型 https://www.dolphindb.cn/cn/help/DataTypesandStructures/DataTypes/index.html */
    type: DdbType
    
    /** 占用 parse 时传入的 buf 的长度 */
    length: number
    
    /** table name / column name */
    name?: string
    
    /**
        最低维、第 1 维
        - vector: rows = n, cols = 1
        - pair:   rows = 2, cols = 1
        - matrix: rows = n, cols = m
        - set:    同 vector
        - dict:   包含 keys, values 向量
        - table:  同 matrix
    */
    rows?: number
    
    /** 第 2 维 */
    cols?: number
    
    /** 实际数据。不同的 DdbForm, DdbType 使用 DdbValue 中不同的类型来表示实际数据 */
    value: T
    
    /** 原始二进制数据，仅在 parse_object 为 false 时通过 parse_message 生成的顶层对象有这个属性 */
    buffer?: Uint8Array
    
    constructor (data: Partial<DdbObj> & { form: DdbForm, type: DdbType, length: number }) {
        Object.assign(this, data)
    }
}

class DdbInt extends DdbObj<number> {
    constructor (value: number) {
        super({
            form: DdbForm.scalar,
            type: DdbType.int,
            length: 4,
            value
        })
    }
}

// ... 还有很多快捷类，如 DdbString, DdbLong, DdbDouble, DdbVectorDouble, DdbVectorAny 等

type DdbValue = 
    null | boolean | number | [number, number] | bigint | string | string[] | 
    Uint8Array | Int16Array | Int32Array | Float32Array | Float64Array | BigInt64Array | Uint8Array[] | 
    DdbObj[] | DdbFunctionDefValue | DdbSymbolExtendedValue
    

enum DdbForm {
    scalar = 0,
    vector = 1,
    pair = 2,
    matrix = 3,
    set = 4,
    dict = 5,
    table = 6,
    chart = 7,
    chunk = 8,
}


enum DdbType {
    void = 0,
    bool = 1,
    char = 2,
    short = 3,
    int = 4,
    long = 5,
    // ...
    timestamp = 12,
    // ...
    double = 16,
    symbol = 17,
    string = 18,
    // ...
}
```

###### 无快捷类的类型

对于没有快捷类的类型，可指定 form 和 type 手动创建 DdbObj 对象

```ts
// 通过 DdbDateTime 快捷类创建
new DdbDateTime(1644573600)

// 等价于手动通过 DdbObj 创建 form = scalar, type = datetime 的对象
const obj = new DdbObj({
    form: DdbForm.scalar,
    type: DdbType.datetime,
    value: 1644573600,
    length: 0
})


// value 在 js 中对应类型及取值可以参考 ddb.eval 返回的结果 (见后文 `eval` 方法声明)
const obj = await ddb.eval('2022.02.11 10:00:00')
console.log(obj.form === DdbForm.scalar)
console.log(obj.type === DdbType.datetime)
console.log(obj.value)

// 再比如创建一个 set
// 参考 ddb.eval
// const obj = await ddb.eval('set([1, 2, 3])')
// console.log(obj.value)
const obj = new DdbObj({
    form: DdbForm.set,
    type: DdbType.int,
    value: Int32Array.of(1, 2, 3),
    length: 0
})

// 使用快捷类较为简单
const obj = new DdbSetInt(
    new Set([1, 2, 3])
)
```

###### scalar 形式的 NULL 对象

scalar 形式的 NULL 对象，其对应 DdbObj 的 value 为 JavaScript 中的 null：

```ts
;(await ddb.eval('double()')).value === null

// 创建 NULL 对象
new DdbInt(null)
new DdbDouble(null)
```

##### `call` 方法声明
```ts
async call <T extends DdbObj> (
    /** 函数名 */
    func: string,
    
    /** 调用参数 (传入的原生 string 和 boolean 会被自动转换为 DdbObj<string> 和 DdbObj<boolean>) */
    args?: (DdbObj | string | boolean)[] = [ ],
    
    /** 调用选项 */
    options?: {
        /** 紧急 flag。使用 urgent worker 执行，防止被其它作业阻塞 */
        urgent?: boolean
        
        /** 设置结点 alias 时发送到集群中对应的结点执行 (使用 DolphinDB 中的 rpc 方法) */
        node?: string
        
        /** 设置多个结点 alias 时发送到集群中对应的多个结点执行 (使用 DolphinDB 中的 pnodeRun 方法) */
        nodes?: string[]
        
        /** 设置 node 参数时必传，需指定函数类型，其它情况下不传 */
        func_type?: DdbFunctionType
        
        /** 设置 nodes 参数时选传，其它情况不传 */
        add_node_alias?: boolean
    } = { }
): Promise<T>
```

### 执行脚本
#### `execute` 方法
##### `execute` 方法代码示例
```ts
const result = await ddb.execute(
    'def foo (a, b) {\n' +
    '    return a + b\n' +
    '}\n' +
    'foo(1l, 1l)\n'
)

// TypeScript:
// const result = await ddb.execute<bigint>(...)

console.log(result.value === 2n)  // true
```

上面例子中，通过字符串上传了一段脚本到 DolphinDB 数据库执行，并接收最后一条语句 `foo(1l, 1l)` 执行结果 result

`<bigint>` 用于 TypeScript 推断返回值的类型

- result 是一个 `bigint`

只要 WebSocket 连接不断开，在后续的会话中 `foo` 这个自定义函数会一直存在，可复用，比如后续通过 `await ddb.invoke<number>('foo', [1, 1])` 调用这个自定义函数

##### `execute` 方法声明
```ts
/** 执行 dolphindb 脚本，返回 js 原生对象或值（调用 DdbObj.data() 后的结果）*/
async execute <TResult = any> (
    /** 执行的脚本 */
    script: string, 
    
    /** 执行选项 */
    options?: {
        /** 紧急 flag，确保提交的脚本使用 urgent worker 处理，防止被其它作业阻塞 */
        urgent?: boolean
        /** listener?: 处理本次 rpc 期间的消息 (DdbMessage) */
        listener?: DdbMessageListener
    }
): Promise<TResult>
```

#### `eval` 方法
##### `eval` 方法代码示例
```ts
const result = await ddb.eval(
    'def foo (a, b) {\n' +
    '    return a + b\n' +
    '}\n' +
    'foo(1l, 1l)\n'
)

// TypeScript:
// import type { DdbLong } from 'dolphindb'
// const result = await ddb.eval<DdbLong>(...)

console.log(result.value === 2n)  // true
```

上面例子中，通过字符串上传了一段脚本到 DolphinDB 数据库执行，并接收最后一条语句 `foo(1l, 1l)` 执行结果 result

`<DdbLong>` 用于 TypeScript 推断返回值的类型

- result 是一个 `DdbLong`，也是 `DdbObj<bigint>`
- result.form 是 `DdbForm.scalar`
- result.type 是 `DdbType.long`
- result.value 是 JavaScript 中原生的 `bigint` (long 的精度不能用 JavaScript 的 number 准确表示，但可以用 bigint 表示)

##### `eval` 方法声明
```ts
/** 执行 dolphindb 脚本，返回 DdbObj 对象）*/
async eval <T extends DdbObj> (
    /** 执行的脚本 */
    script: string,
    
    /** 执行选项 */
    options: {
        /** 紧急 flag，确保提交的脚本使用 urgent worker 处理，防止被其它作业阻塞 */
        urgent?: boolean
    } = { }
): Promise<T>
```

### 上传变量
#### 例子
```ts
import { DdbVectorDouble } from 'dolphindb'

let a = new Array(10000)
a.fill(1.0)

ddb.upload(['bar1', 'bar2'], [new DdbVectorDouble(a), new DdbVectorDouble(a)])
```

上面的例子中，上传了 `bar1`, `bar2` 两个变量，变量值是长度为 10000 的 double 向量

只要 WebSocket 连接不断开，在后续的会话中 `bar1`, `bar2` 这些变量会一直存在，可复用

#### `upload` 方法声明
```ts
async upload (
    /** 上传的变量名 */
    vars: string[],
    
    /** 上传的变量值 */
    args: (DdbObj | string | boolean)[]
): Promise<void>
```


### 其他例子

```ts
import { nulls, DdbInt, timestamp2str, DdbVectorSymbol, DdbTable, DdbVectorDouble } from 'dolphindb'

// 将 DolphinDB 中的 timestamp 格式化为 string
timestamp2str(
    (
        await ddb.call('now', [false])
        // TypeScript: await ddb.call<DdbObj<bigint>>('now', [false])
    ).value
) === '2022.02.23 17:23:13.494'

// 创建 symbol vector
new DdbVectorSymbol(['aaa', 'aaa', 'aaa', 'aaa', 'aaa', 'bbb'])

// 使用 JavaScript 原生数组创建含有 NULL 值的 double vector
new DdbVectorDouble([0.1, null, 0.3])

// 使用 JavaScript TypedArray 更加高效且节约内存的创建 double vector
let av = new Float64Array(3)
av[0] = 0.1
av[1] = nulls.double
av[2] = 0.3
new DdbVectorDouble(av)

// 创建 DdbTable
new DdbTable(
    [
        new DdbVectorDouble([0.1, 0.2, null], 'col0'),
        new DdbVectorSymbol(['a', 'b', 'c'], 'col1')
    ],
    'mytable'
)
```


### 流数据

```ts
// 新建流数据连接配置
let sddb = new DDB('ws://192.168.0.43:8800', {
    autologin: true,
    username: 'admin',
    password: '123456',
    streaming: {
        table: '要订阅的流表名称',
        
        // 流数据处理回调, message 的类型是 StreamingMessage
        handler (message) {
            console.log(message)
        }
    }
})

// 建立连接
await sddb.connect()
```

连接建立后接收到的流数据会作为 message 参数调用 handler, message 的类型是 StreamingMessage, 如下:

```ts
export interface StreamingParams {
    table: string
    action?: string
    
    handler (message: StreamingMessage): any
}

export interface StreamingMessage <TRows = any> extends StreamingParams {
    /** server 发送消息的时间 (nano seconds since epoch)  
        std::chrono::system_clock::now().time_since_epoch() / std::chrono::nanoseconds(1) */
    time: bigint
    
    /** message id */
    id: bigint
    
    /** 订阅主题，即一个订阅的名称。
        它是一个字符串，由订阅表所在节点的别名、流数据表名称和订阅任务名称（如果指定了 actionName）组合而成，使用 `/` 分隔 */
    topic: string
    
    /** 流数据 */
    data: DdbTableData<TRows>
    
    window: {
        /** 建立连接开始 offset = 0, 随着 window 的移动逐渐增加 */
        offset: number
        
        /** 历史数据 */
        data: TRows[]
        
        /** 每次接收到的 obj 组成的数组 */
        objs: DdbObj<DdbVectorObj[]>[]
    }
    
    /** 成功订阅后，后续推送过来的 message 解析错误，则会设置 error 并调用 handler */
    error?: Error
}
```

关闭流数据订阅使用下面两种断开连接的方法
- 关闭浏览器页面自动断开连接
- 调用 `sddb.disconnect()` 手动断开连接


### 开发方法

```shell
# 安装最新版的 nodejs (见上文)

# 安装 pnpm 包管理器
npm install -g pnpm

git clone https://github.com/dolphindb/api-javascript.git

cd api-javascript

# 国内网络推荐配置 registry 
pnpm config set registry https://registry.npmmirror.com

# 安装项目依赖
pnpm install

# 将 .vscode/settings.template.json 复制为 .vscode/settings.json
cp .vscode/settings.template.json .vscode/settings.json

# 参考 package.json 中的 scripts

# 构建
pnpm run build

# 格式化代码并自动修复代码错误
pnpm run fix

# 测试
pnpm run test

# 扫描词条
pnpm run scan
# 手动补全未翻译词条
# 再次运行扫描以更新词典文件 dict.json
pnpm run scan
```
