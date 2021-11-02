export const emptyFunc = () => {};

export const emptyRecord = <
   P extends string | number | symbol = string,
   Q = string
>(): Record<P, Q> => <Record<P, Q>>{};