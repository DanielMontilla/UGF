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
   
   private _mat: number[];

   constructor(
      public readonly xResolution: number,
      public readonly yResolution: number
   ) {
      this._mat = [
         1, 0, 0, 0,
         0, 1, 0, 0,
         0, 0, 1, 0,
         0, 0, 0, 1
      ];
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

   public reset(
      x: number = 0,
      y: number = 0,
      zoom: number = 1
   ) {
      this.moveTo(x, y);
      this.scaleTo(zoom);
   }

   public get x() {
      return this._mat[indexes.x];
   }

   public get y() {
      return this._mat[indexes.y];
   }
   
   public get mat() {
      return this._mat;
   }

   public getMat() {
      return this._mat;
   }
}