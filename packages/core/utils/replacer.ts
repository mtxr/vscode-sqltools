export function replacer(source: string, toReplace: object) {
  return Object.keys(toReplace).reduce((destination, replaceParam) => {
    return destination.replace(new RegExp(`:${replaceParam}`, 'g'), toReplace[replaceParam]);
  }, source);
}

export default replacer;
