import Vec2 from "./Math/Vector/Vec2";

/**
 * Basiaclly just a wrapper for Vec2
 */
export default class Size extends Vec2 {
   constructor(width: number, height: number) {
      super(width, height);
   }

   set width(n: number) {
      this.x = n;
   }

   set height(n: number) {
      this.y = n;
   }
   
   get width() {
      return this.x;
   }

   get height() {
      return this.y
   }
}