# ua-is-frozen
A freeze-test for your user-agent string

```sh
npm i ua-is-frozen
```

### * `isFrozenUA(ua:string):boolean`

Check whether a user-agent string match with [frozen user-agent pattern](https://www.chromium.org/updates/ua-reduction/)

## Code Example

```js
import { isFrozenUA } from 'ua-is-frozen';

const oldChrome = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.1234.56 Safari/537.36"
const newChrome = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.0.0 Mobile Safari/537.36";
const firefox = "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0";

console.log(isFrozenUA(oldChrome)); // false
console.log(isFrozenUA(newChrome)); // true
console.log(isFrozenUA(firefox));   // false
```