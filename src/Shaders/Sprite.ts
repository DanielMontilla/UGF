export const attributes = ['a_position', 'a_texCoord'] as const;
export const uniforms = ['u_projection', 'u_texture'] as const;

export const vertexShader = `
   precision mediump float;
   attribute vec2 ${attributes[0]};
   attribute vec2 ${attributes[1]};
   uniform mat3 ${uniforms[0]};
   varying vec2 v_texCoord;
   void main()
   {
      gl_Position = vec4((${uniforms[0]} * vec3(${attributes[0]}, 1)).xy, 0, 1);
      v_texCoord = ${attributes[1]};
   }
` as const;

export const fragmentShader = `
   precision mediump float;
   varying vec2 v_texCoord;
   uniform sampler2D ${uniforms[1]};
   void main()
   {
      gl_FragColor = texture2D(${uniforms[1]}, v_texCoord);
   }
` as const;