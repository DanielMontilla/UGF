export function createShader(context: WebGL2RenderingContext, type: 'vertex' | 'fragment', source: string): WebGLShader {

  const shader = context.createShader(
    type === 'vertex'
      ? context.VERTEX_SHADER
      : context.FRAGMENT_SHADER
  )!;

  context.shaderSource(shader, source);
  context.compileShader(shader);

  const success = context.getShaderParameter(shader, context.COMPILE_STATUS);

  if (success) return shader;

  throw Error(context.getShaderInfoLog(shader)!);
}

export function createProgram(context: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  const program = context.createProgram()!;

  context.attachShader(program, vertexShader);
  context.attachShader(program, fragmentShader);
  context.linkProgram(program);

  var success = context.getProgramParameter(program, context.LINK_STATUS);
  if (success) return program;
  
  throw Error(context.getProgramInfoLog(program)!);
}