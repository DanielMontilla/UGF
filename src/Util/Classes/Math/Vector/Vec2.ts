export default class Vec2 {
   constructor(
      public x: number = 0,
      public y: number = 0
   ) {}

   
   add(x: number, y: number) {
      this.x += x;
      this.y += y;
      return this;
   }
   
   set(x: number, y: number) {
      this.x = x;
      this.y = y;
      return this;
   }

   scale(n: number) {
      this.x *= n;
      this.y *= n;
      return this;
   }

   // ! maybe doesnt work :(
   scaleComponent(n: number, component: keyof Vec2) {
      if (component == 'x') this.x *= n;
      if (component == 'y') this.x *= n;
      return this;
   }

   get arr() { return [ this.x, this.y ] };
}