import Surface from "../Core/Surface";
import Transform from "../Util/Classes/Transform/Transform";
import Size from "../Util/Classes/Transform/Size";
import Point from "../Util/Classes/Transform/Point";
import { inRange } from "../Util/math";

export default abstract class Entity {
   
   public readonly surface: Surface;
   
   public transform: Transform;
   public layer: number;

   constructor(
      surface: Surface,
      x: number,
      y: number,
      width: number,
      height: number
   ) {
      this.surface = surface;
      this.transform = new Transform(
         new Point(x, y),
         new Size(width, height),
         new Point(0, 0)
      );
      this.layer = 0;
   }

   setLayer(n: number) {
      this.layer = n;
      return this;
   }

   scale(n: number) {
      this.size.scale(n);
      return this;
   }

   flip(axis: 'x' | 'y') {
      this.size.flip(axis);
      return this;
   }

   setAnchor(x: number, y: number) {
      if (!inRange(x, 0, 1)) {
         console.warn(`Invalid anchorX value, must be withint 0 and 1`);
         return this;
      }

      if (!inRange(y, 0, 1)) {
         console.warn(`Invalid anchorY value, must be withint 0 and 1`);
         return this;
      }

      this.transform.anchor.x = x;
      this.transform.anchor.y = y;

      return this;
   }

   get position(): Point { return this.transform.position }
   get size(): Size { return this.transform.size }
   get anchor(): Point { return this.transform.anchor }

   get x(): number { return this.transform.position.x }
   get y(): number { return this.transform.position.y }
   get width(): number { return this.transform.size.width }
   get height(): number { return this.transform.size.height }

   set x(n: number) { this.position.x = n }
   set y(n: number) { this.position.y = n }
   set width(n: number) { this.size.width = n }
   set height(n: number) { this.size.height = n }
}