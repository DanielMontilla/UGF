declare namespace WEBGL {
   type UNIT_TYPE = 'FLOAT' | 'INT' | 'BOOL';
   type DATA_TYPE = '_VEC' | '_MAT' | '';
   // type TYPE = 'VEC2' | 'VEC3' | 'VEC4' | 'MAT2' | 'MAT3' | 'MAT4'
}

/**
 * @member id attribute's string identifier inside its shader
 * @member location index location within shader
 * @member type WEBGL.TYPE
 * @member unitType WEBGL.TYPE of single unit: INT | FLOAT | BOOL
 * @member units amount of units
 * @member size total size in bytes
 * @member offset offset position in bytes
 */
interface attributeInfo {
   id: string;
   location: number;
   type: number;
   unitType: number;
   units: number;
   size: number;
   offset: number;
}

interface uniformInfo {
   location: WebGLUniformLocation,
   type: number,
   size: number
}