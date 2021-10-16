export default class Vec2 {
   constructor(
      public x: number = 0,
      public y: number = 0
   ) { }

   reset = () => {
      this.x = 0;
      this.y = 0;
   }

   add = (v: Vec2 | [ x: number, y: number ] | { x: number, y: number }) => {
      let x, y;

      if (v instanceof Array) {
         x = v[0]; y = v[1]
      } else {
         x = v.x; y = v.y
      };
      
      this.x += x;
      this.y += y;
      return this;
   }

   /* <------------------------------------| FACTORY METHODS |------------------------------------> */
   public static all = (n: number) => {
      return new Vec2(n, n);
   }
}