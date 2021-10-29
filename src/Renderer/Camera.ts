import Mat4 from "../Math/Mat4";

enum indexes {
   x  = 12,
   y  = 13,
   z  = 14,
   sx = 0,
   sy = 5,
   sz = 10,
}

/**
 * @description basically a glorified Mat4 wrapper for translation * scale matrix 
 */
export default class Camera {
   
   private _mat: Mat4 = Mat4.Identity();

   constructor(
      x: number = 0,
      y: number = 0,
      zoom: number = 1
   ) {

      this._mat[indexes.x]  = x;
      this._mat[indexes.y]  = y;
      this._mat[indexes.z]  = 0;
      this._mat[indexes.sx] = zoom;
      this._mat[indexes.sy] = zoom;
      this._mat[indexes.sz] = 1;
   }

   public move(x: number, y: number) {
      this._mat[indexes.x] += x;
      this._mat[indexes.y] += y;
   }

   public scale(scale: number) {
      this._mat[indexes.sx] *= scale
      this._mat[indexes.sy] *= scale
   }

   public set zoom(n: number) {
      this._mat[indexes.sx] = n;
      this._mat[indexes.sy] = n;
   }

   public reset() {
      this._mat[indexes.x]  = 0;
      this._mat[indexes.y]  = 0;
      this._mat[indexes.z]  = 0;
      this._mat[indexes.sx] = 1;
      this._mat[indexes.sy] = 1;
      this._mat[indexes.sz] = 1;
   }

   public get zoom() {
      return this._mat[indexes.sx]; 
   }

   public get mat(): Mat4 {
      return this._mat;
   }
}