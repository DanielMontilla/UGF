export const attributes = ['a_position', 'a_color'] as const;
export const uniforms = ['u_projection'] as const;

export const vertexShader = `
   precision mediump float;

   attribute vec2 ${attributes[0]};
   attribute vec3 ${attributes[1]};

   uniform mat3 ${uniforms[0]};

   varying vec3 v_color;
   
   void main()
   {
      gl_Position = vec4((${uniforms[0]} * vec3(${attributes[0]}, 1)).xy, 0, 1);
      v_color = ${attributes[1]};
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