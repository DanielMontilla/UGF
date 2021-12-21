export default class Vec2 {
   constructor(
      public x: number,
      public y: number
   ) {}

   public add(v: Vec2) {
      this.x = v.x;
      this.y = v.y;
   }
}