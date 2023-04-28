import { values } from "solzu";
import { WebGL2Renderer } from "../../../renderer";
import { RectangleComponent } from "../../../components";
import { ComponentPrimitive } from "../../../types";
import { Pipeline } from "./pipeline";
import { INDICES_PER_QUAD, VERTEX_PER_QUAD } from "../../../data";
import { generateQUADIndices, trySetupAttribute } from "../../../functions";

import vertexSource from "../../../data/shaders/rectangle/vertex.glsl?raw";
import fragmentSource from "../../../data/shaders/rectangle/fragment.glsl?raw";

export class RectanglePipeline extends Pipeline<RectangleComponent> {
  public readonly primitive: ComponentPrimitive = 'rectangle';

  public constructor(rendererRef: WebGL2Renderer) {
    super(
      rendererRef,
      vertexSource, fragmentSource,
      ['a_position', 'a_layer', 'a_color'],
      2048, VERTEX_PER_QUAD, INDICES_PER_QUAD
    );
  }

  protected setup(): void {
    const { context, program, MAX_OBJECTS, IBO, attributes, VERTEX_STRIDE, VBO, projectionMatrix, viewMatrix } = this;
    const { ELEMENT_ARRAY_BUFFER, STATIC_DRAW, ARRAY_BUFFER } = context;
    
    this.stage();

    // Uniforms!
    const u_projectionLoc = context.getUniformLocation(program, 'u_projection');
    const u_viewLoc = context.getUniformLocation(program, 'u_view');
    context.uniformMatrix4fv(u_projectionLoc, false, projectionMatrix);
    context.uniformMatrix4fv(u_viewLoc, false, viewMatrix);

    // Attributes!
    context.bindBuffer(ARRAY_BUFFER, VBO);
    for (const attribute of values(attributes)) {
      trySetupAttribute(context, attribute, VERTEX_STRIDE).unwrap();
    }

    // Index Buffer!
    const indices = generateQUADIndices(MAX_OBJECTS);
    context.bindBuffer(ELEMENT_ARRAY_BUFFER, IBO);
    context.bufferData(ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), STATIC_DRAW);

    this.unstage();
  }

  public draw(components: RectangleComponent[]): void {
    const { context, getVertexData, MAX_UNITS, UNITS_PER_OBJECT, VBO, IBO, INDICES_PER_PRIMITIVE, MAX_OBJECTS } = this;
    const { ARRAY_BUFFER, DYNAMIC_DRAW, TRIANGLES, UNSIGNED_SHORT, ELEMENT_ARRAY_BUFFER } = context;
    const amount = components.length;
    if (amount > MAX_OBJECTS) throw Error('reached limit!');

    this.stage();

    // Generating Vertex Buffer object
    const vertices = new Float32Array(MAX_UNITS);
    for (let i = 0; i < components.length; i++) {
      const data = getVertexData(components[i]);
      const offset = UNITS_PER_OBJECT * i;
      vertices.set(data, offset);
    }

    context.bindBuffer(ARRAY_BUFFER, VBO);
    context.bufferData(ARRAY_BUFFER, vertices, DYNAMIC_DRAW);

    context.bindBuffer(ELEMENT_ARRAY_BUFFER, IBO);

    context.drawElements(TRIANGLES,amount * INDICES_PER_PRIMITIVE, UNSIGNED_SHORT, 0);

    this.unstage();
  }

  protected getVertexData(r: RectangleComponent): number[] {
    return [
      r.worldX          , r.worldY           , r.layer, r.r, r.g, r.b, r.alpha, // ↖ TOP LEFT VERTEX
      r.worldX + r.width, r.worldY           , r.layer, r.r, r.g, r.b, r.alpha, // ↗ TOP RIGHT VERTEX
      r.worldX          , r.worldY + r.height, r.layer, r.r, r.g, r.b, r.alpha, // ↙ BOT LEFT VERTEX
      r.worldX + r.width, r.worldY + r.height, r.layer, r.r, r.g, r.b, r.alpha, // ↘ BOT RIGHT VERTEX
    ]
  }

}