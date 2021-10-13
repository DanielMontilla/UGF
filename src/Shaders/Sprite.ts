export const attributes = ['a_position', 'a_texCoord', 'a_texIndex'] as const;
export const uniforms = ['u_projection', 'u_textures'] as const;

export const vertexShader = `
   precision mediump float;

   attribute vec3 ${attributes[0]};
   attribute vec2 ${attributes[1]};
   attribute float ${attributes[2]};

   uniform mat4 ${uniforms[0]};

   varying vec2 v_texCoord;
   varying float v_texIndex;

   void main()
   {
      gl_Position = ${uniforms[0]} * vec4(${attributes[0]}, 1);
      v_texCoord = ${attributes[1]};
      v_texIndex = ${attributes[2]};
   }
` as const;

export const fragmentShader = `
   precision mediump float;
   
   uniform sampler2D ${uniforms[1]}[4];

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
      gl_FragColor = getTexture(${uniforms[1]}, index, v_texCoord);
   }
` as const;