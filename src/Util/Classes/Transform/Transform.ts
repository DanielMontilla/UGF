import Point from "./Point";
import Size from "./Size";

/**
 * TODO:
 *    * add all purpose methods to manipulate members (e.g. move(), scale(), moveTo(), etc )
 *    * Add scale member that properly scales position member during rendering phase
 *    * IDK if i should do offset & rotation transformation here or in shader...?
 */
export default class Transform {

   /**
    * @description pre-computed offset used by renderer
    */
   private _offset: Point = new Point();

   /**
    * @description pre-computed origin used by renderer
    */
   private _origin: Point = new Point();

   constructor(
      private _position: Point = new Point(),
      private _size: Size = new Size(),
      private _anchor: Point = new Point(),
      private _rotation: number = 0
   ) {
      this.updateOffset();
      this.updateOrigin();
   }

   get offset() { return this._offset };
   get origin() { return this._origin };

   get position() { return this._position };

   get rotation() { return this._rotation };
   set rotation(n: number) {
      this._rotation = n 
   }
   
   get x() { return this._position.x }
   set x(n: number) {
      this._position.x = n;
      this.updateOriginX();
   }
   
   get y() { return this._position.y }
   set y(n: number) {
      this._position.y = n;
      this.updateOriginY();
   }

   get width() { return this._size.width }
   set width(n: number) {
      this._size.width = n;
      this.updateOffsetX();
      this.updateOriginX();
   }

   get height() { return this._size.height }
   set height(n: number) {
      this._size.height = n;
      this.updateOffsetY();
      this.updateOriginY();
   }

   set anchorX(n: number) {
      this._anchor.x = n;
      this.updateOffsetX();
      this.updateOriginX();
   }

   set anchorY(n: number) {
      this._anchor.y = n;
      this.updateOffsetY();
      this.updateOriginY();
   }

   // HANDELING PRE-COMPUTED VALUES. NOTE: Origin is relative to offset, so offset must be calculated before origin
   private updateOffset() {
      this.updateOffsetX();
      this.updateOffsetY();
   }

   private updateOffsetX() {
      this._offset.x = this._size.width * this._anchor.x;
   }

   private updateOffsetY() {
      this._offset.y = this._size.height * this._anchor.y
   }

   private updateOrigin() {
      this.updateOriginX();
      this.updateOriginY();
   }

   private updateOriginX() {
      this._origin.x = this._position.x + this._offset.x;
   }

   private updateOriginY() {
      this._origin.y = this._position.y + this._offset.y;
   }
   
}