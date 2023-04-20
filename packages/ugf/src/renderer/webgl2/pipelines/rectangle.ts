import { WebGL2Renderer } from "../../../renderer";
import { RectangleComponent } from "../../../components";
import { ComponentPrimitive, Attribute, Uniform } from "../../../types";
import { Pipeline } from "./pipeline";
import vertexSource from "../../../data/shaders/rectangle/vertex.glsl?raw";
import fragmentSource from "../../../data/shaders/rectangle/vertex.glsl?raw";
import { constructAttributes, sizeOf, unwrap } from "../../../functions";

const { FLOAT } = WebGL2RenderingContext;

export default class RectanglePipeline extends Pipeline<RectangleComponent> {
  public readonly primitive: ComponentPrimitive = 'rectangle';
  public readonly uniforms: Record<string, Uniform>;

  public constructor(
    rendererRef: WebGL2Renderer
  ) {
    super(
      rendererRef,
      vertexSource, fragmentSource,
      sizeOf(FLOAT), 2048, 7, 4, 6,
    );

    this.attributes = unwrap(constructAttributes(this.context, this.program, ['a_position', 'a_color']));
  }

  protected setupIndexBuffer(): void {
    throw new Error("Method not implemented.");
  }
  protected setupAttributes(): void {
    throw new Error("Method not implemented.");
  }
  protected setupUniforms(): void {
    throw new Error("Method not implemented.");
  }
  protected stageUniforms(): void {
    throw new Error("Method not implemented.");
  }
  protected stageAttributes(): void {
    throw new Error("Method not implemented.");
  }
  protected draw(components: RectangleComponent[], offset: number): void {
    throw new Error("Method not implemented.");
  }

}