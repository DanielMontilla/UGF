import Surface from "../Surface";

export default abstract class Entity {
   
   public readonly surface: Surface;

   public layer: number;

   constructor(
      surface: Surface,
   ) {
      this.surface   = surface;
      this.layer     = 0;
   }

   setLayer = (n: number) => {
      this.layer = n;
      return this;
   }

}