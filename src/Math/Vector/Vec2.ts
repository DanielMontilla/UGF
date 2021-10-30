import Vector from "./Vector";

export default class Vec2 extends Vector {

   constructor(x: number = 0, y: number = 0) {
      super(2);
      this[0] = x;
      this[1] = y;
      Object.setPrototypeOf(this, Object.create(Vec2.prototype)); // what the fuck
   }

   set (x: number, y: number) {
      this[0] = x;
      this[1] = y;
   }

   add(x: number, y: number) {
      this[0] += x;
      this[1] += y;
   }
   
   scale(n: number) {
      this[0] *= n;
      this[1] *= n;
   }

   scaleComponent(n: number, component: 'x' | 'y') { 
      this[component] *= n;
   }

   flip() {
      this.scale(-1);
   }

   flipComponent(n: number, component: 'x' | 'y') {
      this.scaleComponent(-1, component);
   }

   get x () {
      return this[0];
   }

   get y () {
      return this[1];
   }

   set x (n: number) {
      this[0] = n;
   }

   set y (n: number) {
      this[1] = n;
   }

   // 🔧 FACTORY METHODS 🏭
   public static FromArr(arr: [x: number, y: number]) {
      return new Vec2(arr[0], arr[1]);
   }

   public static All(n: number) {
      return new Vec2(n, n);
   }

   public static Zero() {
      return new Vec2()
   }

}