import Vec2 from "../Math/Vector/Vec2";

/**
 * TODO:
 *    * Maybe should not extend from vec2...? idk
 */
export default class Size extends Vec2 {
   constructor(
      width: number = 0,
      height: number = 0
   ) { super(width, height) }

   get width() { return this.x }
   get height() { return this.y }
   set width(n: number) { this.x = n }
   set height(n: number) { this.y = n }

   flip(axis: 'x' | 'y') {
      this.scaleComponent(-1, axis);
      return this;
   }
}