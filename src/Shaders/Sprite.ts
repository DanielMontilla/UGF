export const vertexShader = `
    precision mediump float;

    attribute vec2 a_vertexPosition;
    attribute vec2 a_texCoord;

    uniform mat3 u_projection;

    varying vec2 v_texCoord;

    void main()
    {
        gl_Position = vec4((u_projection * vec3(a_vertexPosition, 1)).xy, 0, 1);
        v_texCoord = a_texCoord;
    }
`;

export const fragmentShader = `
    precision mediump float;

    varying vec2 v_texCoord;

    uniform sampler2D u_texture;

    void main()
    {
        gl_FragColor = texture2D(u_texture, v_texCoord);
    }
    `;
