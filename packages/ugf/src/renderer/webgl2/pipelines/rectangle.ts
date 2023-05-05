import { WebGL2Renderer } from "../../../renderer";
import { RectangleComponent } from "../../../components";
import { ComponentPrimitive } from "../../../types";
import { Pipeline } from "./pipeline";
import { INDICES_PER_QUAD, VERTEX_PER_QUAD } from "../../../data";
import { generateQUADIndices, generateQUADPositions } from "../../../functions";

import vertexShaderSource from "../../../data/shaders/rectangle/vertex.glsl?raw";
import fragmentShaderSource from "../../../data/shaders/rectangle/fragment.glsl?raw";

const { ARRAY_BUFFER, FLOAT, UNSIGNED_BYTE, ELEMENT_ARRAY_BUFFER, STATIC_DRAW, DYNAMIC_DRAW } = WebGL2RenderingContext;
const { BYTES_PER_ELEMENT: FLOAT_SIZE } = Float32Array;

export class RectanglePipeline extends Pipeline<RectangleComponent> {
  
  public readonly primitive: ComponentPrimitive = 'rectangle';
  
  public readonly MAX_RECTANGLES: number = 2**10;
  public readonly INDICES_PER_RECTANGLE: number = INDICES_PER_QUAD;
  public readonly VERTICES_PER_RECTANGLE: number = VERTEX_PER_QUAD;
    
  protected instanceDataArray: Float32Array;

  public constructor(rendererRef: WebGL2Renderer) {
    super(rendererRef, vertexShaderSource, fragmentShaderSource);
    
    const { context, program, projectionMatrix, viewMatrix, vertexDataBuffer, instanceDataBuffer, indexBuffer, MAX_RECTANGLES } = this;
    
    this.stage();

    // Uniform stuff!
    const u_projectionLoc = context.getUniformLocation(program, 'u_projection');
    const u_viewLoc = context.getUniformLocation(program, 'u_view');
    context.uniformMatrix4fv(u_projectionLoc, false, projectionMatrix.data);
    context.uniformMatrix4fv(u_viewLoc, false, viewMatrix.data);

    // Attribute stuff!
    const a_sizeLocation = context.getAttribLocation(program, "a_size");
    const a_offsetLocation = context.getAttribLocation(program, "a_offset");
    const a_colorLocation = context.getAttribLocation(program, "a_color");
    const a_worldMatrixLocation = context.getAttribLocation(program, "a_worldMatrix");
    
    const sizeUnitCount = 2;
    const offsetUnitCount = 2;
    const colorUnitCount = 4;
    const worldMatrixUnitCount = 16;

    this.sizeUnitOffset = 0;
    this.offsetUnitOffset = this.sizeUnitOffset + sizeUnitCount;
    this.colorUnitOffset = this.offsetUnitOffset + offsetUnitCount;
    this.worldMatrixUnitOffset = this.colorUnitOffset + colorUnitCount;

    const instanceUnitCount = sizeUnitCount + offsetUnitCount + colorUnitCount + worldMatrixUnitCount;
    const stride = instanceUnitCount * FLOAT_SIZE;

    this.instanceUnitCount = instanceUnitCount;

    const sizeByteOffset = 0;
    const offsetByteOffset = sizeByteOffset + sizeUnitCount * FLOAT_SIZE;
    const colorByteOffset = offsetByteOffset + offsetUnitCount * FLOAT_SIZE;
    const worldMatrixByteOffset = colorByteOffset + colorUnitCount * FLOAT_SIZE;

    const maxUnits = instanceUnitCount * MAX_RECTANGLES;
    const maxBytes = stride * MAX_RECTANGLES;
    this.instanceDataArray = new Float32Array(maxUnits);

    context.bindBuffer(ARRAY_BUFFER, instanceDataBuffer);
    context.bufferData(ARRAY_BUFFER, maxBytes, DYNAMIC_DRAW);

    context.enableVertexAttribArray(a_sizeLocation);
    context.vertexAttribPointer(a_sizeLocation, sizeUnitCount, FLOAT, false, stride, sizeByteOffset);
    context.vertexAttribDivisor(a_sizeLocation, 1);
    
    context.enableVertexAttribArray(a_offsetLocation);
    context.vertexAttribPointer(a_offsetLocation, offsetUnitCount, FLOAT, false, stride, offsetByteOffset);
    context.vertexAttribDivisor(a_offsetLocation, 1);
    
    context.enableVertexAttribArray(a_colorLocation);
    context.vertexAttribPointer(a_colorLocation, colorUnitCount, FLOAT, false, stride, colorByteOffset);
    context.vertexAttribDivisor(a_colorLocation, 1);

    for (let i = 0; i < 4; ++i) {
      const location = a_worldMatrixLocation + i;
      const unitCount = 4;
      const size = unitCount * FLOAT_SIZE;
      const offset = worldMatrixByteOffset + (i * size);

      context.enableVertexAttribArray(location);
      context.vertexAttribPointer(location, unitCount, FLOAT, false, stride, offset);
      context.vertexAttribDivisor(location, 1);
    }

    const a_positionLocation = context.getAttribLocation(program, "a_position");
    const positionUnitCount = 2;

    context.bindBuffer(ARRAY_BUFFER, vertexDataBuffer);
    context.enableVertexAttribArray(a_positionLocation);
    context.vertexAttribPointer(a_positionLocation, positionUnitCount, UNSIGNED_BYTE, false, 0, 0);

    const positions = generateQUADPositions(maxUnits);
    context.bufferData(ARRAY_BUFFER, new Uint8Array(positions), STATIC_DRAW);

    // Index Buffer stuff
    const indices = generateQUADIndices(MAX_RECTANGLES);
    context.bindBuffer(ELEMENT_ARRAY_BUFFER, indexBuffer);
    context.bufferData(ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), STATIC_DRAW);

    this.unstage();
  }

  private readonly sizeUnitOffset: number;
  private readonly offsetUnitOffset: number;
  private readonly colorUnitOffset: number;
  private readonly worldMatrixUnitOffset: number;
  private readonly instanceUnitCount: number;

  public draw(rectangles: RectangleComponent[]): void {

    const { MAX_RECTANGLES, INDICES_PER_RECTANGLE, context, instanceDataArray, instanceDataBuffer } = this;
    const { ARRAY_BUFFER, TRIANGLES, UNSIGNED_SHORT } = context;

    const rectCount = rectangles.length;
    if (rectCount > MAX_RECTANGLES) throw Error('reached limit!');

    for (let i = 0; i < rectangles.length; i++) {
      const rectangle = rectangles[i];
      const globalOffset = i * this.instanceUnitCount;

      instanceDataArray.set(rectangle.size.data, globalOffset + this.sizeUnitOffset);
      instanceDataArray.set(rectangle.offset.data, globalOffset + this.offsetUnitOffset);
      instanceDataArray.set(rectangle.color.data, globalOffset + this.colorUnitOffset);
      instanceDataArray.set(rectangle.worldTransformMatrix.data, globalOffset + this.worldMatrixUnitOffset);
    }

    this.stage();

    context.bindBuffer(ARRAY_BUFFER, instanceDataBuffer);
    context.bufferSubData(ARRAY_BUFFER, 0, instanceDataArray.subarray(0, rectCount * this.instanceUnitCount));

    context.drawElementsInstanced(TRIANGLES, INDICES_PER_RECTANGLE * rectCount, UNSIGNED_SHORT, 0, rectCount);

    this.unstage();
  }
}