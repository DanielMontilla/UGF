import { createTexture, loadImage } from "../Util/webgl";
import { mapValue } from "../Util/math";

/**
 * TODO:
 *    - Add mechanisim to avoid texture duplication in case of user error.
 */
export default class Texture {

   private static MAX_TEXTURE_UNITS: number = 16;
   private static gl: WebGLRenderingContext;
   private static nextUnit: number = 0;
   private static paths: string[] = [];

   public unit: number;
   public img: HTMLImageElement;
   public glTexture: WebGLTexture;
   public frameData: frame[];

   public static init = (gl: WebGLRenderingContext) => {
      if (Texture.gl) throw new Error('already initiated texture class');
      Texture.gl = gl;
   }
   
   constructor(img: HTMLImageElement, config?: frameDataConfig) {
      if (Texture.nextUnit > Texture.MAX_TEXTURE_UNITS) throw new Error('no more texture units :(');
      if (!Texture.gl) throw new Error('call Texture.init method first');
      if (Texture.paths.includes(img.src)) console.warn('texture already exists, you\'re duplicating');

      this.img       = img;
      this.unit      = Texture.nextUnit;
      this.glTexture = createTexture(Texture.gl, img, this.unit);
      this.frameData = (config) ? Texture.createFrameData(
         config.height,
         config.width,
         config.cols,
         config.rows
      ) : [[0, 0, 1, 1]];

      Texture.paths.push(img.src);
      Texture.nextUnit++;
   }

   /* <------------------------------------| UTLITY METHODS |------------------------------------> */
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

   /* <------------------------------------| FACTORY METHODS |------------------------------------> */

   public static fromPath = async (path: string, config?: frameDataConfig): Promise<Texture> => {
      let img = await loadImage(path);
      return new Texture(img, config);
   }
}