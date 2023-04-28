#version 300 es

in vec2 a_position;
in vec2 a_offset;
in float a_layer;
in vec2 a_origin;
in float a_rotation;
in vec4 a_color;

uniform mat4 u_projection;
uniform mat4 u_view;

out vec4 v_color;

void main() {
  vec3 position = vec3(a_position + a_offset, a_layer);

  float s = sin(a_rotation);
  float c = cos(a_rotation);

  // Translate by the negative origin
  position.xy -= a_origin;

  // Apply rotation
  float originalX = position.x;
  float originalY = position.y;

  position.x = originalX * c - originalY * s;
  position.y = originalX * s + originalY * c;

  // Translate back by the origin
  position.xy += a_origin;

  gl_Position = (u_projection * u_view) * vec4(position, 1);

  v_color = a_color;
}