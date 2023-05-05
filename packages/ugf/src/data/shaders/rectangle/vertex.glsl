#version 300 es

in vec2 a_position;
in vec2 a_size;
in vec2 a_offset;

in vec4 a_color;
in mat4 a_worldMatrix;

uniform mat4 u_projection;
uniform mat4 u_view;

out vec4 v_color;

void main() {
  vec4 worldPosition = a_worldMatrix * vec4(a_position * a_size - a_offset, 0.0, 1.0);
  gl_Position = u_projection * u_view * worldPosition;

  v_color = a_color;
}