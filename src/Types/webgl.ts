
/**
 * TODO: move
 * @member id attribute's string identifier inside its shader
 * @member location index location within shader
 * @member type WEBGL.TYPE
 * @member unitType WEBGL.TYPE of single unit: INT | FLOAT | BOOL
 * @member units amount of units
 * @member size total size in bytes
 * @member offset offset position in bytes
 */
export interface attributeInfo {
   id: string;
   location: number;
   type: number;
   unitType: number;
   units: number;
   size: number;
   offset: number;
}

export interface uniformInfo {
   location: WebGLUniformLocation,
   type: number,
   size: number
}

export type UnitDescriptor = {
   relativeOffset: number,
   absoluteOffset: number
}

export type AttributeDescriptor<ElementT extends string> = {
   units: number,
   offset: number,
   size: number,
   elements: Record<ElementT, UnitDescriptor>
}

export type VertexDescriptor<AttributeT extends string> = {
   units: number,
   size: number,
   attributes: Record<AttributeT, AttributeDescriptor<string>>
}