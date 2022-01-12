import EntityManager from "../Entities/EntityManager";
import { createLayout } from "../Util/webgl";

export const MANAGERS = {
   rectangle: new EntityManager(
      createLayout({
         position: `xyz`.split(''),
         offset: `xy`.split(''),
         origin: `xy`.split(''),
         angle: `a`.split(''),
         color: `rgb`.split('')
      })
   ),
   sprite: new EntityManager(
      createLayout({
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