import Pipeline from "./Pipeline";
import Renderer from "../Renderer";
import { attributeData, uniformData } from "../../types";

import {
   fragmentShader as fsSource,
   vertexShader as vsSource,
   attributes as attribArr,
   uniforms as unifArr
} from '../Shaders/Sprite';

export default class SpritePipeline extends Pipeline {

   attribs!: Record<typeof attribArr[number], attributeData>;
   unifs!: Record<typeof unifArr[number], uniformData>;

   constructor() { super('sprite', vsSource, fsSource) };

   init() {
      let gl = this.context;
      let program = this.program;

      this.attribs = {
         a_position: {
            location: gl.getAttribLocation(program, attribArr[0]),
            buffer: <WebGLBuffer>gl.createBuffer(),
            size: 2,
            type: gl.FLOAT
            
         },
         a_texCoord: {
            location: gl.getAttribLocation(program, attribArr[1]),
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

         u_texture: {
            location: <WebGLUniformLocation>gl.getUniformLocation(program, unifArr[1])
         }
      }
   };

}