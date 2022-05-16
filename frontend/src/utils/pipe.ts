export const pipe = <A, B>(fn: (a: A) => B) => ({
  f<C>(g: (x: B) => C) {
    return pipe((arg: A) => g(fn(arg)));
  },
  build: () => fn,
});
