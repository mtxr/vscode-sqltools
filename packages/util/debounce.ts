function debounce(func: Function, wait: number = 100) {
  let timeout: number;
  return function(...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
export default debounce;