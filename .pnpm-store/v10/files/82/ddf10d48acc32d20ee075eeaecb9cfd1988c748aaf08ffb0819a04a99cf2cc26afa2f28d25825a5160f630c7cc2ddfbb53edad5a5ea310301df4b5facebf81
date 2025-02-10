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

## English | [中文](./README.zh.md)

## Overview
The DolphinDB JavaScript API is a JavaScript library that encapsulates interactions with the DolphinDB database, such as connecting to the database, executing scripts, calling functions, uploading variables, etc.

https://www.npmjs.com/package/dolphindb

## Features

- Communicates with the DolphinDB database using WebSocket and exchanges data in binary format, supporting real-time streaming data.
- Supports running in both browser and Node.js environments.
- Uses TypedArray in JavaScript such as Int32Array to handle binary data.
- Supports serialized upload of up to 2 GB of data in a single call, with no limit on the amount of downloaded data.

## Usage

### Connecting to DolphinDB

#### Method 1: Use the built CDN version directly in the browser

Save the following content to an `example.html` file and open it with a browser to run it. Press F12 to open the debug console and check the logs.

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

#### Method 2: Install the npm package and import to the project

##### 1. Installation

1.1. Install the latest version of Node.js and browser on your machine.
- Windows: https://nodejs.org/en/download/prebuilt-installer/current
- Linux: https://github.com/nodesource/distributions?tab=readme-ov-file#debian-and-ubuntu-based-distributions

1.2. (Optional) Create a new project using the following command. Skip this step if you already have a project.

```bash
mkdir dolphindb-example
cd dolphindb-example
npm init --yes
```

1.3. Open the `package.json` file with an editor and add a line `"type": "module"` below `"main": "./index.js"` to enable ECMAScript modules. In the following code, you can use `import { DDB } from 'dolphindb'` to import npm package.

1.4. Install the npm package in the project.

```bash
npm install dolphindb
```

##### 2. Usage

```ts
// 2.1 import in the browser environment
import { DDB } from 'dolphindb/browser.js'

// 2.1 import in the Node.js environment
// import { DDB } from 'dolphindb'
// For existing projects using CommonJS modules, import as follows: const { DDB } = await import('dolphindb')

// 2.2 Initialize the instance to connect to DolphinDB using the WebSocket URL (no actual network connection is established)
let ddb = new DDB('ws://127.0.0.1:8848')

// Use HTTPS encryption
// let ddb = new DDB('wss://dolphindb.com')

// 2.3 Establish a connection to DolphinDB (requires DolphinDB database version no less than 1.30.16 or 2.00.4)
await ddb.connect()
```

#### Code completion and function prompt

See https://cdn.dolphindb.cn/assets/docs.en.json  
or https://cdn.dolphindb.cn/assets/docs.zh.json

#### Connection options

```ts
let ddb = new DDB('ws://127.0.0.1:8848', {
    // Whether to automatically log in after establishing a connection, default is true
    autologin: true,
    
    // DolphinDB login username, default is 'admin'
    username: 'admin',
    
    // DolphinDB login password, default is '123456'
    password: '123456',
    
    // Set python session flag, default is false
    python: false,
    
    // Set the SQL standard to execute in the current session, use the SqlStandard enum, default is DolphinDB
    // sql: SqlStandard.MySQL,
    // sql: SqlStandard.Oracle,
    
    // Set this option for the database connection to be used only for streaming data, see `5. Streaming Data` for details
    streaming: undefined
})
```

### Calling functions
#### `invoke` method
##### Code example

```ts
const result = await ddb.invoke('add', [1, 1])
// TypeScript: const result = await ddb.invoke<number>('add', [1, 1])

console.log(result === 2)  // true
```

In the example above, two parameters 1 (corresponding to the int type in DolphinDB) are uploaded to the DolphinDB database as parameters of the `add` function, and the result of the function call is received in `result`.

`<number>` is used for TypeScript to infer the type of the return value.

##### Method declaration

