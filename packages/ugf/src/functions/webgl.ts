import { Result, err, ok } from "solzu";
import { Attribute, UnitCount, GLUnitType, GLType } from "../types";
import { UNIT_COUNTS, GL_UNIT_TYPES, INDICES_PER_QUAD, VERTEX_PER_QUAD, GL_TYPES } from "../data";
const { ACTIVE_ATTRIBUTES } = WebGL2RenderingContext;

export function tryCreateWebGL2Context(
  canvas: HTMLCanvasElement
): Result<WebGL2RenderingContext, string> {
  const context = canvas.getContext('webgl2');
  if (context === null) return err('WebGL2 is unsupported');
  return ok(context);
}

export function tryCreateShader(
  context: WebGL2RenderingContext,
  type: 'vertex' | 'fragment',
  source: string
): Result<WebGLShader, string> {

  const shader = context.createShader(
    type === 'vertex'
      ? context.VERTEX_SHADER
      : context.FRAGMENT_SHADER
  );

  if (shader === null) return err('could not create shader');

  context.shaderSource(shader, source);
  context.compileShader(shader);

  const success = context.getShaderParameter(shader, context.COMPILE_STATUS);

  if (success) return ok(shader);

  return err(context.getShaderInfoLog(shader)!);
}

export function tryCreateProgram(
  context: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): Result<WebGLProgram, string> {

  const program = context.createProgram();

  if (program === null) return err('could not create program');

  context.attachShader(program, vertexShader);
  context.attachShader(program, fragmentShader);
  context.linkProgram(program);

  var success = context.getProgramParameter(program, context.LINK_STATUS);

  if (success) return ok(program);
  
  return err(context.getProgramInfoLog(program)!)
}

export function tryCreateBuffer(context: WebGL2RenderingContext): Result<WebGLBuffer, string> {
  const buffer = context.createBuffer();
  if (buffer === null) return err('could not create buffer');
  return ok(buffer);
}

export function tryCreateVertexArrayObject(context: WebGL2RenderingContext): Result<WebGLVertexArrayObject, string> {
  const vao = context.createVertexArray();
  if (vao === null) return err('could not create vao');
  return ok(vao);
}

export function trySetupAttribute(
  context: WebGL2RenderingContext,
  attribute: Attribute,
  stride: number,
  normalize: boolean = false,
): Result<void, string> {
  context.vertexAttribPointer(
    attribute.location,
    attribute.unitCount,
    attribute.unitType,
    normalize,
    stride,
    attribute.offset,
  );
  context.enableVertexAttribArray(attribute.location);
  return ok();
}

export function isValidGLUnitType(type: number): type is GLUnitType {
  return GL_UNIT_TYPES.includes(type as GLUnitType);
}

export function isValidGLType(type: number): type is GLType {
  return GL_TYPES.includes(type as GLType);
}

export function isValidComponentCount(size: number): size is UnitCount {
  return UNIT_COUNTS.includes(size as UnitCount);
}

export function typeInfoOf(type: GLType): {
  unitType: GLUnitType,
  unitSize: number,
  unitCount: UnitCount,
} {
  const gl = WebGL2RenderingContext;

  switch (type) {
    case gl.FLOAT:
      return { unitType: gl.FLOAT, unitSize: 4, unitCount: 1 };
    case gl.INT:
      return { unitType: gl.INT, unitSize: 4, unitCount: 1 };
    case gl.FLOAT_VEC2:
      return { unitType: gl.FLOAT, unitSize: 4, unitCount: 2 };
    case gl.FLOAT_VEC3:
      return { unitType: gl.FLOAT, unitSize: 4, unitCount: 3 };
    case gl.FLOAT_VEC4:
      return { unitType: gl.FLOAT, unitSize: 4, unitCount: 4 };
    default:
      throw Error(`unsupported type`)
  }
}

export function constructAttributes(
  context: WebGL2RenderingContext,
  program: WebGLProgram,
  attributeNames: string[],
): Result<{
  attributes: Record<string, Attribute>,
  stride: number,
  units: number,
}, string> {

  const totalAttributes = context.getProgramParameter(program, ACTIVE_ATTRIBUTES);

  if (typeof totalAttributes !== 'number') return err('unable to read attribute count');
  if (totalAttributes !== attributeNames.length) 
    return err(`mismatched amount of attributes. Should have ${totalAttributes} amount of attributes`);

  const attributes: Record<string, Attribute> = {};
  let offset = 0;
  let totalUnits = 0;

  for (let location = 0; location < attributeNames.length; location++) {
    const attributeName = attributeNames[location];
    const info = context.getActiveAttrib(program, location);
    
    if (info === null) return err(`invalid attribute "${attributeName}"`);
    if (info.name !== attributeName) return err(`incorrect attribute location "${attributeName}"`);

    if (!isValidGLType(info.type)) return err(`invalid GL type "${info.type}"`)
    const { unitCount, unitSize, unitType } = typeInfoOf(info.type);
    const size = unitCount * unitSize;

    attributes[attributeName] = {
      name: attributeName,
      location: location,
      unitCount: unitCount,
      size: size,
      type: info.type,
      unitType: unitType,
      offset: offset,
    }
    
    totalUnits += unitCount;
    offset += size;
  }

  return ok({ attributes, stride: offset, units: totalUnits });
}

export function generateQUADIndices(count: number): number[] {
  let result: number[] = [];
  let step: number;
  let offset: number;

  for (let i = 0; i < count; i++) {
    offset = VERTEX_PER_QUAD * i;
    step = INDICES_PER_QUAD * i;

    result[step + 0] = offset + 0; // v1
    result[step + 1] = offset + 1; // v2
    result[step + 2] = offset + 2; // v3
    result[step + 3] = offset + 2; // v3
    result[step + 4] = offset + 1; // v1
    result[step + 5] = offset + 3; // v4
  }

  return result;
}

export function generateQUADPositions(count: number): number[] {
  let result: number[] = [];
  const pattern = [
    0, 0, // ↖ TOP LEFT VERTEX
    1, 0, // ↗ TOP RIGHT VERTEX
    0, 1, // ↙ BOT LEFT VERTEX
    1, 1, // ↘ BOT RIGHT VERTEX
  ];

  for (let i = 0; i < count; i++) result.push(...pattern);

  return result;
}

export function tryCreateTexture(context: WebGL2RenderingContext): Result<WebGLTexture, string> {
  const result = context.createTexture();
  if (result !== null) return ok(result);
  return err('unable to create texture');
}