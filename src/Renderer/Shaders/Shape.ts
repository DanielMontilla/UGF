export const attributes = ['a_position'] as const;
export const uniforms = ['u_projection', 'u_color'] as const;

export const vertexShader = `
    precision mediump float;

    attribute vec2 ${attributes[0]};

    uniform mat3 ${uniforms[0]};
    uniform vec3 ${uniforms[1]};

    varying vec3 v_fragColor;

    void main()
    {
        v_fragColor = u_color;

        gl_Position = vec4((${uniforms[0]} * vec3(${attributes[0]}, 1)).xy, 0, 1);
    }
`;

export const fragmentShader = `
    precision mediump float;

    varying vec3 v_fragColor;

    void main()
    {
        gl_FragColor = vec4(v_fragColor, 1);
    }
    `;
