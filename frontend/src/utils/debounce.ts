export const debounce = (func: (...args: any[]) => any, delay = 250) => {
  let timer: NodeJS.Timeout;

  const debounced = (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };

  debounced.force = func;
  debounced.clear = () => {
    clearTimeout(timer);
  };

  return debounced;
};
