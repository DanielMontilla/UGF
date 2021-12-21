export const isPowerOf2 = (num: number) => {
   return (num & (num - 1)) == 0;
};

export const rand = (min: number, max: number) => Math.random() * (max - min) + min;
export const randInt = (min: number, max: number) => Math.round(rand(min, max));

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
): number =>  (tRange.min) + ( (value - fRange.min) * (tRange.max - tRange.min) / (fRange.max - fRange.min) );

export const inRange = (
   value: number,
   min: number,
   max: number,
   exclusive?: boolean
) => {
   if (exclusive) {
      return value < max && value > min;
   } else {
      return value <= max && value >= min;
   }
}

export const rangeOverlaps = (
   r1: { min: number, max: number },
   r2: { min: number, max: number }
) => (r1.min <= r2.max && r1.max >= r2.min);