import { EntityPrimitive } from "../Types/UFG";
import { VertexDescriptor } from "../Types/webgl";

/**
 * Bridge for entity layer to comunicate with their corresponding rendering pipeline. 
 * Every `PrimitiveEntity` has a 1-to-1 relationship with its manager & pipeline
 * 
 * @template AttributeT string literal of active attributes in vertex
 */
export default class EntityManager<
   EntityT extends EntityPrimitive,
   AttributeT extends string
> {
   /** pure  array containing vertex data for corresponding pipeline to use */
   private _vertexArray: number[] = [];

   /** keeps track of next available position in vertexArray */
   private _next: number = 0;

   /** keeps track of current amound of entities in vertexArray */
   private _count: number = 0;

   constructor(
      /** readonly vertexDescriptor object used by renderer boot phase & smart memory access w/vao */
      private readonly layout: VertexDescriptor<AttributeT>
   ) {}

   /**
    * Only way to add entities into surface!
    * @param e Entity to be added to surface
    * @param autoPublish should the entity be autoPublished (active)
    */
   public add(e: EntityT, autoPublish: boolean = true) {
      
   }

   public getOffset (attributeKey: AttributeT) {
      return this.layout.attributes[attributeKey].offset;
   }

   public getAttributes () {
      let res: AttributeT[] = [];

      for (const attribute in this.layout.attributes) {
         res.push(attribute);
      }

      return res as readonly AttributeT[];
   }
}