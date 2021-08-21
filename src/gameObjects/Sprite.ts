import GameObject from './gameObject';
import { renderType } from '../util';
import Game from '../Game';

export default class Sprite extends GameObject {

   renderType: renderType;
   texture: WebGLTexture;

   width: number;
   heigth: number;

   constructor(x: number, y: number, image: HTMLImageElement) {
      super(x, y);
      this.width = image.width;
      this.heigth = image.height;

      let gl = Game.getRenderingContext();
      this.texture = <WebGLTexture>gl.createTexture();

      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      this.renderType = 'texture';
   }

   public getBufferData(): Float32Array {
      let data: number[] = [];
      return new Float32Array(data);
   }

   public getPositionBufferData(): Float32Array {
      let x1 = this.x;
      let y1 = this.y;
      let x2 = this.x + this.width;
      let y2 = this.y + this.heigth;

      return new Float32Array([
         x1, y1,
         x2, y1,
         x2, y2,
         x1, y1,
         x2, y2,
         x1, y2
      ])
   }
}