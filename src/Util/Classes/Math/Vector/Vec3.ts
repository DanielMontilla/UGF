import Vector from "./Vector";

export default class Vec3 extends Vector {
   constructor(x: number = 0, y: number = 0, z: number = 0) {
      super([x, y, z]);
   }

   set (x: number, y: number, z: number) {
      this[0] = x;
      this[1] = y;
      this[2] = z;
   }

   add(x: number, y: number, z: number) {
      this[0] += x;
      this[1] += y;
      this[2] += z;
   }
   
   scale(n: number) {
      this[0] *= n;
      this[1] *= n;
      this[2] *= n;
   }

   scaleComponent(n: number, component: 'x' | 'y' | 'z') { 
      this[component] *= n;
   }

   flip() {
      this.scale(-1);
   }

   flipComponent(n: number, component: 'x' | 'y') {
      this.scaleComponent(-1, component);
   }

   get x() { return this[0] }

   get y() { return this[1] }

   get z() { return this[2] }

   set x(n: number) { this[0] = n }

   set y(n: number) { this[1] = n }

   set z(n: number) { this[2] = n }

   // 🔧 FACTORY METHODS 🏭
   public static FromArr(arr: [x: number, y: number, z: number]) {
      return new Vec3(arr[0], arr[1], arr[2]);
   }

   public static All(n: number) {
      return new Vec3(n, n, n);
   }

   public static Zero() {
      return new Vec3()
   }
}