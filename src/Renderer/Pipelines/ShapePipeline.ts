import Pipeline from "./Pipeline";
import Renderer from "../Renderer";
import { attributeData, uniformData } from "../../types";

import {
   fragmentShader as fsSource,
   vertexShader as vsSource,
   attributes as attribArr,
   uniforms as unifArr
} from '../Shaders/Shape';

export default class ShapePipeline extends Pipeline {

   public attribs!: Record<typeof attribArr[number], attributeData>;
   public unifs!: Record<typeof unifArr[number], uniformData>;

   constructor() { super('sprite', vsSource, fsSource) };

   init() {
      let gl = this.context;
      let program = this.program;

      this.attribs = {
         a_position: {
            id: attribArr[0],
            location: gl.getAttribLocation(program, attribArr[0]),
            buffer: <WebGLBuffer>gl.createBuffer(),
            size: 2,
            type: gl.FLOAT
         }
      }

      this.unifs = {
         u_projection: {
            location: <WebGLUniformLocation>gl.getUniformLocation(program, unifArr[0]),
            value: Renderer.getProjectionMatrix()
         },
         u_color: {
            location: <WebGLUniformLocation>gl.getUniformLocation(program, unifArr[1])
         }
      }
   };

}