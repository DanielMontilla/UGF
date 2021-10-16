export const emptyFunc = () => {};

export const isPowerOf2 = (num: number) => {
   return (num & (num - 1)) == 0;
};

export const rand = (min: number, max: number, round?: boolean) => {
   let range = max - min;
   let value = Math.random() * range + min;
   value = (round) ? Math.round(value) : value;
   return value;
}

/**
 * @description linearly maps value from range to another range
 * @copyright https://rosettacode.org/wiki/Map_range
 * @param value value to be mapped from 'fRange' to 'tRange'
 * @param fRange from range
 * @param tRange to range
 * @returns mapped value
 */
export const mapValue = (
   value: number,
   fRange: { min: number; max: number },
   tRange: { min: number; max: number }
): number =>  (tRange.min) + ( (value - fRange.min)*(tRange.max - tRange.min)/(fRange.max - fRange.min) );


export const loadImage = async (path: string) => {
   let img = new Image();
   img.src = path;
   await img.decode();
   return img;
};