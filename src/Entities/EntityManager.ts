import { VertexDescriptor, UnitDescriptor, AttributeDescriptor } from '../Types/webgl';
import Entity from './Entity';

/**
 * Bridge for entity layer to comunicate with their corresponding rendering pipeline.
 * Every `PrimitiveEntity` has a 1-to-1 relationship with its manager & pipeline
 *
 * @template AttributeT string literal of active attributes in vertex
 *
 * NOTE:
 * Originally I had planned for a change in an entity to trigger some kind of direct change in vao.
 * Sadly this proved to be a bit more complicated than I anticipated. Since some values in an entity
 * affect a variable amount of verticies it becomes insanely tediouse to model each change. For this to work
 * many intances of children classes would have to be implemented to account for every edge case. Alternatively
 * entity objects would include a web of methods that monitor each property change which (I believe) would
 * ultimately defeat the purpose of increase performance. Perhaps there is a simpler more elegant solution
 * but atm I can't bother to find it.
 */
export default class EntityManager<EntityT extends Entity, AttributeT extends string> {
   /** map of entities */
   private _entityList: EntityT[] = [];

   /** pure array containing vertex data for corresponding pipeline to use */
   private _vertexArray: number[] = [];

   /** keeps track of current amound of entities in vertexArray */
   private _next: number = 0;

   public readonly attributeSymbols!: readonly AttributeT[];

   constructor(
      /** readonly vertexDescriptor object used by renderer boot phase & smart memory access w/vao */
      public readonly layout: VertexDescriptor<AttributeT>
   ) {}

   /**
    * Only way to add entities into surface!
    * @param entity Entity to be added to surface
    */
   public add(entity: EntityT) {
      let id = this._next;
      this._entityList.push(entity);
      this._vertexArray.push(...new Array<number>().fill(0, 0, this.layout.size));
      this._next++;
      return id;
   }

   public getOffset(attributeKey: AttributeT) {
      return this.layout.attributes[attributeKey].offset;
   }

   public getSize(attributeKey: AttributeT) {
      return this.layout.attributes[attributeKey].size;
   }

   public getUnits(attributeKey: AttributeT) {
      return this.layout.attributes[attributeKey].units;
   }
   get count() {
      return this._next;
   }

   public populateVAO(vao: Float32Array) {
      for (let i = 0; i < this._entityList.length; i++) {
         let data = this._entityList[i].getVertexData();
         let offset = this.layout.size * i;
         vao.set(data, offset);
      }
   }

   public static fromConfig = <E extends Entity, A extends string>(
      config: Record<A, string[]>
   ): EntityManager<E, A> => {
      let vUnits = 0;
      let vSize = 0;
      let offset = 0;

      let attributeList = {} as Record<A, AttributeDescriptor<string>>;

      for (const key in config) {
         let aUnits = 0;
         let aSize = 0;

         let elementKeys: string[] = config[key];
         let elementList = {} as Record<string, UnitDescriptor>;

         for (const elementKey of elementKeys) {
            elementList[elementKey] = {
               relativeOffset: aUnits * /* FLOAT_SIZE */ 4,
               absoluteOffset: offset * /* FLOAT_SIZE */ 4,
            };
            offset++;
            aUnits++;
            aSize += /* FLOAT_SIZE */ 4;
         }

         let attributeObj: AttributeDescriptor<string> = {
            units: aUnits,
            size: aSize,
            offset: vSize,
            elements: elementList,
         };

         attributeList[key as A] = attributeObj;
         vUnits += attributeObj.units;
         vSize += attributeObj.size;
      }

      return new EntityManager<E, A>({
         units: vUnits,
         size: vSize,
         attributes: attributeList,
      });
   };
}
