import Surface from "../Core/Surface";
import { EntityPrimitive } from "../Types/UFG";
import EntityManager from "./EntityManager";

export default abstract class Entity {

   public abstract readonly manager: EntityManager<EntityPrimitive, string>;

   public layer: number = 0;

   public constructor(
      public readonly surface: Surface,
      private _x: number,
      private _y: number,
      private _width: number,
      private _height: number,
      private _angle: number = 0,
      private _xAnchor: number = .5,
      private _yAnchor: number = .5,
      private _xOffset: number = 0,
      private _yOffset: number = 0,
      private _xOrigin: number = 0,
      private _yOrigin: number = 0,
   ) { 
      this.updateOffset();
      this.updateOrigin();
   }

   public add() {
      this.manager.add((this as unknown) as EntityPrimitive); // wtf
   };

   set x(x: number) {
      this._x = x;
      this.updateXOrigin();
   }

   set y(y: number) {
      this._y = y;
      this.updateYOrigin();
   }

   set width(width: number) {
      this._width = width;
      this.updateXOffset();
      this.updateXOrigin();
   }

   set height(height: number) {
      this._height = height;
      this.updateYOffset();
      this.updateYOrigin();
   }

   set xAnchor(xAnchor: number) {
      this._xAnchor = xAnchor;
      this.updateXOffset();
      this.updateXOrigin();
   }

   set yAnchor(yAnchor: number) {
      this._yAnchor = yAnchor;
      this.updateYOffset();
      this.updateYOrigin();
   }

   set angle(angle: number) {
      this._angle = angle;
   }
   /** x surface position */
   get x() { return this._x }
   /** y surface position */
   get y() { return this._y }
   /** width of entity */
   get width() { return this._width }
   /** height of entity */
   get height() { return this._height }
   /** entity's angle in radians. rotation is relative to origin point */
   get angle() { return this._angle }
   /** entity's x anchor. Used for other pre-computed properties */
   get xAnchor() { return this._xAnchor }
   /** entity's y anchor. Used for other pre-computed properties */
   get yAnchor() { return this._yAnchor }
   /** precomputed x offset relative to entity's surface position and size */
   get xOffset() { return this._xOffset }
   /** precomputed y offset relative to entity's surface position and size */
   get yOffset() { return this._yOffset }
   /** precomputed x coordinate for entity's origin point in surface */
   get xOrigin() { return this._xOrigin }
   /** precomputed y coordinate for entity's origin point in surface */
   get yOrigin() { return this._yOrigin }

   private updateOffset() {
      this.updateXOffset();
      this.updateYOffset();
   }

   private updateXOffset() {
      this._xOffset = this._width * this._xAnchor;
   }

   private updateYOffset() {
      this._yOffset = this._height * this._yAnchor
   }

   private updateOrigin() {
      this.updateXOrigin();
      this.updateYOrigin();
   }

   private updateXOrigin() {
      this._xOrigin = this._x + this._xOffset;
   }

   private updateYOrigin() {
      this._yOrigin = this._y + this._yOffset;
   }

   public moveXBy(x: number) {
      this.x += x;
   }

   public moveYBy(y: number) {
      this.y += y;
   }

   public moveBy(x: number, y: number) {
      this.moveXBy(x);
      this.moveYBy(y);
   }

   public moveXTo(x: number) {
      this.x = x;
   }

   public moveYTo(y: number) {
      this.y = y;
   }

   public moveTo(x: number, y: number) {
      this.moveXTo(x);
      this.moveYTo(y);
   }

   public rotateBy(angle: number) {
      this.angle += angle;
   }

   public rotateTo(angle: number) {
      this.angle = angle;
   }

   public abstract getVertexData(): number[];
}