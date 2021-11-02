import Vec2 from "../Util/Classes/Math/Vector/Vec2";
import Surface from "../Core/Surface";
import Size from "../Util/Classes/Size";

export default abstract class Entity {
   
   public readonly surface: Surface;
   
   public position: Vec2;
   public size: Size;
   public layer: number;
   
   public anchor: Vec2 = Vec2.Zero();

   constructor(
      surface: Surface,
      x: number,
      y: number,
      width: number,
      height: number
   ) {
      this.surface   = surface;
      this.position  = new Vec2(x, y);
      this.size      = new Size(width, height);
      this.layer     = 0;
   }

   setLayer(n: number) {
      this.layer = n;
      return this;
   }

   scale(n: number) {
      this.size.scale(n);
      return this;
   }

   flip(component: 'x' | 'y') {
      this.size.flipComponent(-1, component);
   }

   get x(): number { return this.position.x; }
   
   get y(): number { return this.position.y; }

   get width(): number { return this.size.width; }

   get height(): number { return this.size.height; }

   set x(n: number) { this.position.x = n; }
   
   set y(n: number) { this.position.y = n; }

   set width(n: number) { this.size.width = n; }

   set height(n: number) { this.size.height = n; }

}