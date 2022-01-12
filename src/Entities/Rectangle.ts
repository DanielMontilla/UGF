import Surface from "../Core/Surface";
import { rgb } from "../Types/UFG";
import Entity from "./Entity";

export default class Rectangle extends Entity {
   constructor(
      surface: Surface,
      x: number = 0,
      y: number = 0,
      width: number = 2 ** 4,
      height: number = 2 ** 4,
      public color: rgb = [ 0, 0, 0 ]
   ) {
      super(surface, x, y, width, height);

      surface.addEntity(this);
   }
}