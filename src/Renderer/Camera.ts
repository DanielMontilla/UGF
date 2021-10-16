import Vec2 from "../Math/Vec2";
import Surface from "../Surface";

export default class Camera {
   constructor(
      public readonly surface: Surface,
      public position: Vec2 = Vec2.all(0),
      public zoom: number = 0,
   ) { }

   get x() {
      return this.position.x;
   }

   get y() {
      return this.position.y;
   }

   public move(x: number, y: number) {
      this.position.add([x, y]);
   }
}