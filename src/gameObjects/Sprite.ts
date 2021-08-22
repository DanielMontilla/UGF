import GameObject from './gameObject';
import Game from '../Game';
import { pipelineName } from '../types';

export default class Sprite extends GameObject {

   renderType: pipelineName;
   texture: WebGLTexture;

   constructor(x: number, y: number, image: HTMLImageElement) {
      super(x, y, 100, 100);

      let gl = Game.getRenderingContext();
      this.texture = <WebGLTexture>gl.createTexture();

      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      this.renderType = 'sprite';
   }

   public getPositionData(): Float32Array {
      let x1 = this.x;
      let y1 = this.y;
      let x2 = this.x + this.width;
      let y2 = this.y + this.height;

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