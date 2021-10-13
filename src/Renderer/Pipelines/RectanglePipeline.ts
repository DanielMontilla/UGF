import Pipeline from "./Pipeline";
import Renderer from "../Renderer";

import {
   vertexShader   as vsSource,
   fragmentShader as fsSource,
   attributes     as attribArr,
   uniforms       as uniforArr
} from '../../Shaders/Rectangle';

import Rectangle from "../../Entities/Rectangle";

export default class RectanglePipeline extends Pipeline <
   typeof attribArr[number],
   typeof uniforArr[number]
> {

   /* CONSTANTS */
   private static readonly MAX_QUAD          = 2**10; // TODO: Set up flusing system to have an unlimited amount of quads
   private static readonly UNIT_SIZE         = 4;  // sizeof(float) = 4 bytes = sizeof(unit)
   private static readonly UNITS_PER_VERTEX  = 6;  // [ x, y, z, r, g, b ].length = 6
   private static readonly VERTEX_PER_QUAD   = 4;  // A quad has 4 corners aka 4 vertices
   private static readonly INDICES_PER_QUAD  = 6;  // To create a quad we need 2 triangles wich require 3 verticies each, 3 * 2 = 6

   private static readonly VERTEX_SIZE       = RectanglePipeline.UNITS_PER_VERTEX  * RectanglePipeline.UNIT_SIZE;
   private static readonly UNITS_PER_QUAD    = RectanglePipeline.VERTEX_PER_QUAD   * RectanglePipeline.UNITS_PER_VERTEX;
   private static readonly MAX_INDICES       = RectanglePipeline.INDICES_PER_QUAD  * RectanglePipeline.MAX_QUAD;
   private static readonly MAX_UNIT          = RectanglePipeline.UNITS_PER_QUAD    * RectanglePipeline.MAX_QUAD;
   private static readonly MAX_SIZE          = RectanglePipeline.MAX_UNIT          * RectanglePipeline.UNIT_SIZE;

   private vao: Float32Array; // Vertex Array Buffer  -> CPU side vertex buffer
   private vbo: WebGLBuffer;  // Vertex Buffer Object -> GPU side vertex buffer
   private iao: Uint16Array;  // Index Array Buffer   -> CPU side index buffer
   private ibo: WebGLBuffer;  // Index Buffer Object  -> GPU side index buffer

   public constructor(renderer: Renderer) {
      super(renderer, vsSource, fsSource, attribArr, uniforArr);

      const PIPE  = RectanglePipeline;
      let gl      = this.renderer.gl;
      gl.useProgram(this.program);

      this.vao    = new Float32Array(PIPE.MAX_UNIT);
      this.vbo    = <WebGLBuffer> gl.createBuffer();
      this.iao    = new Uint16Array(PIPE.MAX_INDICES);
      this.ibo    = <WebGLBuffer> gl.createBuffer();
      
      /* SETTING UP UNIFORMS */
      let u_projection = this.uniforms.u_projection;
      gl.uniformMatrix4fv(u_projection.location, false, renderer.projection);

      /* SETTING UP ATTRIBUTES */
      let a_position = this.attributes.a_position;
      let a_color    = this.attributes.a_color;

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      gl.enableVertexAttribArray(a_position.location);
      gl.vertexAttribPointer(a_position.location, 3, gl.FLOAT, false, PIPE.VERTEX_SIZE, 0);
      gl.enableVertexAttribArray(a_color.location);
      gl.vertexAttribPointer(a_color.location, 3, gl.FLOAT, false, PIPE.VERTEX_SIZE, PIPE.UNIT_SIZE * 3);

      gl.bufferData(gl.ARRAY_BUFFER, PIPE.MAX_SIZE, gl.DYNAMIC_DRAW);

      /* SETTING UP INDEX BUFFER/ARRAY OBJECT */
      for (let i = 0; i < PIPE.MAX_QUAD; i++) {
         let offset = 4 * i;

         this.iao.set([
            0 + offset, 1 + offset, 2 + offset,
            2 + offset, 1 + offset, 3 + offset
         ], PIPE.INDICES_PER_QUAD * i);
      }

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.iao, gl.STATIC_DRAW);

   }

   // TODO: add mechanisim to detect object change and only alter necesary values in vao
   public flush(rectangles: Rectangle[]) {
      
      if (!rectangles.length) return;

      let gl      = this.renderer.gl;
      const PIPE  = RectanglePipeline;
      gl.useProgram(this.program)

      for (let i = 0; i < rectangles.length; i++) {
         const rectangle = rectangles[i];
         this.vao.set(this.createQuadData(rectangle), i * PIPE.UNITS_PER_QUAD);
      };

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vao);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);

      gl.drawElements(
         gl.TRIANGLES,
         PIPE.INDICES_PER_QUAD * rectangles.length, 
         gl.UNSIGNED_SHORT,
         0
      );
   };

   private createQuadData(rect: Rectangle) {
      let [ x, y, z, width, height ] = [ rect.x, rect.y, rect.layer, rect.width, rect.height ]
      let [ r, g, b ] = rect.color;

      return [
         x        , y         , z, r, g, b,  // ↖ VERTEX
         x + width, y         , z, r, g, b,  // ↗ VERTEX
         x        , y + height, z, r, g, b,  // ↙ VERTEX
         x + width, y + height, z, r, g, b   // ↘ Vertex
      ]
   }
}