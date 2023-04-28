#version 300 es

in vec2 a_position;
in float a_layer;
in vec4 a_color;

uniform mat4 u_projection;
uniform mat4 u_view;

out vec4 v_color;

void main() {
  vec3 position = vec3(a_position, a_layer);

  gl_Position = (u_projection * u_view) * vec4(position , 1);

  v_color = a_color;
}