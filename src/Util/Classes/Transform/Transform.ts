import Point from "./Point";
import Size from "./Size";

/**
 * TODO:
 *    * add all purpose methods to manipulate members (e.g. move(), scale(), moveTo(), etc )
 *    * Add scale member that properly scales position member during rendering phase
 */
export default class Transform {
   constructor(
      private _position: Point = new Point(),
      private _size: Size = new Size(),
      private _anchor: Point = new Point()
   ) {}

   get position(): Point { return this._position }
   get size(): Size { return this._size }
   get anchor(): Point { return this._anchor }
}