```ts
/** Call a dolphindb function, passing in a native JS array as parameters, and return a native JS object or value (result after calling DdbObj.data()) */
async invoke <TResult = any> (
    /** Function name */
    func: string, 
    
    /** `[ ]` Call parameters, can be a native JS array */
    args?: any[], 
    
    /** Call options */
    options?: {
        /** Urgent flag. Use urgent worker to execute, preventing being blocked by other jobs */
        urgent?: boolean
        
        /** When setting node alias, send to the corresponding node in the cluster to execute (using DolphinDB's rpc method) */
        node?: string
        
        /** When setting multiple node aliases, send to the corresponding multiple nodes in the cluster to execute (using DolphinDB's pnodeRun method) */
        nodes?: string[]
        
        /** Required when setting the node parameter and the parameter array is empty, specify the function type, not passed in other cases */
        func_type?: DdbFunctionType
        
        /** Optionally passed when setting the nodes parameter, not passed in other cases */
        add_node_alias?: boolean
        
        /** Handle messages (DdbMessage) during this rpc */
        listener?: DdbMessageListener
    } = { }
): Promise<TResult>
```

#### `call` method

##### Code example

```ts
import { DdbInt } from 'dolphindb'

const result = await ddb.call('add', [new DdbInt(1), new DdbInt(1)])
// TypeScript: const result = await ddb.call<DdbInt>('add', [new DdbInt(1), new DdbInt(1)])

console.log(result.value === 2)  // true
```

###### Using DdbObj objects to represent data types in DolphinDB

In the example above, two parameters `new DdbInt(1)`, corresponding to the INT type in DolphinDB, are uploaded to the DolphinDB database as arguments of the `add` function, and the result of the function call is received in `result`.

<DdbInt> is used by TypeScript to infer the type of the return value

- result is a DdbInt, which is also a DdbObj<number>
- result.form is a DdbForm.scalar
- result.type is a DdbType.int
- result.value is data of number type in JavaScript (the value range and precision of INT can be accurately represented by JavaScript number type)

It is recommended to first understand the concepts related to TypedArray in JavaScript, you can refer to:

- https://stackoverflow.com/questions/42416783/where-to-use-arraybuffer-vs-typed-array-in-javascript
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray

```ts
/** Can represent all data types in DolphinDB databases */
class DdbObj <T extends DdbValue = DdbValue> {
    /** is it little endian */
    le: boolean
    
    /** DolphinDB data form */
    form: DdbForm
    
    /** DolphinDB data type */
    type: DdbType
    
    /** consumed length in buf parsed */
    length: number
    
    /** table name / column name */
    name?: string
    
    /**
        Lowest dimension
        - vector: rows = n, cols = 1
        - pair:   rows = 2, cols = 1
        - matrix: rows = n, cols = m
        - set:    the same as vector
        - dict:   include keys, values vector
        - table:  the same as matrix
    */
    rows?: number
    
    /** 2nd dimension */
    cols?: number
    
    /** the actual data. Different DdbForm, DdbType use different types in DdbValue to represent actual data */
    value: T
    
    /** raw binary data, only top-level objects generated by parse_message when parse_object is false have this attribute */
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

// ... There are also many utility classes, such as DdbString, DdbLong, DdbDouble, DdbVectorDouble, DdbVectorAny, etc.

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

##### Specifying form and type to manually create a DdbObj object

If there is no shortcut class, you can also specify form and type to manually create a DdbObj object:

```ts
// Created by the DdbDateTime shortcut class
new DdbDateTime(1644573600)

// Equivalent to manually creating an object of form = scalar, type = datetime through DdbObj
const obj = new DdbObj({
     form: DdbForm.scalar,
     type: DdbType.datetime,
     value: 1644573600,
     length: 0
})


// The corresponding type and value of value in js can refer to the result returned by ddb.eval (see the `eval` method declaration below)
const obj = await ddb.eval('2022.02.11 10:00:00')
console.log(obj.form === DdbForm.scalar)
console.log(obj.type === DdbType.datetime)
console.log(obj.value)

