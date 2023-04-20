import { isErr } from "solzu";
import { Surface } from "../../core";
import { tryCreateWebGL2Context } from "../../functions";
import { Renderer } from "../../renderer";
import { ComponentPrimitive, Uniform } from "../../types";
import { Pipeline } from "./pipelines/pipeline";

export default class WebGL2Renderer extends Renderer {
  public readonly context: WebGL2RenderingContext;
  public get gl() { return this.context };

  public readonly pipelines!: Record<ComponentPrimitive, Pipeline>

  public readonly globalUniforms!: Uniform[];

  public constructor(surfaceRef: Surface) {
    super(surfaceRef);

    const contextResult = tryCreateWebGL2Context(this.canvas);
    if (isErr(contextResult)) throw Error(contextResult.error);

    this.context = contextResult.value;

    // this.pipelines = {
    //   rectangle: 
    // }

  }

  public draw(): void {
    throw new Error("Method not implemented.");
  }

}