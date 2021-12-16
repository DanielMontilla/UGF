export default class Point {
   constructor(
      public x: number = 0,
      public y: number = 0
   ) {}

   get values(): [x: number, y: number] { return [this.x, this.y] }
}