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

  // protected readonly vertexDataBuffer: WebGLBuffer;
  // protected readonly instanceDataBuffer: WebGLBuffer;

  // protected vertexDataArray: Float32Array;
  // protected instanceDataArray: Float32Array;

  protected readonly arrayBuffer: WebGLBuffer;
  protected readonly sizeBuffer: WebGLBuffer;
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
    this.sizeBuffer = tryCreateBuffer(context).unwrap();
    this.colorBuffer = tryCreateBuffer(context).unwrap();
    this.worldMatrixBuffer = tryCreateBuffer(context).unwrap();

    this.setupLayout();

  }

  private setupLayout(): void {
    const { context, program, projectionMatrix, viewMatrix, arrayBuffer, sizeBuffer, colorBuffer, worldMatrixBuffer, IBO, MAX_RECTANGLES } = this;
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
    const a_sizeLocation = context.getAttribLocation(program, "a_size");
    const a_colorLocation = context.getAttribLocation(program, "a_color");
    const a_worldMatrixLocation = context.getAttribLocation(program, "a_worldMatrix");

    // Non-instanced attributes
    const arrayDataUnits = 2;
    context.bindBuffer(ARRAY_BUFFER, arrayBuffer);
    context.enableVertexAttribArray(a_positionLocation);
    context.vertexAttribPointer(a_positionLocation, arrayDataUnits, FLOAT, false, 0, 0);
    context.bufferData(ARRAY_BUFFER, arrayDataUnits * MAX_RECTANGLES, DYNAMIC_DRAW);
    
    // Instanced attributes
    const sizeDataUnits = 2;
    context.bindBuffer(ARRAY_BUFFER, sizeBuffer);
    context.enableVertexAttribArray(a_sizeLocation);
    context.vertexAttribPointer(a_sizeLocation, sizeDataUnits, FLOAT, false, 0, 0);
    context.vertexAttribDivisor(a_sizeLocation, 1);
    context.bufferData(ARRAY_BUFFER, sizeDataUnits * MAX_RECTANGLES, DYNAMIC_DRAW);

    const colorDataUnits = 4;
    context.bindBuffer(ARRAY_BUFFER, colorBuffer);
    context.enableVertexAttribArray(a_colorLocation);
    context.vertexAttribPointer(a_colorLocation, colorDataUnits, FLOAT, false, 0, 0);
    context.vertexAttribDivisor(a_colorLocation, 1);
    context.bufferData(ARRAY_BUFFER, colorDataUnits * MAX_RECTANGLES, DYNAMIC_DRAW);
    
    const worldMatrixDataUnits = 16;
    context.bindBuffer(ARRAY_BUFFER, worldMatrixBuffer);
    for (let i = 0; i < 4; ++i) {
      context.enableVertexAttribArray(a_worldMatrixLocation + i);
      context.vertexAttribPointer(
        a_worldMatrixLocation + i, 4, FLOAT, false,
        4 * 4 * FLOAT_SIZE,
        i * 4 * FLOAT_SIZE,
      );
      context.vertexAttribDivisor(a_worldMatrixLocation + i, 1);
    }
    context.bufferData(ARRAY_BUFFER, worldMatrixDataUnits * MAX_RECTANGLES, DYNAMIC_DRAW);

    // Index Buffer stuff
    const indices = generateQUADIndices(MAX_RECTANGLES);
    context.bindBuffer(ELEMENT_ARRAY_BUFFER, IBO);
    context.bufferData(ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), STATIC_DRAW);
  }

  public draw(rectangles: RectangleComponent[]): void {

    const { MAX_RECTANGLES, INDICES_PER_RECTANGLE, context, arrayBuffer, sizeBuffer, colorBuffer, worldMatrixBuffer } = this;
    const { ARRAY_BUFFER, TRIANGLES, UNSIGNED_SHORT } = context;

    const rectCount = rectangles.length;
    if (rectCount > MAX_RECTANGLES) throw Error('reached limit!');

    const arrayDataUnits = 2 * VERTEX_PER_QUAD; // x, y * 4 verti
    const sizeDataUnits = 2;  // r, g, b, a
    const colorDataUnits = 4;  // r, g, b, a
    const worldMatrixDataUnits = 16; // mat4x4
    
    const arrayData = new Float32Array(rectCount * arrayDataUnits);
    const sizeData = new Float32Array(rectCount * sizeDataUnits);
    const colorData = new Float32Array(rectCount * colorDataUnits);
    const worldMatrixData = new Float32Array(rectCount * worldMatrixDataUnits);

    for (let i = 0; i < rectangles.length; i++) {
      const rectangle = rectangles[i];
      arrayData.set(this.getVerticesData(rectangle), i * arrayDataUnits);
      sizeData.set(rectangle.size.data, i * sizeDataUnits);
      colorData.set(rectangle.color.data, i * colorDataUnits);
      worldMatrixData.set(rectangle.worldTransformMatrix.data, i * worldMatrixDataUnits);
    }

    this.stage();

    context.bindBuffer(ARRAY_BUFFER, arrayBuffer);
    context.bufferSubData(ARRAY_BUFFER, 0, arrayData);
    
    context.bindBuffer(ARRAY_BUFFER, sizeBuffer);
    context.bufferSubData(ARRAY_BUFFER, 0, sizeData);

    context.bindBuffer(ARRAY_BUFFER, colorBuffer);
    context.bufferSubData(ARRAY_BUFFER, 0, colorData);

    context.bindBuffer(ARRAY_BUFFER, worldMatrixBuffer);
    context.bufferSubData(ARRAY_BUFFER, 0, worldMatrixData);

    context.drawElementsInstanced(TRIANGLES, INDICES_PER_RECTANGLE * rectCount, UNSIGNED_SHORT, 0, rectCount);

    this.unstage();
  }

  private getVerticesData(r: RectangleComponent) {
    return new Float32Array([
      0, 0, // ↖ TOP LEFT VERTEX
      1, 0, // ↗ TOP RIGHT VERTEX
      0, 1, // ↙ BOT LEFT VERTEX
      1, 1, // ↘ BOT RIGHT VERTEX
    ]);
  }
}