// Another example is to create a set
// refer to ddb.eval
// const obj = await ddb.eval('set([1, 2, 3])')
// console.log(obj.value)
const obj = new DdbObj({
     form: DdbForm.set,
     type: DdbType.int,
     value: Int32Array.of(1, 2, 3),
     length: 0
})

// easier to use shortcut classes
const obj = new DdbSetInt(
     new Set([1, 2, 3])
)
```

##### NULL object in scalar

For the NULL object in the form of scalar, the value corresponding to DdbObj is null in JavaScript：

```ts
;(await ddb.eval('double()')).value === null

// create NULL object
new DdbInt(null)
new DdbDouble(null)
```

##### Method declaration

```ts
async call <T extends DdbObj> (
    /** function name */
    func: string,
    
    /** function arguments (The incoming native string and boolean will be automatically converted to DdbObj<string> and DdbObj<boolean>) */
    args?: (DdbObj | string | boolean)[] = [ ],
    
    /** calling options */
    options?: {
        /** Urgent flag. Use urgent worker to execute to prevent being blocked by other jobs */
        urgent?: boolean
        
        /** When the node alias is set, the function is sent to the corresponding node in the cluster for execution (using the rpc method in DolphinDB) */
        node?: string
        
        /** When setting multiple node aliases, send them to the corresponding multiple nodes in the cluster for execution (using the pnodeRun method in DolphinDB) */
        nodes?: string[]
        
        /** It must be passed when setting the node parameter, the function type needs to be specified, and it is not passed in other cases */
        func_type?: DdbFunctionType
        
        /** It may be  passed when setting the nodes parameter, otherwise may not be passed */
        add_node_alias?: boolean
    } = { }
): Promise<T>
```

### Executing scripts

#### `execute` method
##### Code example

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

In the preceding example, a script is uploaded through a string to the DolphinDB database for execution, and the execution result of the last statement `foo(1l, 1l)` is received.

`<DdbLong>` is used by TypeScript to infer the type of the return value

- result is a `DdbLong`, which is also a `DdbObj<bigint>`
- result.form is `DdbForm.scalar`
- result.type is `DdbType.long`
- result.value is the native `bigint` in JavaScript (the precision of long cannot be accurately represented by JavaScript number, but it can be represented by bigint)

As long as the WebSocket connection is not disconnected, the custom function `foo` will always exist in the subsequent session and can be reused, for example, you can use `await ddb.call<DdbInt>('foo', [new DdbInt(1), new DdbInt(1)])` to call this custom function

##### Method declaration

```ts
/** Execute DolphinDB script and return a native JS object or value (result after calling DdbObj.data()) */
async execute <TResult = any> (
    /** Script to execute */
    script: string, 
    
    /** Execution options */
    options?: {
        /** Urgent flag, ensure the submitted script is processed using an urgent worker to prevent blocking by other jobs */
        urgent?: boolean
        /** listener?: Handle messages (DdbMessage) during this rpc */
        listener?: DdbMessageListener
    }
): Promise<TResult>
```

#### `eval` Method

##### Code example
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

In the example above, a script is uploaded as a string to the DolphinDB database for execution, and the result of the last statement `foo(1l, 1l)` is received in `result`.

`<DdbLong>` is used for TypeScript to infer the return value type.

- result is a `DdbLong`, also `DdbObj<bigint>`
- result.form is `DdbForm.scalar`
- result.type is `DdbType.long`
- result.value is a native `bigint` in JavaScript (the precision of long cannot be accurately represented by JavaScript's number, but can be represented by bigint)

##### Method declaration

```ts
/** Execute DolphinDB script and return a DdbObj object */
async eval <T extends DdbObj> (
    /** Script to execute */
    script: string,
    
    /** Execution options */
    options: {
        /** Urgent flag, ensure the submitted script is processed using an urgent worker to prevent blocking by other jobs */
        urgent?: boolean
    } = { }
): Promise<T>
```

### Upload Variables
#### Code example

```ts
import { DdbVectorDouble } from 'dolphindb'

let a = new Array(10000)
a.fill(1.0)

