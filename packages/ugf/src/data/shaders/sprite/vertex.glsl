#version 300 es

in vec2 a_position;

in vec2 a_size;
in vec2 a_offset;
in vec2 a_textureCoords;
in float a_textureIndex;
in mat4 a_worldMatrix;

uniform mat4 u_projection;
uniform mat4 u_view;

out vec2 v_textureCoords;
out float v_textureIndex;

void main() {
  vec4 worldPosition = a_worldMatrix * vec4(a_position * a_size - a_offset, 0.0, 1.0);
  gl_Position = u_projection * u_view * worldPosition;

  v_textureCoords = a_textureCoords;
  v_textureIndex = a_textureIndex;
}