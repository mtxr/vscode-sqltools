# color-util

> 为 `antv` 开发的轻量级工具方法库。


## 安装下载

> tnpm i --save @antv/util

```js
// 所有的 api 是都这么引入，名字不同而已
import { gradient } from '@antv/color-util';

const grad = gradient(['red', 'blue']);
const color1 = grad(0.1);
const color2 = grad(0.2);

```


## API 文档

> 目前使用到的、且推荐使用的 API 文档，不在文档内的不建议使用。
* rgb2arr('#ffeedd') 将 rgb 转换成 16 进制的数组
* gradient(colors) ： 'Function' 渐变色计算
	+ colors ： 颜色的数组，例如 ['red', 'blue']
	+ 返回值是一个函数，可以传入百分百，返回函数
 ```js
const grad = gradient(['red', 'blue']);
const color1 = grad(0.1);
const color2 = grad(0.2);
 ```
* toRGB(color) : 将颜色转换成 RGB 的格式

```js
import { toRGB } from '@antv/color-util';
toRGB('red');
toRGB('rgb(240, 240, 233)');
```