ddb.upload(['bar1', 'bar2'], [new DdbVectorDouble(a), new DdbVectorDouble(a)])
```

In the example above, two variables `bar1` and `bar2` are uploaded, with values being double vectors of length 10000.

As long as the WebSocket connection is not disconnected, these variables `bar1` and `bar2` will always exist in subsequent sessions and can be reused.

#### Method declaration

```ts
async upload (
    /** Variable names to upload */
    vars: string[],
    
    /** Variable values to upload */
    args: (DdbObj | string | boolean)[]
): Promise<void>
```

### Other Examples

```ts
import { nulls, DdbInt, timestamp2str, DdbVectorSymbol, DdbTable, DdbVectorDouble } from 'dolphindb'

// Format timestamp in DolphinDB to string
timestamp2str(
    (
        await ddb.call('now', [false])
        // TypeScript: await ddb.call<DdbObj<bigint>>('now', [false])
    ).value
) === '2022.02.23 17:23:13.494'

// Create symbol vector
new DdbVectorSymbol(['aaa', 'aaa', 'aaa', 'aaa', 'aaa', 'bbb'])

// Create double vector with NULL values using native JavaScript array
new DdbVectorDouble([0.1, null, 0.3])

// Create double vector more efficiently and memory-saving using JavaScript TypedArray
let av = new Float64Array(3)
av[0] = 0.1
av[1] = nulls.double
av[2] = 0.3
new DdbVectorDouble(av)

// Create DdbTable
new DdbTable(
    [
        new DdbVectorDouble([0.1, 0.2, null], 'col0'),
        new DdbVectorSymbol(['a', 'b', 'c'], 'col1')
    ],
    'mytable'
)
```

### Streaming Data

```ts
// Create new streaming data connection configuration
let sddb = new DDB('ws://192.168.0.43:8800', {
    autologin: true,
    username: 'admin',
    password: '123456',
    streaming: {
        table: 'name of the stream table to subscribe to',
        
        // Stream data processing callback, message type is StreamingMessage
        handler (message) {
            console.log(message)
        }
    }
})

// Establish connection
await sddb.connect()
```

After the connection is established, the received streaming data will be called as the `message` parameter of the `handler`, and the message type is `StreamingMessage`, as follows:

```ts
export interface StreamingParams {
    table: string
    action?: string
    
    handler (message: StreamingMessage): any
}

export interface StreamingMessage <TRows = any> extends StreamingParams {
    /** The time when the server sends the message (nano seconds since epoch)
        std::chrono::system_clock::now().time_since_epoch() / std::chrono::nanoseconds(1) */
    time: bigint
    
    /** Message ID */
    id: bigint
    
    /** Subscription topic, i.e., the name of a subscription.
        It is a string composed of the alias of the node where the subscription table is located, the name of the stream table, and the name of the subscription task (if actionName is specified), separated by `/` */
    topic: string
    
    /** Streaming data */
    data: DdbTableData<TRows>
    
    window: {
        /** Offset from the start of the connection, starting at 0, and increasing as the window moves */
        offset: number
        
        /** Historical data */
        data: TRows[]
        
        /** Array of objects received each time */
        objs: DdbObj<DdbVectorObj[]>[]
    }
    
    /** If there is an error in parsing the message pushed after the successful subscription, the error is set and the handler is called */
    error?: Error
}
```

To close streaming data subscription, use the following two methods to disconnect:
- Automatically disconnect by closing the browser page
- Manually disconnect by calling `sddb.disconnect()`


### Development method

```shell
# Install the latest version of nodejs (see above)

# Install the pnpm package manager
npm install -g pnpm

git clone https://github.com/dolphindb/api-javascript.git

cd api-javascript

# Install project dependencies
pnpm install

# Copy .vscode/settings.template.json to .vscode/settings.json
cp .vscode/settings.template.json .vscode/settings.json

# Refer to scripts in package.json

# Build
pnpm run build

# Format code and automatically fix code errors
pnpm run fix

# Test
pnpm run test

# Scan entries
pnpm run scan
# Manually complete untranslated entries
# Run scan again to update the dictionary file dict.json
pnpm run scan
```
