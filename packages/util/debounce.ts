function debounce(callback: () => unknown, wait = 100) {
  let timeout: NodeJS.Timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(callback, wait);
  };
}
export default debounce;
