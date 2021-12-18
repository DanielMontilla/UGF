import Surface from "../Core/Surface";
import RGB from "../Util/Classes/RGB";
import Entity from "./Entity";

export default class Circle extends Entity {
   public color: RGB;

   constructor(
      surface: Surface,
      x: number = 0,
      y: number = 0,
      radius: number = 1,
      color: rgb = [1, 1, 1]
   ) {
      super(surface, x, y, radius, radius);
      this.color = RGB.fromArr(color);

      surface.addEntity(this);
   }
}