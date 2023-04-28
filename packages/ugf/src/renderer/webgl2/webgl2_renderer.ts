import { isErr } from "solzu";
import { Component, Surface } from "../../core";
import { tryCreateWebGL2Context } from "../../functions";
import { Renderer } from "..";
import { Uniform } from "../../types";
import { RectangleComponent } from "../../components";
import { Color } from "../../utility";
import { Vec2 } from "../../math";
import { RectanglePipeline } from "./pipelines/rectangle";

export class WebGL2Renderer extends Renderer {
  public readonly context: WebGL2RenderingContext;
  public get backgroundColor(): Color { return this.surfaceRef.backgroundColor };
  public get surfaceSize(): Vec2 { return this.surfaceRef.size };

  public readonly rectanglePipeline: RectanglePipeline;

  public readonly globalUniforms!: Uniform[];

  public constructor(surfaceRef: Surface) {
    super(surfaceRef);

    const contextResult = tryCreateWebGL2Context(this.canvas);
    if (isErr(contextResult)) throw Error(contextResult.error);

    this.context = contextResult.value;

    this.rectanglePipeline = new RectanglePipeline(this);

    const { context, backgroundColor: { r, g, b }, surfaceSize: { x: width, y: height } } = this;
    const { BLEND, ONE, ONE_MINUS_SRC_ALPHA, DEPTH_BUFFER_BIT, COLOR_BUFFER_BIT } = context;

    context.enable(BLEND);
    context.blendFunc(ONE, ONE_MINUS_SRC_ALPHA);

    context.clearColor(r, g, b, 1);
    context.viewport(0, 0, width, height);
    context.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT);
  }

  public draw(components: Component[]): void {
    const { rectanglePipeline, context } = this;
    const { COLOR_BUFFER_BIT, DEPTH_BUFFER_BIT } = context;
    
    context.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT);

    const rectangles = components.filter(c => c instanceof RectangleComponent) as RectangleComponent[];

    rectanglePipeline.draw(rectangles);
  }

}