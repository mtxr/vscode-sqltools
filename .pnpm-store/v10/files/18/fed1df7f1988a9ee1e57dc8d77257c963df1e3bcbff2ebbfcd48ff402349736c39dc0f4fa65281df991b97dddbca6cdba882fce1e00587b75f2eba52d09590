# component

## 使用

```js
import { Legend } from '@antv/component';
const legend = new Legend.Category({
  container: group, // 外层生成的 g 的 group
  items: [{ name: '1' }, { name: '2' }, { name: '3' }],
});
```

## API

所有的组件都继承自抽象类 Component 基类，其构造函数都是统一的：

```js
new Component(cfg);
```

Component 基类下有两个子类

- GroupComponent，基于 G 的 Group 的组件
- HtmlComponent，基于 HTML 的组件

这两个子类是便于扩展自己的组件，一般使用过程中不需要了解

### Component

#### 属性

组件的属性用于在初始化时在构造函数中传入：

```js
const legend = new Legend.Category({
  id: 'a',
  container: group, // 外层生成的 g 的 grou
  items: [],
});
```

也可以在后面进行获取：

```js
legend.get('id'); // a
```

- id `string`: 组件的唯一 id
- container `string|HTMLElement|IGroup` 容器，GroupComponent 中使用 G 的 Group，HtmlComponent 使用 dom
- offsetX `number`: 组件的偏移位置 x，这个属性不是组件的主要定位属性，而是附加的用于对组件的位置进行调整
- offsetY `number`: 组件的偏移位置 y，这个属性不是组件的主要定位属性，而是附加的用于对组件的位置进行调整
- animate `boolean`: 是否执行动画，默认 false
- animateCfg `object`: 动画的[配置项](https://www.yuque.com/antv/ou292n/ksxugb#6hmGP)
- capture `boolean`: 是否响应事件，默认 true

#### 只读属性

只读属性可以通过组件的 get 方法来获取：

```js
legend.get('name');
```

- name: 组件的名称如： tooltip，legend, annotation 等
- type: 组件的具体类型，如 legend 的类型有 'category', 'continuous'

#### 方法

组件的基类 Component 主要实现组件的生命周期和定位相关的函数，所有组件实现了 IBase， [IComponent](#icomponent)， [ILocation](#ilocation) 接口，所有的子组件除了实现 [IList](#ilist), [ISlider](#islider) 接口外没有单独的方法

##### 生命周期的方法

- render(): 绘制组件

```js
const legend = new Legend.Category({
  id: 'a',
  container: group, // 外层生成的 g 的 grou
  items: [],
});
legend.render();
```

- update(cfg): 更新组件，组件的所有非只读属性都可以更新

```js
legend.update({
  title: {
    text: 'my legend',
  },
  x: 100,
  y: 100,
});
```

- clear()：清除组件内容，一般配合 render 使用

```js
// 等同于 legend.update(cfg);
legend.clear();
legend.set('title', { text: 'my legend' });
legend.set('x', 100);
legend.set('y', 100);
legend.render();
```

- destroy(): 销毁组件
- show()： 显示组件
- hide()： 隐藏组件

##### 实现接口 IBase 的方法

- get(name)： 获取属性，所有构造函数中传入的属性和只读属性都可以获取
- set(name, value)：设置属性，注意通过这种方式设置的属性不会马上在组件上体现，需要重新 render
- on(eventName, callback)：监听事件
- off(eventName, [callback])：解除监听事件
- emit(eventName, eventObject)：触发事件

##### 定位的函数，实现了 ILocation 接口

- getOffset(): 返回组件的偏移量
- setOffset(offsetX, offsetY): 设置偏移量
- getLocationType()：定位的方式，定位方式有四种：'point', 'region', 'points', 'circle' 这决定了可以定位的方式
- getLocation(): 不同的定位方式返回值不同：
  - point: 单点的位置 x, y
  - region: 区域定位，起始点 start 和结束点 end
  - points: 多点定位，多个点 points
  - circle：极坐标定位，包括多个属性 radius, center, startAngle 和 endAngle
- setLocation(location): 定位方式的不同，参数值不同，同上面的 getLocation()

##### 其他

- setCapture(capture): 设置组件是否响应事件
- getBBox(): 组件在画布上的包围盒，返回值 `BBox` 的定义：

```js
  /**
   * 包围盒 x
   * @type {number}
   */
  x: number;
  /**
   * 包围盒 y
   * @type {number}
   */
  y: number;
  /**
   * 包围盒宽度
   * @type {number}
   */
  height: number;
  /**
   * 包围盒高度
   * @type {number}
   */
  width: number;
  /**
   * 包围盒最小 x
   * @type {number}
   */
  minX?: number;
  /**
   * 包围盒最大 x
   * @type {number}
   */
  maxX?: number;
  /**
   * 包围盒最小 y
   * @type {number}
   */
  minY?: number;
  /**
   * 包围盒最大 y
   * @type {number}
   */
  maxY?: number;
```

- isList()：是否列表组件，可以执行一系列的列表操作，实现了 IList 接口
- isSlider(): 是否是滑块组件，可以执行滑块的操作，实现了 ISlider 接口

### Legend

Legend 图例主要有两个类：

- Category: 分类图例
- Continuous 连续图例

### Legend.Category

Legend.Category 实现了 IList 接口

#### 属性

- x: 位置 x
- y: 位置 y
- layout: 布局方向，有 horizontal，vertiacl 两种类型
- title : 图例标题

```js
interface LegendTitleCfg {
  /**
   * 标题同图例项的间距
   * @type {number}
   */
  spacing: number;
  /**
   * 文本配置项
   * @type {ShapeAttrs}
   */
  style: ShapeAttrs;
}
```

- items: 图例项，每一项都是一个 ListItem，其定义：

* id: 图例项的 id，用于动画和查找，可以为空，默认使用 name
* name: 图例的文本
* value: 图例的附加文本，一般用于显示次要信息
* marker: 图例的标记，可以是字符串 'circle', 'square', 'triangle' 等 G 的 Marker，也可以是 Marker 的配置项

- itemSpacing `number`：图例项水平方向的间距
- itemWidth `number`：默认为 null, 此时自动计算，如果设置，则所有影响图例项的定位和排布
- itemHeight: 图例的高度，默认为 null，自动在字体高度上 +8px（上下各 4px)
- itemName: 图例项 name 的配置项，其定义：

```js
interface LegendItemNameCfg {
  /**
   * 图例项 name 同后面 value 的间距
   * @type {number}
   */
  spacing: number;
  /**
   * 格式化文本函数
   * @type {formatterCallback}
   */
  formatter?: formatterCallback;
  /**
   * 文本配置项
   * @type {ShapeAttrs}
   */
  style: ShapeAttrs;
}
type formatterCallback = (text: string, item: ListItem, index: number) => any;
```

- itemValue：图例项附加文本的配置项，其定义：

```js
interface LegendItemValueCfg {
  /**
   * 是否右对齐，默认为 false，仅当设置图例项宽度时生效
   * @type {boolean}
   */
  alignRight: boolean;
  /**
   * 格式化文本函数
   * @type {formatterCallback}
   */
  formatter?: formatterCallback;
  /**
   * 图例项附加值的配置
   * @type {ShapeAttrs}
   */
  style: ShapeAttrs;
}
```

- maxWidth: 图例的最大宽度，默认为 null,不进行限制
- maxHeight: 图例的最大高度，默认为 null，不进行限制
- marker: 图例项 marker 的配置项

```js
interface LegendMarkerCfg {
  /**
   * 图例项 marker 同后面 name 的间距
   * @type {number}
   */
  spacing: number;
  /**
   * 图例项 marker 的配置项
   * @type {ShapeAttrs}
   */
  style: ShapeAttrs;
}
```

#### 方法

Legend.Category 实现了 [IList](#ilist) 接口，所有方法都支持

### Legend.Continuous

Legend.Continuous 实现了 ISlider 接口

#### 属性

- x: 位置 x
- y: 位置 y
- layout: 布局方向，有 horizontal，vertiacl 两种类型
- min: 可以滑动选择的最小值
- max: 可以滑动选择的最大值
- value `number[]`: 当前选中值，默认 null,
- colors `string[]`: 连续图例的颜色,
- rail: 滑轨的配置项，图例的滑块的背景，可以滑动的范围

```js
interface ContinueLegendRailCfg {
  /**
   * rail 的类型，color, size
   * @type {string}
   */
  type: string;
  /**
   * 滑轨的宽度
   * @type {number}
   */
  size: number;
  /**
   * 滑轨的默认长度，，当限制了 maxWidth,maxHeight 时，不会使用这个属性会自动计算长度
   * @type {number}
   */
  defaultLength: number;
  /**
   * 滑轨的样式
   * @type {ShapeAttrs}
   */
  style: ShapeAttrs;
}
```

- label: 图例文本的配置项

```js
interface ContinueLegendLabelCfg {
  /**
   * 文本同滑轨的对齐方式，有五种类型
   *  - rail ： 同滑轨对齐，在滑轨的两端
   *  - top, bottom: 图例水平布局时有效
   *  - left, right: 图例垂直布局时有效
   * @type {string}
   */
  align: string;
  /**
   * 文本格式化
   * @type {string}
   */
  formatter?: (text: string | number | null) => string;
  /**
   * 文本同滑轨的距离
   * @type {number}
   */
  spacing: number;
  /**
   * 文本样式
   * @type {ShapeAttrs}
   */
  style: ShapeAttrs;
}
```

- handler：滑块的配置项
- slidable：是否可以滑动
- step：滑动时的最小间距
- maxWidth: 最大宽度
- maxHeight：最大高度

### Axis

Aixs 继承自 GroupComponent，继承了 Component 的所有方法，坐标轴有两种：

- Axis.Line：直线坐标轴
- Axis.Circle：圆形坐标轴

Axis 实现了 IList 接口，两种坐标轴的配置项和方法基本相同

#### 属性

- x：位置 x
- y：位置 y
- ticks：坐标轴刻度配置项，是 IList 接口中的 ListItem
  - id: 每个刻度的编码，用于动画和查找，可以为 null，默认取 name
  - name: 刻度的文本，同 ListItem 保持一致
  - value: 坐标轴刻度的位置值 0-1 ,决定刻度的位置
- line: 轴线的配置项
  - style: 线的配置项
- tickLine: 轴线上的刻度线的配置项，其定义：
  - style: 坐标轴刻度线的配置
  - length: 刻度线长度
  - alignTick：是否跟文本对齐
- label：轴上的刻度文本的配置项
  - style： 坐标轴文本样式
  - offset: 距离坐标轴的距离
  - formatter: 格式化函数,默认为 null, 函数原型：function(text, tick, index) {return text}
  - rotate：旋转角度，如果设置了，建议将 autoRotate 设置成 false
  - autoRotate: 是否自动旋转, 默认 true
  - autoHide: 是否自动隐藏, 默认 false
  - autoEllipsis: 是否自动省略, 默认 false
- title：坐标轴的标题
  - autoRoate: 是否自动旋转，默认 true
  - style：文本的配置信息
  - text: 标题文本内容
- verticalFactor：垂直于坐标轴方向的因子，决定文本、title、tickLine 在坐标轴的哪一侧，默认 1
- verticalLimitLength：垂直方向限制的长度，对文本自适应有很大影响
- overlapOrder：出现文本遮挡、超界时的解决方法的优先级, 默认：['autoRotate', 'autoEllipsis', 'autoHide'],
- tickStates：通过 IList 接口设置状态时的配置项，可以指定任意状态时 label 和 tickLine 的配置项:
  - labelStyle: 文本的配置项
  - tickLineStyle：轴刻度线的配置项

例如：

```js
active: {
  labelStyle: {
    fontWeight: 500,
  },
  tickLineStyle: {
    lineWidth: 2,
  },
},
unactive: {
  labelStyle: {
    fill: Theme.uncheckedColor,
  },
},
```

#### 方法

- 由于 Axis 实现了 [ILocation](#ilocation) 的 region 定位，可以通过 start, end 设置位置
- Axis 实现了 [IList](#ilist) 接口

#### Axis.Line

直线坐标轴没有任何特定的配置项和自己特有的方法

#### Axis.Circle

圆形坐标轴，有自己特有的属性：

- center: 圆心
- radius: 半径
- startAngle: 开始的角度，默认：-Math.PI / 2
- endAngle: 结束角度，默认：(Math.PI \* 3) / 2

### Grid

栅格组件不再作为 Axis 的一部分，而是独立实现，由于栅格组件没有实现任何接口，所以只有自己的配置项，有两种栅格：

- Grid.Line: 直线栅格线
- Grid.Circle：圆形栅格线

#### 属性

- line: 线的配置项
  - style：线的样式
  - type: 栅格线的类型，默认：'line' 在圆形栅格和直线栅格线下都有效，还可以在圆形栅格线下声明 'circle'
- alternateColor `string|string[]`: 栅格线之间的奇偶颜色, 可以是单值，也可以是数组的两个值
- items: 多条栅格线的信息,每一项的包含：
  - points: 栅格线点的集合
- closed: 是否闭合

### Annotation

所有的 Annotation 都继承自 GroupComponent，没有实现特殊的接口，但是都有各自的定位方式:

- Annotation.Line 带有文本的辅助线
- Annotaion.Region 辅助区间
- Annotaion.Arc 辅助圆弧
- Annotaion.Image 辅助图片
- Annotaion.Text 辅助文本

#### Annotation.Line

辅助线的定位方式是 'region'，这反映在其配置属性上

- start: 起始点,
- end: 结束点,
- style: 线的样式
- text: 文本的配置项,
  - position: 文本的位置，有 'center', 'start', 'end'，默认 'centr'
  - autoRotate: 文本是否随着线自动旋转，默认 true,
  - content: 文本内容,
  - offsetX: 文本偏移位置 x,
  - offsetY: 文本偏移位置 y,

#### Annotaion.Region

Annotaion.Region 也是使用 'region' 的定位方式，属性：

- start: 起始点,
- end: 结束点,
- style: 区间的样式

#### Annotation.Arc

Annotaion.Region 使用 'circle' 的定位方式，属性：

- center: 圆心,
- radius: 半径,
- startAngle: 起始角度，默认 -Math.PI / 2,
- endAngle: 结束角度， (Math.PI \* 3) / 2,

#### Annotation.Image

Annotation.Image 使用 'region' 的定位方式：

- start: 起始点,
- end: 结束点,
- src: 图片地址,
- style: 图片的样式， width, height 可以设置在 style 中，但是此时 end 将失效

#### Annotation.Text

Annotation.Text 辅助文本的定位方式是 'point'

- x: 位置 x,
- y: 位置 y,
- content: 内容,
- style: 文本配置项,

### Tooltip

目前仅提供了 Html 版的 Tooltip 类 ,Tooltip.Html

#### 属性

- x: 位置 x,
- y: 位置 y,
- items: 提示信息
  - name: 文本 name
  - value: 文本 value
  - color: 标记的颜色
  - index: 索引
- containerTpl：容器的模板
- title: 标题,
- showTitle: 是否显示标题,
- offset: 距离指定点(x,y)的偏移,
- position: 相对（x,y) 的位置， top, bottom, left, right 四种取值
- xCrosshairTpl: x 方向的 crosshair 的模板，默认：`<div class="${CssConst.CROSSHAIR_X}"></div>`
- yCrosshairTpl: x 方向的 crosshair 的模板，默认：`<div class="${CssConst.CROSSHAIR_Y}"></div>`,
- region：tooltip 的限制区间
- crosshairs: 辅助线的形式,默认 null， 可选 'x', 'y', 'xy'
- crosshairsRegion: crosshair 的限制区域,如果没有，则无法绘制出
- domStyles：各个 html 元素的 css 样式，可以设置以下样式：
  ```js
  'g2-tooltip';
  'g2-tooltip-title';
  'g2-tooltip-list';
  'g2-tooltip-list-item';
  'g2-tooltip-marker';
  'g2-tooltip-value';
  'g2-tooltip-name';
  'g2-tooltip-crosshair-x';
  'g2-tooltip-crosshair-y';
  ```

#### 方法

由于 Tooltip.Html 继承自 HtmlComponent 可以使用 Component 的所有方法，定位方式是 'point'，所以可以使用

- setLocation({x, y}) 设置位置
- getLocation() 获取位置

### Crosshair

Crosshair (十字线)是配合 tooltip 一起使用的，由于不同坐标系下的 Crosshair 不一致，所以独立出来实现，有两个类：

- Crosshair.Line 直线类型的十字线
- Crosshair.Circle 圆形十字线
- Crosshair.Html 使用 Html 的十字线

前两种是 Canvas 的 Group，两种十字线共同的属性有：

- line: 线的配置信息,
  - style: 线的样式，参考: [图形属性](https://g.antv.vision/zh/docs/api/shape/line)
- text: 文本的配置信息,
  - position: 位置，可以指定 'start', 'end'， 默认值 'start'
  - offset: 指定 position 后的偏移量
  - autoRotate: 是否沿着线方向自动旋转，默认 false;
  - content: 显示的文本
  - style: 文本的样式, 参考 [文本属性](https://g.antv.vision/zh/docs/api/shape/text)
- textBackground: 文本背景的配置信息,
  - padding: 文本的 padding，可以数值，也可以数组
  - style：文本背景的配置项, 参考[图形属性](https://g.antv.vision/zh/docs/api/shape/rect)

#### Crosshair.Line

Crosshair.Line 的定位方式是 region，属性有：

- start: 起始点,
- end: 结束点

#### Crosshair.Circle

Crosshair.Circle 的定位方式是 circle，属性有：

- center: 圆心,
- radius: 半径,
- startAngle: 起始角度，默认 -Math.PI / 2,
- endAngle: 结束角度， (Math.PI \* 3) / 2,

#### Crosshair.Html

Crosshair.Html 的定位方式是 region, 属性有：

- start：开始位置
- end：结束位置
- text: 文本的配置项：
  - position: 位置，有 start, end
  - align: 文本与线的对齐方式，有 left, right 和 center
  - content: 文本内容
- containerTpl: 容器的模板
- crosshairTpl: 十字线的模板
- textTpl: 文本的模板，默认值为 `<span class="g2-crosshair-text">{content}</span>`
- domStyles: Html 各种元素的样式，支持以下样式
  ```js
  'g2-crosshair',
  'g2-crosshair-line',
  'g2-crosshair-text',
  ```

### 接口定义

Componet 实现了几个接口，用于统一的交互:

- IComponent：组件统一实现的接口
- ILocation：定位的接口
- IList：列表接口
- ISlider: 滑块接口

#### IComponet

```js
interface IComponent extends IBase {
  /**
   * 是否是列表
   */
  isList(): boolean;
  /**
   * 是否是 slider
   */
  isSlider(): boolean;
  /**
   * 渲染组件
   */
  render();
  /**
   * 更新组件
   * @param {object} cfg 更新的配置项
   */
  update(cfg: object);
  /**
   * 清空组件
   */
  clear();
  /**
   * 组件在画布上的包围盒
   * @return {BBox} 包围盒
   */
  getBBox(): BBox;
  /**
   * 是否可以响应事件
   * @param capture 是否可以响应事件
   */
  setCapture(capture: boolean): void;
  /**
   * 显示
   */
  show();
  /**
   * 隐藏
   */
  hide();
}
```

#### ILocation

```js
interface ILocation<T extends LocationCfg = LocationCfg> {
  /**
   * 获取定位方式，point，points，region，circle，'none' 五种值
   * @return {LocationType} 定位方式
   */
  getLocationType(): LocationType;
  /**
   * 获取定位信息
   * @return {T} 定位信息
   */
  getLocation(): T;
  /**
   * 设置定位信息
   * @param {T} cfg 定位信息
   */
  setLocation(cfg: T);
  /**
   * 设置偏移量
   * @param {number} offsetX 偏移 x
   * @param {number} offsetY 偏移 y
   */
  setOffset(offsetX: number, offsetY: number);
  /**
   * 获取偏移信息
   * @return {OffsetPoint} 偏移信息
   */
  getOffset(): OffsetPoint;
}
```

不同的 LocationCfg 属性不同，有四种位置定义：

```js
interface LocationCfg {
  [key: string]: any;
}

interface PointLocationCfg extends LocationCfg {
  /**
   * 位置 x
   * @type {number}
   */
  x?: number;
  /**
   * 位置 y
   * @type {number}
   */
  y?: number;
}

interface RegionLocationCfg extends LocationCfg {
  /**
   * 起始点
   * @type {Point}
   */
  start?: Point;
  /**
   * 结束点
   * @type {Point}
   */
  end?: Point;
}

interface PointsLocationCfg extends LocationCfg {
  /**
   * 定位点的集合
   * @type {Point[]}
   */
  points?: Point[];
}

interface CircleLocationCfg extends LocationCfg {
  /**
   * 圆心
   * @type {Point}
   */
  center?: Point;
  /**
   * 半径
   * @type {number}
   */
  radius?: number;
  /**
   * 起始角度
   * @type {number}
   */
  startAngle?: number;
  /**
   * 结束角度
   * @type {number}
   */
  endAngle?: number;
}
```

#### IList

IList 接口用于定义分类图例和坐标轴文本的交互接口，可以实现图例项（坐标轴文本）的高亮、选中等操作

```js
interface IList {
  /**
   * 获取列表项
   * @return {ListItem[]} 列表项集合
   */
  getItems(): ListItem[];
  /**
   * 设置列表项
   * @param {ListItem[]} items 列表项集合
   */
  setItems(items: ListItem[]);
  /**
   * 更新列表项
   * @param {ListItem} item 列表项
   * @param {object}   cfg  列表项
   */
  updateItem(item: ListItem, cfg: object);
  /**
   * 清空列表
   */
  clearItems();
  /**
   * 设置列表项的状态
   * @param {ListItem} item  列表项
   * @param {string}   state 状态名
   * @param {boolean}  value 状态值, true, false
   */
  setItemState(item: ListItem, state: string, value: boolean);
  /**
   * 根据状态获取
   * @param  {state}     state 状态名
   * @return {ListItem[]} 列表项
   */
  getItemsByState(state): ListItem[];
  /**
   * 是否存在指定的状态
   * @param {ListItem} item  列表项
   * @param {string} state 状态名
   */
  hasState(item: ListItem, state: string): boolean;
  /**
   * 清楚所有列表项的状态
   * @param {string} state 状态值
   */
  clearItemsState(state: string);
}
```

#### ISlider

ISlider 滑块接口，用于连续图例、时间轴等组件的滑动操作

```js
interface ISlider {
  /**
   * 设置可滑动范围
   * @param {number} min 最小值
   * @param {number} max 最大值
   */
  setRange(min: number, max: number);
  /**
   * 获取滑动的范围
   * @return {Range} 滑动范围
   */
  getRange(): Range;
  /**
   * 设置当前值，单值或者两个值
   * @param {number | number[]} value 值
   */
  setValue(value: number | number[]);
  /**
   * 获取当前值
   * @return {number|number[]} 当前值
   */
  getValue(): number | number[];
}
```
