import Surface from "../Core/Surface";
import Transform from "../Util/Classes/Transform/Transform";
import Size from "../Util/Classes/Transform/Size";
import Point from "../Util/Classes/Transform/Point";

/**
 * @template VertexDataLayout
 */
export default abstract class Entity {
   
   public readonly surface: Surface;

   // TODO: put layer in transform
   public transform: Transform;
   public layer: number;

   /**
    * @description entity's (initial) position within its corresponding vertex array object.
    */
   protected VAO_INDEX: number = 0;

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
         new Point(.5, .5)
      );
      this.layer = 0;
   }

   setSize (width: number, height?: number) {
      this.width = width;
      this.height = height ? height : width;
      return this;
   }

   setLayer(n: number) {
      this.layer = n;
      return this;
   }

   rotate(rad: number) {
      this.transform.rotation = rad;
      return this;
   }

   scale(n: number) {
      this.height *= n;
      this.width *= n;
      return this;
   }

   flip() {
      this.width *= -1;
      this.height *= -1;
      return this;
   }

   flipX() {
      this.width *= -1;
      return this;
   }
   
   rotateBy(rad: number) {
      this.transform.rotation += rad;
      return this;
   }

   setAnchor(x: number, y?: number) {
      this.transform.anchorX = x;
      this.transform.anchorY = y ? y : x;
      return this;
   }

   get x() { return this.transform.x }
   set x(n: number) { this.transform.x = n }

   get y() { return this.transform.y }
   set y(n: number) { this.transform.y = n }

   get width() { return this.transform.width }
   set width(n: number) { this.transform.width = n }

   get height() { return this.transform.height }
   set height(n: number) { this.transform.height = n }

   // ABSTRACT METHODS
   private uploadVertexData() {};
   private modifyVertexData() {};
}