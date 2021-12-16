import { inRange, mapValue } from "../math";
import Vec3 from "./Math/Vector/Vec3";

export default class RGB extends Vec3 {

   constructor(
      r: number,
      g: number,
      b: number
   ) {
      
      if (!inRange(r, 0, 255)) { console.warn(`Invalid r value, must be within 0 to 255`); r = 0 }
      if (!inRange(g, 0, 255)) { console.warn(`Invalid g value, must be within 0 to 255`); g = 0 }
      if (!inRange(b, 0, 255)) { console.warn(`Invalid b value, must be within 0 to 255`); b = 0 }

      super(r, g, b);
   }

   set r(n: number) {
      if (!inRange(n, 0, 255)) {
         console.warn(`Invalid r value, must be within 0 to 255`);
         return;
      }
      this.x = n;
   }

   set g(n: number) {
      if (!inRange(n, 0, 255)) {
         console.warn(`Invalid g value, must be within 0 to 255`);
         return;
      }
      this.y = n;
   }

   set b(n: number) {
      if (!inRange(n, 0, 255)) {
         console.warn(`Invalid b value, must be within 0 to 255`);
         return;
      }
      this.z = n;
   }

   get r() { return this.x }
   get g() { return this.y }
   get b() { return this.z }

   public getNormalized(): [r: number, g: number, b: number] {
      return [
         mapValue(this.r, { min: 0, max: 255 }, { min: 0, max: 1 }),
         mapValue(this.g, { min: 0, max: 255 }, { min: 0, max: 1 }),
         mapValue(this.b, { min: 0, max: 255 }, { min: 0, max: 1 })
      ]
   }

   // Factory methods
   public static fromArr(rgb: [r: number, g: number, b: number]) {
      return new RGB(rgb[0], rgb[1], rgb[2]);
   }

   public static fromNum(r: number, g: number, b: number) {
      return new RGB(r, g, b);
   }
}