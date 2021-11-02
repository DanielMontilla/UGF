import Vec3 from "./Math/Vector/Vec3";

export default class RGB extends Vec3 {

   constructor(r: number, g: number, b: number) {
      super(r, g, b);
   }

   get r() { return this.x }
   get g() { return this.y }
   get b() { return this.z }
}