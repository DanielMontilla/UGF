import Mat4 from "../Math/Matrix/Mat4";
import Vec2 from "../Math/Vector/Vec2";

enum indexes {
   x  = 12,
   y  = 13,
   sx = 0,
   sy = 5,
}

/**
 * @description basically a glorified Mat4 wrapper for translation * scale matrix 
 * @note there is some fuckery going in in this class. Maybe my shaders are set up wrong but the 'standar' way to set up a camera tranformation does not work
 */
export default class Camera {
   
   private _mat: Mat4;
   private _pivot: Vec2;

   constructor(
      x: number = 0,
      y: number = 0,
      ox: number = 0,
      oy: number = 0,
      zoom: number = 1
   ) {
      this._mat = Mat4.Identity();
      this._pivot = new Vec2(ox, oy);
      
      this._mat[indexes.x] = x;
      this._mat[indexes.y] = y;
      this._mat[indexes.sx] = zoom;
      this._mat[indexes.sy] = zoom;
   }

   public move(x: number, y: number) {
      this._mat[indexes.x] += x // * this._mat[indexes.sx];
      this._mat[indexes.y] += y // * this._mat[indexes.sy];
      // this._pivot.add(x, y);
      // this.update();
   }

   public scale(n: number) {
      this._mat[indexes.sx] *= n;
      this._mat[indexes.sy] *= n;
      // this._mat[indexes.x] += this._pivot.x * ( 1 - n );
      // this._mat[indexes.y] += this._pivot.y * ( 1 - n );
   }

   public reset(
      x: number = 0,
      y: number = 0,
      zoom: number = 1
   ) {
      this._mat[indexes.x] = x;
      this._mat[indexes.y] = y;
      this._mat[indexes.sx] = zoom;
      this._mat[indexes.sy] = zoom;
   }

   public get zoom() {
      return this._mat[indexes.sx]; 
   }

   public get x() {
      return this._mat[indexes.x];
   }

   public get y() {
      return this._mat[indexes.y];
   }
   
   public get mat(): Mat4 {
      return this._mat;
   }
}