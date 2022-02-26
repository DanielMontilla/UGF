import { 
   SpriteAttributeList as attributeList,
   SpriteUniformList as uniformList
} from "../CONST";

const position = attributeList[0];
const offset = attributeList[1];
const origin = attributeList[2];
const angle = attributeList[3];
const textureIndex = attributeList[4];
const textureCoord = attributeList[5];

const projection = uniformList[0];
const textures = uniformList[1];
const camera = uniformList[2];

export type attributes = typeof attributeList[number];
export type uniforms = typeof uniformList[number];

export const vertexShader = `
   precision mediump float;

   attribute vec3 ${position};
   attribute vec2 ${offset};
   attribute vec2 ${origin};
   attribute float ${angle};
   attribute vec2 ${textureCoord};
   attribute float ${textureIndex};      // TODO: change to int maybe...?

   uniform mat4 ${projection};
   uniform mat4 ${camera};

   varying vec2 v_texCoord;
   varying float v_texIndex;

   void main()
   {
      float c = cos(${angle});
      float s = sin(${angle});

      // I tried useing matrix transformations but it didnt work
      vec3 p = ${position};

      // Translate to origin
      p.x -= ${origin}.x;
      p.y -= ${origin}.y;

      // Rotate
      float xnew = p.x * c - p.y * s;
      float ynew = p.x * s + p.y * c;

      // Tranlate back
      p.x = xnew + ${origin}.x;
      p.y = ynew + ${origin}.y;

      p -= vec3(${offset} , 0);

      gl_Position = (${projection} * ${camera}) * vec4(p, 1);
      v_texCoord = ${textureCoord};
      v_texIndex = ${textureIndex};
   }
` as const;

export const fragmentShader = `
   precision mediump float;
   
   uniform sampler2D ${textures}[4];

   varying vec2 v_texCoord;
   varying float v_texIndex;

   vec4 getTexture(sampler2D textures[4], int index, vec2 texCoord) {

      vec4 color = vec4(0);
      
      // TODO: binary search

      for (int i = 0; i < 4; ++i) {
        vec4 sampler = texture2D(u_textures[i], texCoord);
        if (i == index) {
          color += sampler;
        }
      }

      return color;
  }

   void main()
   {
      int index = int(v_texIndex);
      gl_FragColor = getTexture(${textures}, index, v_texCoord);
   }
` as const;