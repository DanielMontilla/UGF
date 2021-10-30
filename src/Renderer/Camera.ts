import Mat4 from "../Math/Matrix/Mat4";
import Vec2 from "../Math/Vector/Vec2";

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
 * @note there is some fuckery going in in this class. Maybe my shaders are set up wrong but the 'standar' way to set up a camera tranformation does not work
 */
export default class Camera {
   
   private _mat: Mat4;

   private position: Vec2;
   private offset: Vec2;
   private zoom: Vec2;

   constructor(
      x: number = 0,
      y: number = 0,
      offX: number = 0,
      offY: number = 0,
      zoomX: number = 1,
      zoomY: number = 1
   ) {

      this._mat = Mat4.Identity();

      this.position  = new Vec2(x - offX, y - offY);
      this.offset    = new Vec2(offX, offY);
      this.zoom      = new Vec2(zoomX, zoomY);

      this.update();
   }

   public move(x: number, y: number) {
      this.position.add(x, y);
      this.update();
   }

   public scale(n: number) {
      this.zoom.scale(n);
      this.update();
   }
   
   private update() {
      this._mat[indexes.x]  = this.position.x * this.zoom.x + this.offset.x;
      this._mat[indexes.y]  = this.position.y * this.zoom.y + this.offset.y;
      this._mat[indexes.sx] = this.zoom.x;
      this._mat[indexes.sy] = this.zoom.y;
   }

   public reset(
      x: number = 0,
      y: number = 0,
      offX: number = 0,
      offY: number = 0,
      zoomX: number = 1,
      zoomY: number = 1
   ) {
      this.position.set(x, y);
      this.offset.set(offX, offY);
      this.zoom.set(zoomX, zoomY);
      this.update();
   }

   public get zoomFactor() {
      return this._mat[indexes.sx]; 
   }

   public get mat(): Mat4 {
      return this._mat;
   }
}