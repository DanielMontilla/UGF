import { WebGL2Renderer } from "../../../renderer";
import { RectangleComponent } from "../../../components";
import { ComponentPrimitive } from "../../../types";
import { Pipeline } from "./pipeline";
import { INDICES_PER_QUAD, VERTEX_PER_QUAD } from "../../../data";
import { generateQUADIndices, tryCreateBuffer, tryCreateProgram, tryCreateShader, tryCreateVertexArrayObject } from "../../../functions";

import vertexShaderSource from "../../../data/shaders/rectangle/vertex.glsl?raw";
import fragmentShaderSource from "../../../data/shaders/rectangle/fragment.glsl?raw";

export class RectanglePipeline extends Pipeline<RectangleComponent> {

  public readonly primitive: ComponentPrimitive = 'rectangle';

  public readonly program: WebGLProgram;
  public readonly vertexShader: WebGLShader;
  public readonly fragmentShader: WebGLShader;

  public readonly MAX_RECTANGLES: number = 2**12;
  public readonly INDICES_PER_RECTANGLE: number = INDICES_PER_QUAD;
  public readonly VERTICES_PER_RECTANGLE: number = VERTEX_PER_QUAD;

  protected readonly VAO: WebGLVertexArrayObject;
  protected readonly VBO: WebGLBuffer;
  protected readonly IBO: WebGLBuffer;

  protected readonly arrayBuffer: WebGLBuffer;
  protected readonly colorBuffer: WebGLBuffer;
  protected readonly worldMatrixBuffer: WebGLBuffer;

  public constructor(rendererRef: WebGL2Renderer) {
    super(rendererRef);

    const { context } = this;

    this.vertexShader = tryCreateShader(context, 'vertex', vertexShaderSource).unwrap();
    this.fragmentShader = tryCreateShader(context, 'fragment', fragmentShaderSource).unwrap();
    this.program = tryCreateProgram(context, this.vertexShader, this.fragmentShader).unwrap();

    this.VAO = tryCreateVertexArrayObject(context).unwrap();
    this.VBO = tryCreateBuffer(context).unwrap();
    this.IBO = tryCreateBuffer(context).unwrap();

    this.arrayBuffer = tryCreateBuffer(context).unwrap();
    this.colorBuffer = tryCreateBuffer(context).unwrap();
    this.worldMatrixBuffer = tryCreateBuffer(context).unwrap();

    this.setupLayout();

  }

  private setupLayout(): void {
    const { context, program, projectionMatrix, viewMatrix, arrayBuffer, colorBuffer, worldMatrixBuffer, IBO, MAX_RECTANGLES } = this;
    const { ARRAY_BUFFER, FLOAT, ELEMENT_ARRAY_BUFFER, STATIC_DRAW, DYNAMIC_DRAW } = context;
    const { BYTES_PER_ELEMENT: FLOAT_SIZE } = Float32Array;

    this.stage();

    // Uniform stuff!
    const u_projectionLoc = context.getUniformLocation(program, 'u_projection');
    const u_viewLoc = context.getUniformLocation(program, 'u_view');
    context.uniformMatrix4fv(u_projectionLoc, false, projectionMatrix.data);
    context.uniformMatrix4fv(u_viewLoc, false, viewMatrix.data);

    // Attribute stuff!
    const a_positionLocation = context.getAttribLocation(program, "a_position");
    const a_colorLocation = context.getAttribLocation(program, "a_color");
    const a_worldMatrixLocation = context.getAttribLocation(program, "a_worldMatrix");

    // Non-instanced attributes
    const arrayDataUnits = 2;
    context.bindBuffer(ARRAY_BUFFER, arrayBuffer);
    context.vertexAttribPointer(a_positionLocation, arrayDataUnits, FLOAT, false, 0, 0);
    context.enableVertexAttribArray(a_positionLocation);
    context.bufferData(ARRAY_BUFFER, arrayDataUnits * MAX_RECTANGLES, DYNAMIC_DRAW);
    
    // Instanced attributes
    const colorDataUnits = 4;
    context.bindBuffer(ARRAY_BUFFER, colorBuffer);
    context.vertexAttribPointer(a_colorLocation, colorDataUnits, FLOAT, false, 0, 0);
    context.enableVertexAttribArray(a_colorLocation);
    context.vertexAttribDivisor(a_colorLocation, 1);
    context.bufferData(ARRAY_BUFFER, colorDataUnits * MAX_RECTANGLES, DYNAMIC_DRAW);
    
    const worldMatrixDataUnits = 16;
    context.bindBuffer(ARRAY_BUFFER, worldMatrixBuffer);
    for (let i = 0; i < 4; ++i) {
      context.vertexAttribPointer(
        a_worldMatrixLocation + i, 4, FLOAT, false,
        4 * 4 * FLOAT_SIZE,
        i * 4 * FLOAT_SIZE,
      );
      context.enableVertexAttribArray(a_worldMatrixLocation + i);
      context.vertexAttribDivisor(a_worldMatrixLocation + i, 1);
    }
    context.bufferData(ARRAY_BUFFER, worldMatrixDataUnits * MAX_RECTANGLES, DYNAMIC_DRAW);

    // Index Buffer stuff
    const indices = generateQUADIndices(MAX_RECTANGLES);
    context.bindBuffer(ELEMENT_ARRAY_BUFFER, IBO);
    context.bufferData(ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), STATIC_DRAW);
  }

  public draw(rectangles: RectangleComponent[]): void {

    const { MAX_RECTANGLES, INDICES_PER_RECTANGLE, context, arrayBuffer, colorBuffer, worldMatrixBuffer } = this;
    const { ARRAY_BUFFER, TRIANGLES, UNSIGNED_SHORT } = context;

    const rectCount = rectangles.length;
    if (rectCount > MAX_RECTANGLES) throw Error('reached limit!');

    const arrayDataUnits = 2 * VERTEX_PER_QUAD; // x, y
    const colorDataUnits = 4;  // r, g, b, a
    const worldMatrixDataUnits = 16; // mat4x4
    
    const arrayData = new Float32Array(rectCount * arrayDataUnits);
    const colorData = new Float32Array(rectCount * colorDataUnits);
    const worldMatrixData = new Float32Array(rectCount * worldMatrixDataUnits);

    for (let i = 0; i < rectangles.length; i++) {
      const rectangle = rectangles[i];
      arrayData.set(this.getVerticesData(rectangle), i * arrayDataUnits);
      colorData.set(rectangle.color.data, i * colorDataUnits);
      worldMatrixData.set(rectangle.worldMat.data, i * worldMatrixDataUnits);
    }
    
    this.stage();

    context.bindBuffer(ARRAY_BUFFER, arrayBuffer);
    context.bufferSubData(ARRAY_BUFFER, 0, arrayData);
    
    context.bindBuffer(ARRAY_BUFFER, colorBuffer);
    context.bufferSubData(ARRAY_BUFFER, 0, colorData);

    context.bindBuffer(ARRAY_BUFFER, worldMatrixBuffer);
    context.bufferSubData(ARRAY_BUFFER, 0, worldMatrixData);

    context.drawElementsInstanced(TRIANGLES, INDICES_PER_RECTANGLE * rectCount, UNSIGNED_SHORT, 0, rectCount);

    this.unstage();
  }

  private getVerticesData(r: RectangleComponent) {
    return new Float32Array([
      0      , 0       , // ↖ TOP LEFT VERTEX
      r.width, 0       , // ↗ TOP RIGHT VERTEX
      0      , r.height, // ↙ BOT LEFT VERTEX
      r.width, r.height, // ↘ BOT RIGHT VERTEX
    ]);
  }
}