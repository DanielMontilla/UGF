import Point from "../Math/Vector/Point";
import Position from "./Position";
import Size from "./Size";

/**
 * TODO:
 *    * add all purpose methods to manipulate members (e.g. move(), scale(), moveTo(), etc )
 *    * Add scale member that properly scales position member during rendering phase
 */
export default class Transform {
   constructor(
      public position: Position = new Point(),
      public size: Size = new Size(),
      public anchor: Point = new Point()
   ) {}

}