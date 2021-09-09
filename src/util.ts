export const emptyFunc = () => {};

export const isPowerOf2 = (num: number) => {
   return (num & (num - 1)) == 0;
};

export const rand = (min: number, max: number) => {
   let range = max - min;
   return Math.random() * range + min;
}