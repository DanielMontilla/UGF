import Renderer from "../Renderer";
import Pipeline from "./Pipeline";
import Sprite from "../../Entities/Sprite";

import {
   FLOAT_SIZE,
   INDICES_PER_QUAD,
   MAX_SPRITES,
   MAX_TEXTURE_UNITS,
   VERTEX_PER_QUAD
} from '../CONST';

import {
   vertexShader   as vsSource,
   fragmentShader as fsSource,
   attributes     as A,
   uniforms       as U,
   attributeList,
   uniformList
} from '../Shaders/Sprite.shader';
import { createQuadIAO } from "../../Util/webgl";

export default class SpritePipeline extends Pipeline <Sprite, A, U> {

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
         11, // [ x, y, z, offsetx, offsety, originx, originy, angle, textureindex, texcoordx, texcordy]
         VERTEX_PER_QUAD,
         INDICES_PER_QUAD
      );

      let gl = this.renderer.gl;
      gl.useProgram(this.program);

      /* SETTING UP UNIFORMS */
      let u_projection  = this.uniforms.u_projection;
      let u_textures    = this.uniforms.u_textures;
      let u_camera      = this.uniforms.u_camera;
      gl.uniformMatrix4fv(u_projection.location, false, renderer.projectionMat);
      gl.uniformMatrix4fv(u_camera.location, false, this.renderer.cameraMat);
      
      let texUnitArr: number[] = [];
      for (let i = 0; i < this.MAX_TEXTURE_UNITS; i++) texUnitArr.push(i);
      gl.uniform1iv(u_textures.location, new Int32Array(texUnitArr));

      /* SETTING UP ATTRIBUTES */
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      this.setAllAttributes();
      gl.bufferData(gl.ARRAY_BUFFER, this.MAX_SIZE, gl.DYNAMIC_DRAW);

      /* SETTING UP INDEX BUFFER/ARRAY OBJECT */
      this.iao.set(createQuadIAO(this.MAX_OBJS));
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.iao, gl.STATIC_DRAW);
   }

   protected createQuadData(sprite: Sprite) {
      let [ x, y, z ] = [ sprite.x, sprite.y, sprite.layer ];
      let [ ofx, ofy ] = [ sprite.xOffset, sprite.yOffset ];
      let [ orx, ory ] = [ sprite.xOrigin, sprite.yOrigin ];
      let [ width, height ] = [ sprite.width, sprite.height ];
      let a = sprite.angle;
      let texture = sprite.texture;
      let frame = sprite.frame;

      let [ unit, tx1, ty1, tx2, ty2 ] = [
         texture.unit,
         texture.frameData[frame][0],
         texture.frameData[frame][1],
         texture.frameData[frame][2],
         texture.frameData[frame][3]
      ]

      let quad = [
         x           , y         , z, ofx, ofy, orx, ory, a, unit, tx1, ty1,  // v1
         x + width   , y         , z, ofx, ofy, orx, ory, a, unit, tx2, ty1,  // v2
         x           , y + height, z, ofx, ofy, orx, ory, a, unit, tx1, ty2,  // v3
         x + width   , y + height, z, ofx, ofy, orx, ory, a, unit, tx2, ty2   // v4
      ]
      
      return quad;
   }

   protected setPerDrawUniforms(): void {
      let gl = this.renderer.gl;
      gl.uniformMatrix4fv(this.uniforms.u_camera.location, false, this.renderer.cameraMat);
   }
}