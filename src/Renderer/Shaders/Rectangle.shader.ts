export const attributeList = ['a_position', 'a_offset', 'a_origin', 'a_angle', 'a_color'] as const;
export const uniformList = ['u_projection', 'u_camera'] as const;

const position = attributeList[0];
const offset = attributeList[1];
const origin = attributeList[2];
const angle = attributeList[3];
const color = attributeList[4];

const projection = uniformList[0];
const camera = uniformList[1];

export type attributes = typeof attributeList[number];
export type uniforms = typeof uniformList[number];

export const vertexShader = `
   precision mediump float;

   attribute vec3 ${position};
   attribute vec2 ${offset};
   attribute vec2 ${origin};
   attribute float ${angle};
   attribute vec3 ${color};

   uniform mat4 ${projection};
   uniform mat4 ${camera};

   varying vec3 v_color;
   
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
      
      gl_Position = (${projection} * ${camera}) * vec4(p , 1);
      v_color = ${color};
   }
` as const;

export const fragmentShader = `
   precision mediump float;

   varying vec3 v_color;

   void main()
   {
      gl_FragColor = vec4(v_color, 1);
   }
` as const;