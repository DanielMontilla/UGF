import EntityManager from "../Entities/EntityManager";
import { VertexDescriptor, AttributeDescriptor, UnitDescriptor } from "../Types/webgl";

// TODO: figure out how to move this elsewhere
const createDescriptor = <A extends string>(config: Record<A, string[]>): VertexDescriptor<A> => {
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
            absoluteOffset: offset * /* FLOAT_SIZE */ 4
         }
         offset++;
         aUnits++;
         aSize += /* FLOAT_SIZE */ 4;
      }

      let attributeObj: AttributeDescriptor<string> = {
         units: aUnits,
         size: aSize,
         offset: vSize,
         elements: elementList,
      }

      attributeList[key as A] = attributeObj;
      vUnits += attributeObj.units;
      vSize += attributeObj.size;
   }

   return {
      units: vUnits,
      size: vSize,
      attributes: attributeList
   };
}

export const RectangleAttributeList = ['position', 'offset', 'origin', 'angle', 'color'] as const;
export type RectangleAttribute = typeof RectangleAttributeList[number];
export const RectangleUniformList = ['u_projection', 'u_camera'] as const;
export type RectangleUniform = typeof RectangleUniformList[number];

export const SpriteAttributeList = ['position', 'offset', 'origin', 'angle', 'textureIndex', 'textureCoord'] as const;
export type SpriteAttribute = typeof SpriteAttributeList[number];
export const SpriteUniformList = ['u_projection', 'u_textures', 'u_camera'] as const;
export type SpriteUniform = typeof SpriteUniformList[number];

export const MANAGERS = {
   rectangle: new EntityManager(
      createDescriptor<RectangleAttribute>({
         position: `xyz`.split(''),
         offset: `xy`.split(''),
         origin: `xy`.split(''),
         angle: `a`.split(''),
         color: `rgb`.split('')
      })
   ),
   sprite: new EntityManager(
      createDescriptor<SpriteAttribute>({
         position: `xyz`.split(''),
         offset: `xy`.split(''),
         origin: `xy`.split(''),
         angle: `a`.split(''),
         textureIndex: `i`.split(''),
         textureCoord: `xy`.split('')
      })
   ),
} as const;

// TODO: determine values at startup
export const MAX_SPRITES        = 2**14;
export const MAX_TEXTURE_UNITS  = 16;
export const MAX_RECTANGLES     = 2**14;
export const MAX_CIRCLES        = 2**14;

export const FLOAT_SIZE         = 4; // # of bytes per float = sizeof(float);
export const INT_SIZE           = 4; // # of bytes per int = sizeof(float);

// FOR QUADS
export const VERTEX_PER_QUAD   = 4;
export const INDICES_PER_QUAD  = 6;

// FOR LINES
export const VERTEX_PER_LINE   = 2;
export const INDICES_PER_LINE  = 2;