import Pipeline from "./Pipeline";
import Renderer from "../Renderer";
import Sprite from "../../Entities/Sprite";

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
   // TODO: change UNIT_SIZE to FLOAT_SIZE and add INT_SIZE for texIndex attribute
   public static readonly MAX_ELEMS          = 2**15;
   private static readonly UNIT_SIZE         = 4;  // sizeof(float) = 4 bytes = sizeof(unit)
   private static readonly UNIT_PER_VERTEX   = 6;  // [ x, y, z, unit, texcoordX, texcoordY ].length = 6
   private static readonly VERTEX_PER_ELEM   = 4;  // A quad has 4 corners aka 4 vertices
   private static readonly INDICES_PER_ELEM  = 6;  // To create a quad we need 2 triangles wich require 3 verticies each, 3 * 2 = 6
   private static readonly MAX_TEXTURE_UNITS = 16;

   private static readonly VERTEX_SIZE       = SpritePipeline.UNIT_PER_VERTEX   * SpritePipeline.UNIT_SIZE;
   private static readonly UNITS_PER_ELEM     = SpritePipeline.VERTEX_PER_ELEM   * SpritePipeline.UNIT_PER_VERTEX;
   private static readonly MAX_INDICES       = SpritePipeline.INDICES_PER_ELEM  * SpritePipeline.MAX_ELEMS;
   private static readonly MAX_UNIT          = SpritePipeline.UNITS_PER_ELEM     * SpritePipeline.MAX_ELEMS;
   private static readonly MAX_SIZE          = SpritePipeline.MAX_UNIT          * SpritePipeline.UNIT_SIZE;

   private vao: Float32Array; // Vertex Array Buffer  -> CPU side vertex buffer
   private vbo: WebGLBuffer;  // Vertex Buffer Object -> GPU side vertex buffer
   private iao: Uint16Array;  // Index Array Buffer   -> CPU side index buffer
   private ibo: WebGLBuffer;  // Index Buffer Object  -> GPU side index buffer

   public constructor(renderer: Renderer) {
      super(renderer, vsSource, fsSource, attribArr, uniforArr);

      let PIPE    = SpritePipeline;
      let gl      = this.renderer.gl;
      gl.useProgram(this.program);

      this.vao    = new Float32Array(PIPE.MAX_UNIT);
      this.vbo    = <WebGLBuffer> gl.createBuffer();
      this.iao    = new Uint16Array(PIPE.MAX_INDICES);
      this.ibo    = <WebGLBuffer> gl.createBuffer();

      /* SETTING UP UNIFORMS */
      let u_projection  = this.uniforms.u_projection;
      let u_textures    = this.uniforms.u_textures;
      let u_camera      = this.uniforms.u_camera;
      gl.uniformMatrix4fv(u_projection.location, false, renderer.projection);
      gl.uniformMatrix4fv(u_camera.location, false, this.renderer.getCameraTransalation());
      
      let texUnitArr: number[] = [];
      for (let i = 0; i < PIPE.MAX_TEXTURE_UNITS; i++) texUnitArr.push(i);
      gl.uniform1iv(u_textures.location, new Int32Array(texUnitArr));

      /* SETTING UP ATTRIBUTES */
      let a_position    = this.attributes.a_position;
      let a_texIndex    = this.attributes.a_texIndex;
      let a_texCord     = this.attributes.a_texCoord;

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      gl.enableVertexAttribArray(a_position.location);
      gl.vertexAttribPointer(a_position.location, 3, gl.FLOAT, false, PIPE.VERTEX_SIZE, 0);
      gl.enableVertexAttribArray(a_texIndex.location);
      gl.vertexAttribPointer(a_texIndex.location, 1, gl.FLOAT, false, PIPE.VERTEX_SIZE, PIPE.UNIT_SIZE * 3);
      gl.enableVertexAttribArray(a_texCord.location);
      gl.vertexAttribPointer(a_texCord.location, 2, gl.FLOAT, false, PIPE.VERTEX_SIZE, PIPE.UNIT_SIZE * 4);
      
      gl.bufferData(gl.ARRAY_BUFFER, PIPE.MAX_SIZE, gl.DYNAMIC_DRAW);

      /* SETTING UP INDEX BUFFER/ARRAY OBJECT */
      for (let i = 0; i < PIPE.MAX_ELEMS; i++) {
         let offset = 4 * i;

         this.iao.set([
            0 + offset, 1 + offset, 2 + offset,
            2 + offset, 1 + offset, 3 + offset
         ], PIPE.INDICES_PER_ELEM * i);
      }

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.iao, gl.STATIC_DRAW);
   }

   // TODO: add mechanisim to detect object change and only alter necesary values in vao
   public begin(sprites: Sprite[]) {
      if (!sprites.length) return;

      let gl      = this.renderer.gl;
      const PIPE  = SpritePipeline;
      gl.useProgram(this.program);

      gl.uniformMatrix4fv(this.uniforms.u_camera.location, false, this.renderer.getCameraTransalation());

      // Uploading sprites data onto GPU buffer (vao)
      for (let i = 0; i < sprites.length; i++) {
         const sprite = sprites[i];
         this.vao.set(this.createQuadData(sprite), i * PIPE.UNITS_PER_ELEM);
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vao);

      if (!this.once) {
         console.log(`SRPITE: ${this.vao.subarray(0, PIPE.UNITS_PER_ELEM * sprites.length)}`);
         console.log(`${sprites.length}`)
         console.log(`${PIPE.INDICES_PER_ELEM * sprites.length}`)
         let b = <WebGLBuffer>gl.createBuffer();
         console.log(`${gl.getParameter(gl.ARRAY_BUFFER_BINDING) === b}`)
         console.log(`${gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE)}`)
         this.once = true;
      }

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);

      gl.drawElements(
         gl.TRIANGLES,
         PIPE.INDICES_PER_ELEM * sprites.length,
         gl.UNSIGNED_SHORT,
         0
      )
   }

   private once: boolean = false;

   private createQuadData(sprite: Sprite) {
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