export const attributeList = ['a_position', 'a_color'] as const;
export const uniformList = ['u_projection', 'u_camera'] as const;

export type attributes = typeof attributeList[number];
export type uniforms = typeof uniformList[number];

export const vertexShader = `
   precision mediump float;

   attribute vec3 ${attributeList[0]};
   attribute vec3 ${attributeList[1]};

   uniform mat4 ${uniformList[0]};
   uniform mat4 ${uniformList[1]};

   varying vec3 v_color;
   
   void main()
   {
      gl_Position = (${uniformList[0]} * ${uniformList[1]}) * vec4(${attributeList[0]}, 1);
      v_color = ${attributeList[1]};
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