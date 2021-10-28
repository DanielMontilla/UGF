import BatchPipeline from "./Batch";
import Renderer from "../../Renderer";
import Sprite from "../../../Entities/Sprite";

import {
   FLOAT_SIZE,
   INDICES_PER_QUAD,
   MAX_SPRITES,
   MAX_TEXTURE_UNITS,
   VERTEX_PER_QUAD
} from '../../CONST';

import {
   vertexShader   as vsSource,
   fragmentShader as fsSource,
   attributes     as A,
   uniforms       as U,
   attributeList,
   uniformList
} from '../../../Shaders/Sprite';
import { createQuadIAO } from "../../webgl-utils";

export default class SpritePipeline extends BatchPipeline <Sprite, A, U> {

   public MAX_TEXTURE_UNITS: number = MAX_TEXTURE_UNITS;

   public constructor(renderer: Renderer) {
      super(
         renderer, 
         <Sprite[]>renderer.entityLists.sprite,
         vsSource, 
         fsSource, 
         attributeList, 
         uniformList,
         FLOAT_SIZE,
         MAX_SPRITES,
         6,
         VERTEX_PER_QUAD,
         INDICES_PER_QUAD
      );

      let gl = this.renderer.gl;
      gl.useProgram(this.program);

      /* SETTING UP UNIFORMS */
      let u_projection  = this.uniforms.u_projection;
      let u_textures    = this.uniforms.u_textures;
      let u_camera      = this.uniforms.u_camera;
      gl.uniformMatrix4fv(u_projection.location, false, renderer.projection);
      gl.uniformMatrix4fv(u_camera.location, false, this.renderer.getCameraTransalation());
      
      let texUnitArr: number[] = [];
      for (let i = 0; i < this.MAX_TEXTURE_UNITS; i++) texUnitArr.push(i);
      gl.uniform1iv(u_textures.location, new Int32Array(texUnitArr));

      /* SETTING UP ATTRIBUTES */

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      this.setAllAttributes();
      gl.bufferData(gl.ARRAY_BUFFER, this.MAX_SIZE, gl.DYNAMIC_DRAW);

      /* SETTING UP INDEX BUFFER/ARRAY OBJECT */
      this.iao.set(createQuadIAO(this.MAX_ELEMS));
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.iao, gl.STATIC_DRAW);
   }

   // TODO: add mechanisim to detect object change and only alter necesary values in vao
   public flush() {
      // let sprites = this.entityList;
      // if (!sprites.length) return;

      let gl = this.renderer.gl;
      gl.useProgram(this.program);

      gl.uniformMatrix4fv(this.uniforms.u_camera.location, false, this.renderer.getCameraTransalation());

      // Uploading sprites data onto GPU buffer (vao)
      // for (let i = 0; i < sprites.length; i++) {
      //    const sprite = sprites[i];
      //    this.vao.set(this.createQuadData(sprite), i * this.UNITS_PER_ELEM);
      // }

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      this.setAllAttributes();
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vao);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
      gl.drawElements(
         gl.TRIANGLES,
         this.INDICES_PER_ELEM * this.elemsToDraw,
         gl.UNSIGNED_SHORT,
         0
      );

      this.lastDrawCalls++;
   }

   protected createQuadData(sprite: Sprite) {
      let [ x, y, layer, width, height, texture, frame ] = [
         sprite.x,
         sprite.y,
         sprite.layer,
         sprite.width,
         sprite.height,
         sprite.texture,
         sprite.frame
      ]

      let [ unit, tx1, ty1, tx2, ty2 ] = [
         texture.unit,
         texture.frameData[frame][0],
         texture.frameData[frame][1],
         texture.frameData[frame][2],
         texture.frameData[frame][3]
      ]

      let quad = [
         x           , y         , layer, unit, tx1, ty1,  // v1
         x + width   , y         , layer, unit, tx2, ty1,  // v2
         x           , y + height, layer, unit, tx1, ty2,  // v3
         x + width   , y + height, layer, unit, tx2, ty2   // v4
      ]
      
      return quad;
   }
}