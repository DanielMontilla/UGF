import { attributeData, pipelineName } from "../../types";
import Renderer from "../Renderer";
import { createProgram } from "../util";

/**
 * @description works as lookup class for rendering diferent gameobjects
 */
export default abstract class Pipeline {

   public readonly name: pipelineName;
   public readonly program: WebGLProgram;
   protected context = Renderer.context;

   constructor(name: pipelineName, vertexShaderSource: string, fragmentShaderSource: string) {
      this.name = name;
      this.program = createProgram(this.context, vertexShaderSource, fragmentShaderSource);

      this.init();
   }

   /**
    * @description handles setting up the following:
    *    1. global uniforms
    *    2. creating attributeData objects
    */
   protected abstract init(): void;
}