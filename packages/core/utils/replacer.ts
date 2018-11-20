export function replacer(source: string, toReplace: object) {
  return Object.keys(toReplace).reduce((destination, replaceParam) => {
    return destination.replace(`:${replaceParam}`, toReplace[replaceParam]);
  }, source);
}

export default replacer;
