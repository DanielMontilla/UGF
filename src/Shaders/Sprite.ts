export const attributeList = ['a_position', 'a_texIndex', 'a_texCoord'] as const;
export const uniformList = ['u_projection', 'u_textures', 'u_camera'] as const;

export type attributes = typeof attributeList[number];
export type uniforms = typeof uniformList[number];

export const vertexShader = `
   precision mediump float;

   attribute vec3 ${attributeList[0]};
   attribute vec2 ${attributeList[2]};
   attribute float ${attributeList[1]};      // TODO: change to int maybe...?

   uniform mat4 ${uniformList[0]};
   uniform mat4 ${uniformList[2]};

   varying vec2 v_texCoord;
   varying float v_texIndex;

   void main()
   {
      gl_Position = (${uniformList[0]} * ${uniformList[2]}) * vec4(${attributeList[0]}, 1);
      v_texCoord = ${attributeList[2]};
      v_texIndex = ${attributeList[1]};
   }
` as const;

export const fragmentShader = `
   precision mediump float;
   
   uniform sampler2D ${uniformList[1]}[4];

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
      gl_FragColor = getTexture(${uniformList[1]}, index, v_texCoord);
   }
` as const;