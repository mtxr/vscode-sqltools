# G-Base

> 可视化的绘图引擎的接口定义和抽象实现

## 安装下载

> tnpm i --save @antv/g-base

```js
import { Base } from '@antv/g-base';

class MyClass extends Base {}
```

## API 文档

G-Base 中定义了绘图引擎的接口、抽象类和工具方法

### 接口定义

#### IBase

事件接口定义

```ts
  /**
   * 绑定事件
   * @param {string}   eventName 事件名
   * @param {Function} callback  回调函数
   */
  on(eventName: string, callback: Function);
  /**
   * 移除事件
   */
  off();
  /**
   * 移除事件
   * @param {string} eventName 事件名
   */
  off(eventName: string);
  /**
   * 移除事件
   * @param {string}   eventName 事件名
   * @param {Function} callback  回调函数
   */
  off(eventName: string, callback: Function);
  /**
   * 触发事件, trigger 的别名函数
   * @param {string} eventName 事件名称
   * @param {object} args 参数
   */
  emit(eventName: string, eventObject: object);
  /**
   * 触发事件
   * @param {string} eventName 事件名称
   * @param {object} args 参数
   */
  emit(eventName: string, eventObject: object);
```

属性接口定义

```ts
/**
   * 获取属性值
   * @param  {string} name 属性名
   * @return {any} 属性值
   */
  get(name: string): any;
  /**
   * 设置属性值
   * @param {string} name  属性名称
   * @param {any}    value 属性值
   */
  set(name: string, value: any);

  /**
   * 是否销毁
   * @type {boolean}
   */
  destroyed: boolean;

  /**
   * 销毁对象
   */
  destroy();
```

#### IElement

#### IGroup

#### IShape

#### ICanvas

### 抽象类定义

#### Base

#### AbstractShape

#### AbstractGroup

#### AbstractCanvas

### 其他公用类

#### GraphEvent

#### EventController
