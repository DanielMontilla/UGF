import Surface from "../../Surface";
import { createTexture } from "../../webgl-utils";
import { mapValue } from "../../util";

export default class Texture {
   private static nextUnit: number = 0;

   public unit: number;
   public source: HTMLImageElement;
   public glTexture: WebGLTexture;
   public frameData: frame[];

   constructor(surface: Surface, image: HTMLImageElement, frameData?: frame[]) {
      if (Texture.nextUnit >= 16) throw new Error('no more texture units');
      this.unit      = Texture.nextUnit;
      this.source    = image;
      this.glTexture = createTexture(surface.renderer.gl, image, this.unit);
      this.frameData = frameData ? frameData : [[0, 0, 1, 1]];

      Texture.nextUnit++;
   }

   /**
    * @param height sheet height
    * @param width sheet width
    * @param cols number of columns
    * @param rows number of rows
    */
   public static createFrameData = (
      height: number,
      width: number,
      cols: number,
      rows: number,
   ): frame[] => {
      let frameData: frame[] = [];

      let [ spriteHeight, spriteWidth ] = [
         height / rows,
         width / cols
      ];

      let heightRange   = { min: 0, max: height };
      let widthRange    = { min: 0, max: width };
      let normalRange   = { min: 0, max: 1 };

      for (let row = 0; row < rows; row++) {
         for (let col = 0; col < cols; col++) {
            frameData.push([
               mapValue(col * spriteWidth, widthRange, normalRange),                   // x1
               mapValue(row * spriteHeight, heightRange, normalRange),                 // y1
               mapValue(col * spriteWidth + spriteWidth, widthRange, normalRange),     // x2
               mapValue(row * spriteHeight + spriteHeight, heightRange, normalRange)   // y2
            ])
         }
      }

      return frameData;
   };
}