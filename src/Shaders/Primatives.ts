export const vertexShader = `
    precision mediump float;

    attribute vec2 a_vertexPosition;

    uniform mat3 u_projection;
    uniform vec3 u_color;

    varying vec3 v_fragColor;

    void main()
    {
        v_fragColor = u_color;

        gl_Position = vec4((u_projection * vec3(a_vertexPosition, 1)).xy, 0, 1);
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
