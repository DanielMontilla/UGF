import Renderer from "../Renderer";
import Entity from "../../Entities/Entity";
import { createProgram, createShader, getDataFromType } from "../../Util/webgl";
import { emptyRecord } from "../../Util/general";

export default abstract class Pipeline<
   E extends Entity = Entity,
   attributes extends string = string,
   uniforms extends string = string
> {
   public readonly renderer: Renderer;

   public readonly program: WebGLProgram;
   public readonly vertexShader: WebGLShader;
   public readonly fragmentShader: WebGLShader;

   // Pointer to drawable objects
   protected entityList: E[];

   protected attributes = emptyRecord<attributes, attributeInfo>();
   protected uniforms = emptyRecord<uniforms, uniformInfo>();

   public constructor(
      renderer: Renderer,
      entityList: E[],
      vsSource: string,
      fsSource: string,
      attributeList: readonly attributes[],
      uniformList: readonly uniforms[]
   ) {
      let gl = renderer.gl;
      this.renderer = renderer;
      this.entityList = entityList;
      this.vertexShader = createShader(gl, 'vertex', vsSource);
      this.fragmentShader = createShader(gl, 'fragment', fsSource);
      this.program = createProgram(gl, this.vertexShader, this.fragmentShader);

      this.generateAttributes(attributeList);
      this.generateUniforms(uniformList);
   }

   private generateAttributes(list: readonly string[]) {
      let gl = this.renderer.gl;
      let position = 0;

      for (const attrib of list) {
         let location = gl.getAttribLocation(this.program, attrib);
         let info = <WebGLActiveInfo>gl.getActiveAttrib(this.program, location);
         let type = info.type;

         let [unitType, units, size] = getDataFromType(type);
         let offset = position;
         position += size;

         this.attributes[attrib as attributes] = {
            id: attrib,
            location: location,
            type: type,
            unitType: unitType,
            units: units,
            size: size,
            offset: offset
         };
      }
   }

   private generateUniforms(list: readonly string[]) {
      let gl = this.renderer.gl;
      for (const [index, uniformID] of list.entries()) {
         let location = <WebGLUniformLocation>(
            gl.getUniformLocation(this.program, uniformID)
         );
         let info = <WebGLActiveInfo>gl.getActiveUniform(this.program, index);
         let size = info.size;
         let type = info.type;

         this.uniforms[uniformID as uniforms] = {
            location: location,
            size: size,
            type: type
         };
      }
   }

   public abstract begin(): void;
}