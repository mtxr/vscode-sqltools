import { each, isArray, isString } from 'lodash-es';

const regexTags = /[MLHVQTCSAZ]([^MLHVQTCSAZ]*)/gi;
const regexDot = /[^\s\,]+/gi;

function parsePath(p: string): string[] {
  let path = p || ([] as string | string[]);
  if (isArray(path)) {
    return path;
  }

  if (isString(path)) {
    path = path.match(regexTags);
    each(path, (item, index) => {
      // @ts-ignore
      item = item.match(regexDot);
      if (item[0].length > 1) {
        const tag = item[0].charAt(0);
        // @ts-ignore
        item.splice(1, 0, item[0].substr(1));
        // @ts-ignore
        item[0] = tag;
      }
      // @ts-ignore
      each(item, function (sub, i) {
        // @ts-ignore
        if (!isNaN(sub)) {
          // @ts-ignore
          item[i] = +sub;
        }
      });
      // @ts-ignore
      path[index] = item;
    });
    return path;
  }
}

export default parsePath;
