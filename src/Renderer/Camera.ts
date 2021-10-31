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
   private offset: Vec2;
   public focus: Vec2;
   public resolution: Vec2;
   public zoomRange: [x: number, y: number] = [0.5, 2];

   constructor(
      fx: number,
      fy: number,
      rx: number,
      ry: number,
      x: number = 0,
      y: number = 0,
      zoom: number = 1
   ) {
      this._mat = Mat4.Identity();
      this.focus = new Vec2(fx, fy);
      this.offset = new Vec2(fx, fy);
      this.resolution = new Vec2(rx, ry);
      
      this.reset();
   }

   public moveTo(x: number, y: number) {
      this._mat[indexes.x] = x;
      this._mat[indexes.y] = y;
      // this.focus.x = -x + this.offset.x;
      // this.focus.y = -y + this.offset.y;
   }

   public moveBy(x: number, y: number) {
      this.moveTo(
         this._mat[indexes.x] + x,
         this._mat[indexes.y] + y
      );
   }
   
   public scaleTo(n: number) {
      this._mat[indexes.sx] = n;
      this._mat[indexes.sy] = n;
   }

   public scale(n: number) {
      let newZoom = new Vec2(
         this._mat[indexes.sx] + n,
         this._mat[indexes.sy] + n
      );

      newZoom.x = (newZoom.x < this.zoomRange[0]) ? this.zoomRange[0] : newZoom.x;
      newZoom.x = (newZoom.x > this.zoomRange[1]) ? this.zoomRange[1] : newZoom.x;
      newZoom.y = (newZoom.y < this.zoomRange[0]) ? this.zoomRange[0] : newZoom.y;
      newZoom.y = (newZoom.y > this.zoomRange[1]) ? this.zoomRange[1] : newZoom.y;

      this._mat[indexes.sx] = newZoom.x;
      this._mat[indexes.sy] = newZoom.y;

      // this._mat[indexes.x] = -newZoom.x * (this.focus.x) + ( this.resolution.x / 2 );
      // this._mat[indexes.y] = -newZoom.y * (this.focus.y) + ( this.resolution.y / 2 );

   }

   public reset(
      x: number = 0,
      y: number = 0,
      zoom: number = 1
   ) {
      this.moveTo(x, y);
      this.scaleTo(zoom);
   }

   public get zoom() {
      return new Vec2(this._mat[indexes.sx], this._mat[indexes.sy]); 
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

   public getMat(): Mat4 {
      return this._mat;
   }
}