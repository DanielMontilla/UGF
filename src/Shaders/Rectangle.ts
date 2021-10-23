export const attributes = ['a_position', 'a_color'] as const;
export const uniforms = ['u_projection', 'u_camera'] as const;

export const vertexShader = `
   precision mediump float;

   attribute vec3 ${attributes[0]};
   attribute vec3 ${attributes[1]};

   uniform mat4 ${uniforms[0]};
   uniform mat4 ${uniforms[1]};

   varying vec3 v_color;
   
   void main()
   {
      gl_Position = (${uniforms[0]} * ${uniforms[1]}) * vec4(${attributes[0]}, 1);
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