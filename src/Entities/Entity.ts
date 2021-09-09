import Surface from "../Surface";

export default abstract class Entity {
   
   public readonly pipeline: PipelineName;
   public readonly surface: Surface;

   constructor(
      surface: Surface,
      pipeline: PipelineName
   ) {
      this.surface      = surface;
      this.pipeline     = pipeline;
   }
}