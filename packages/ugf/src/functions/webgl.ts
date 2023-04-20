import { Result, err, ok } from "solzu";
import { Attribute, ComponentCount, GLType } from "../types";
import { COMPONENT_SIZES, GL_TYPES } from "../data";
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
    attribute.componentCount,
    attribute.type,
    normalize,
    stride,
    attribute.offset,
  );
  context.enableVertexAttribArray(attribute.location);
  return ok();
}

export function isValidGLType(type: number): type is GLType {
  return GL_TYPES.includes(type as GLType);
}

export function isValidComponentCount(size: number): size is ComponentCount {
  return COMPONENT_SIZES.includes(size as ComponentCount);
}

export function sizeOf(type: GLType): number {
  const gl = WebGL2RenderingContext;
  switch (type) {
    case gl.FLOAT:
      return 4;
    case gl.INT:
      return 4;
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
  if (totalAttributes !== attributeNames.length) return err('mismatched amount of attributes');

  const attributes: Record<string, Attribute> = {};
  let offset = 0;
  let units = 0;

  for (let location = 0; location < attributeNames.length; location++) {
    const attributeName = attributeNames[location];
    const info = context.getActiveAttrib(program, location);
    
    if (info === null) return err(`invalid attribute "${attributeName}"`);
    if (info.name !== attributeName) return err(`incorrect attribute location "${attributeName}"`);

    const componentCount = info.size;
    if (!isValidComponentCount(componentCount)) return err(`unsuported component size "${info.size}"`)
    
    if (!isValidGLType(info.type)) return err(`invalid GL type "${info.type}"`)
    const size = sizeOf(info.type) * componentCount;
    

    attributes[attributeName] = {
      name: attributeName,
      location: location,
      componentCount: componentCount,
      size: size,
      type: info.type,
      offset: offset,
    }
    
    units += componentCount;
    offset += size;
  }

  return ok({ attributes, stride: offset, units });
}