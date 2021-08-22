/* UTILITY TYPES */
type PartialRecord<K extends keyof string, T> = Partial<Record<K, T>>;

export type rgb = { r: number, g: number, b: number };
export type pipelineName = `shape` | `sprite`;

type attributeData = {
   id?: string
   location: number; // location inside shader program
   buffer: WebGLBuffer; // buffer object for attribute
   size: number; // Amount of data units per component
   type: number; // type of data
};

type uniformData = {
   id?: string;
   value?: number | number[]; // if the uniform is global then value != undefined
   location: WebGLUniformLocation;
}

interface ProgramDetail {
   program: WebGLProgram;
   attributes: Record<string, attributeData>;
   uniforms: Record<string, uniformData>;
}