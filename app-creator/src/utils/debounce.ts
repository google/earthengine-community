/**
 * This function debounces an external function with the specified delay time.
 * @param context context of calling object.
 * @param fn function that requires debouncing.
 * @param delay waiting time between consecutive events.
 */
export function debounce<Params extends any[]>(
  context: any,
  fn: (...params: { target: HTMLInputElement }[]) => any,
  delay: number
) {
  let timer: NodeJS.Timeout;
  return function (...args: Params) {
    clearTimeout(timer);
    const target = args[0].target;
    timer = setTimeout(() => {
      fn.apply(context, [{ target }]);
    }, delay);
  };
}
