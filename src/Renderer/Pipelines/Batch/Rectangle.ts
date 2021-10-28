import BatchPipeline from "./Batch";
import Renderer from "../../Renderer";
import Rectangle from "../../../Entities/Rectangle";
import { FLOAT_SIZE, VERTEX_PER_QUAD, INDICES_PER_QUAD, MAX_SPRITES, MAX_RECTANGLES } from "../../CONST";


import {
   vertexShader   as vsSource,
   fragmentShader as fsSource,
   attributes     as A, 
   uniforms       as U,
   attributeList,
   uniformList
} from "../../../Shaders/Rectangle";
import { createQuadIAO } from "../../webgl-utils";


// TODO: dynamically change max size
export default class RectanglePipeline extends BatchPipeline <Rectangle, A, U> {

   public constructor(renderer: Renderer) {
      super(
         renderer,
         <Rectangle[]>renderer.entityLists.rectangle,
         vsSource, 
         fsSource, 
         attributeList, 
         uniformList,
         FLOAT_SIZE,
         MAX_RECTANGLES,
         6,
         VERTEX_PER_QUAD,
         INDICES_PER_QUAD
      );

      let gl = this.renderer.gl;
      gl.useProgram(this.program);
      
      /* SETTING UP UNIFORMS */
      let u_projection  = this.uniforms.u_projection;
      let u_camera      = this.uniforms.u_camera;
      gl.uniformMatrix4fv(u_projection.location, false, renderer.projection);
      gl.uniformMatrix4fv(u_camera.location, false, renderer.getCameraTransalation());

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      this.setAllAttributes();
      gl.bufferData(gl.ARRAY_BUFFER, this.MAX_SIZE, gl.DYNAMIC_DRAW);
      
      /* SETTING UP INDEX BUFFER/ARRAY OBJECT */
      this.iao.set(createQuadIAO(this.MAX_ELEMS));
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.iao, gl.STATIC_DRAW);
   }

   public flush() {
      // let rectangles = this.entityList;
      // if (!rectangles.length) return;
      let gl = this.renderer.gl;
      gl.useProgram(this.program)

      // SETTING UP UNIFORMS
      gl.uniformMatrix4fv(this.uniforms.u_camera.location, false, this.renderer.getCameraTransalation());

      // for (let i = 0; i < rectangles.length; i++) {
      //    const rectangle = rectangles[i];
      //    this.vao.set(this.createQuadData(rectangle), i * this.UNITS_PER_ELEM);
         
      // };
      
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

   protected createQuadData(rect: Rectangle) {
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