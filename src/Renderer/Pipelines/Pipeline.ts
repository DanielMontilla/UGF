import Renderer from "../Renderer";
import Entity from "../../Entities/Entity";
import { createProgram, createShader } from "../../webgl-utils";

export default abstract class Pipeline <
   A extends string = string, 
   U extends string = string
> {
   public readonly program: WebGLProgram;
   public readonly vertexShader: WebGLShader;
   public readonly fragmentShader: WebGLShader;

   public readonly renderer: Renderer;

   protected attributes = < Record<A, attributeInfo> > {};
   protected uniforms   = < Record<U, uniformInfo> > {};

   public constructor(
      renderer: Renderer,
      vsSource: string,
      fsSource: string,
      attribArr: readonly string[],
      uniformArr: readonly string[]
   ) {
      let gl = renderer.gl;

      this.renderer        = renderer;
      this.vertexShader    = createShader(gl, 'vertex', vsSource);
      this.fragmentShader  = createShader(gl, 'fragment', fsSource);
      this.program         = createProgram(gl, this.vertexShader, this.fragmentShader);

      /* |--------------------------< GENERATING ATTRIBUTE DATA >--------------------------| */
      for (const attribID of attribArr) {

         let location   = gl.getAttribLocation(this.program, attribID);
         let info       = <WebGLActiveInfo> gl.getActiveAttrib(this.program, location)
         let size       = info.size + 1;
         let type       = info.type;

         this.attributes[attribID as A] = {
            location : location,
            size     : size,
            type     : type
         }
      }

      /* |--------------------------< GENERATING UNIFORM DATA >--------------------------| */
      for (const [index, uniformID] of uniformArr.entries()) {

         let location   = <WebGLUniformLocation> gl.getUniformLocation(this.program, uniformID);
         let info       = <WebGLActiveInfo> gl.getActiveUniform(this.program, index);
         let size       = info.size;
         let type       = info.type;

         this.uniforms[uniformID as U] = {
            location : location,
            size     : size,
            type     : type
         }
      }
   }

   public abstract flush(e: Entity[]): void;
}