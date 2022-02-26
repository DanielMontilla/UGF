import Renderer from "../Renderer";
import Pipeline from "./Pipeline";
import Rectangle from "../../Entities/Rectangle";
import {
   FLOAT_SIZE,
   VERTEX_PER_QUAD,
   INDICES_PER_QUAD,
   MAX_RECTANGLES,
   MANAGERS,
   RectangleAttributeList as attributeList,
   RectangleAttribute as AttributeT,
   RectangleUniformList as uniformList,
   RectangleUniform as UniformT
} from '../CONST';


import {
   vertexShader   as vsSource,
   fragmentShader as fsSource
} from "../Shaders/Rectangle.shader";
import { createQuadIAO } from "../../Util/webgl";


export default class RectanglePipeline extends Pipeline <Rectangle, AttributeT, UniformT> {

   public constructor(renderer: Renderer) {
      super(
         renderer,
         MANAGERS.rectangle,
         vsSource, 
         fsSource, 
         attributeList, 
         uniformList,
         FLOAT_SIZE,
         MAX_RECTANGLES,
         11,          // [ x, y, z, offsetx, offsety, originx, originy, angle, r, g, b].length = 11
         VERTEX_PER_QUAD,
         INDICES_PER_QUAD
      );

      let gl = this.renderer.gl;
      gl.useProgram(this.program);
      
      /* SETTING UP UNIFORMS */
      let u_projection  = this.uniforms.u_projection;
      let u_camera      = this.uniforms.u_camera;
      gl.uniformMatrix4fv(u_projection.location, false, renderer.projectionMat);
      gl.uniformMatrix4fv(u_camera.location, false, renderer.cameraMat);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      this.setAllAttributes();
      gl.bufferData(gl.ARRAY_BUFFER, this.MAX_SIZE, gl.DYNAMIC_DRAW);
      
      /* SETTING UP INDEX BUFFER/ARRAY OBJECT */
      this.iao.set(createQuadIAO(this.MAX_OBJS));
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.iao, gl.STATIC_DRAW);
   }

   protected setPerDrawUniforms(): void {
      let gl = this.renderer.gl;
      gl.uniformMatrix4fv(this.uniforms.u_camera.location, false, this.renderer.cameraMat);
   }
}