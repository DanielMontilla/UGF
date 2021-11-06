import Surface from "../Core/Surface";
import Transform from "../Util/Classes/Transform/Transform";
import Size from "../Util/Classes/Transform/Size";
import Point from "../Util/Classes/Math/Vector/Point";
import Position from "../Util/Classes/Transform/Position";

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
         new Position(x, y),
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
   }

   get position(): Position { return this.transform.position }
   get size(): Size { return this.transform.size }

   get x(): number { return this.transform.position.x }
   get y(): number { return this.transform.position.y }
   get width(): number { return this.transform.size.width }
   get height(): number { return this.transform.size.height }
   set x(n: number) { this.transform.position.x = n }
   set y(n: number) { this.transform.position.y = n }
   set width(n: number) { this.transform.size.width = n }
   set height(n: number) { this.transform.size.height = n }

}