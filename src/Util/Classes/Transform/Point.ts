import Vec2 from "../Math/Vector/Vec2";

export default class Point implements Vec2 {
   constructor(
      public x: number = 0,
      public y: number = 0
   ) {}

   public getCenter(): [x: number, y: number] {
      return [this.x/2, this.y/2];
   }

   public getValues(): [x: number, y: number] {
      return [this.x, this.y];
   }
}