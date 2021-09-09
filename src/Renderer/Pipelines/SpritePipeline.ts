import Pipeline from "./Pipeline";
import Renderer from "../Renderer";
import Sprite from "../../Entities/Sprite";

import { setAttribute } from "../../webgl-utils";

import {
   vertexShader   as vsSource,
   fragmentShader as fsSource,
   attributes     as attribArr,
   uniforms       as uniforArr
} from '../../Shaders/Sprite';

export default class SpritePipeline extends Pipeline <
   typeof attribArr[number],
   typeof uniforArr[number]
> {
   public constructor(renderer: Renderer) {
      super(renderer, 'sprite', vsSource, fsSource, attribArr, uniforArr);

      let gl      = this.renderer.gl;
      let attrib  = this.attributes.a_texCoord;
      gl.useProgram(this.program)

      setAttribute(
         gl,
         new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]),
         attrib.buffer,
         attrib.location
      );

      let uniform = this.uniforms.u_projection;
      gl.uniformMatrix3fv(uniform.location, false, this.renderer.projection)
      
   }

   public prepDraw(sprite: Sprite) {

      let gl = this.renderer.gl;
      let [ x1, x2, y1, y2 ] = [
         sprite.x, 
         sprite.x + sprite.width, 
         sprite.y, 
         sprite.y + sprite.height
      ];
      
      let data = new Float32Array([
         x1, y1,
         x1, y2,
         x2, y1,
         x2, y1,
         x1, y2,
         x2, y2
      ]);

      let attrib = this.attributes.a_position;

      setAttribute(
         gl,
         data,
         attrib.buffer,
         attrib.location
      )

      let uniform = this.uniforms.u_texture;

      gl.bindTexture(gl.TEXTURE_2D, sprite.texture);
      gl.uniform1i(uniform.location, 0)

      return data.length / 2;
   }

   protected setGlobalAttributes = () => {

   }

   protected setGlobalUniforms = () => {
      
   }

}