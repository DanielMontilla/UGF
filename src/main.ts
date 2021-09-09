import Surface from './Surface';
import Sprite from './Entities/Sprite';
import { createCanvas, createContext, createProgram } from './webgl-utils';
import { vertexShader as vs, fragmentShader as fs } from './Shaders/Polygon';
import { rand } from './util';

/* LOADING (ASSETS) PHASE */
const loadImage = async (path: string) => {
   let img = new Image();
   img.src = path;
   await img.decode();
   return img;
};

let start = async () => {
   let s = new Surface(1200, 900, [1, 1, 1]);
   let spriteSource = await loadImage('assets/debug.png');
   let imageSource = await loadImage('assets/download.jpg');
   let sp = new Sprite(s, 100, 100, spriteSource);
   sp.scale(3);
   let [speedx, speedy] = [0, 0];
   let ms = 250;

   let w_key = s.addKeyInput('w');
   let a_key = s.addKeyInput('a');
   let s_key = s.addKeyInput('s');
   let d_key = s.addKeyInput('d');

   s.update = (dt: number) => {
      [speedx, speedy] = [0, 0];

      if (w_key.pressed) speedy -= ms;
      if (a_key.pressed) speedx -= ms;
      if (s_key.pressed) speedy += ms;
      if (d_key.pressed) speedx += ms;

      sp.x += speedx * dt;
      sp.y += speedy * dt;
   };

   
}

start();

const idk = () => {
   let canvas        = createCanvas(1200, 900);
   let gl            = createContext(canvas);
   let projection    = [ 2 / canvas.width, 0, 0, 0, -2 / canvas.height, 0, -1, 1, 1 ];
   let program       = createProgram(gl, vs, fs);

   const MAX_QUAD_AMOUNT   = 1000;
   const VERTEX_PER_QUAD   = 4;
   const VERTEX_ELEMENTS   = 5
   const VERTEX_SIZE       = 4 * VERTEX_ELEMENTS;
   const MAX_VERTEX_AMOUNT = MAX_QUAD_AMOUNT * VERTEX_PER_QUAD * VERTEX_ELEMENTS;

   gl.useProgram(program);


   class Rectangle {
      x: number
      y: number
      width: number
      height: number
      color: rgb

      speed: [x: number, y: number];

      constructor(x: number, y: number, width: number, height: number, color: rgb) {
         this.x      = x;
         this.y      = y;
         this.width  = width;
         this.height = height;
         this.color  = color;

         this.speed = [ rand(-30, 30), rand(-30, 30) ];
      }
   }

   let entities: Rectangle[] = [];

   type vertex = [ x: number, y: number, r: number, g: number, b: number ];
   type quad = [ v1: vertex, v2: vertex, v3: vertex, v4: vertex ];

   const createQuad = (x: number, y: number, width: number, height: number, rgb: rgb) => {
      let [r, g, b] = rgb;

      let v1: vertex = [ x           , y         , r, g, b ];
      let v2: vertex = [ x + width   , y         , r, g, b ];
      let v3: vertex = [ x           , y + height, r, g, b ];
      let v4: vertex = [ x + width   , y + height, r, g, b ];

      let quad: quad = [ v1, v2, v3, v4 ];
      
      return quad;
   }

   for (let i = 0; i < MAX_QUAD_AMOUNT; i++) {
      let [ width, height ]   = [ rand(5, 250), rand(5, 250) ];
      let [ x, y ]            = [ rand(0, canvas.width - width), rand(0, canvas.height - height) ];
      let color: rgb          = [ rand(0, 1), rand(0, 1), rand(0, 1) ];
      entities.push(new Rectangle(x, y, width, height, color));
   }
   
   let vao = new Float32Array(new Array<number>(MAX_VERTEX_AMOUNT));  // VERTEX ARRAY OBJECT

   let indices: number[] = [];

   for (let i = 0; i < entities.length; i++) {
      let offset = 4 * i;  // SIZE OF QUAD * CURRENT QUAD INDEX

      indices.push(
         0 + offset, 1 + offset, 2 + offset,
         2 + offset, 1 + offset, 3 + offset
      )
   }

   let positionLocation    = gl.getAttribLocation(program, 'a_position');
   let colorLocation       = gl.getAttribLocation(program, 'a_color');
   let projectionLocation  = gl.getUniformLocation(program, 'u_projection');

   gl.uniformMatrix3fv(projectionLocation, false, projection);

   let vbo = <WebGLBuffer> gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
   
   gl.enableVertexAttribArray(positionLocation);
   gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, VERTEX_SIZE, 0);
   gl.enableVertexAttribArray(colorLocation);
   gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, VERTEX_SIZE, Float32Array.BYTES_PER_ELEMENT * 2);
   
   gl.bufferData(gl.ARRAY_BUFFER, MAX_QUAD_AMOUNT * VERTEX_PER_QUAD * VERTEX_SIZE, gl.DYNAMIC_DRAW);
   
   let ibo = <WebGLBuffer> gl.createBuffer();
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

   gl.clearColor(0, 0, 0, 1);
   gl.viewport(0, 0, canvas.width, canvas.height);
   gl.clear(gl.COLOR_BUFFER_BIT);
   
   let previousTime = performance.now();

   const draw = (currentTime: number) => {
      let dt = (currentTime - previousTime) * 0.001;

      gl.clear(gl.COLOR_BUFFER_BIT);

      entities.forEach((r, i) => {
         r.x += r.speed[0] * dt;
         r.y += r.speed[1] * dt;
         let offset = i * VERTEX_ELEMENTS * VERTEX_PER_QUAD;
         createQuad(r.x, r.y, r.width, r.height, r.color).forEach( (v, j) =>  vao.set(v, offset + j * VERTEX_ELEMENTS) )
      });

      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, vao);

      gl.drawElements(
         gl.TRIANGLES,
         6 * entities.length, 
         gl.UNSIGNED_SHORT,
         0
      );

      previousTime = currentTime;
      requestAnimationFrame(draw);
   }

   requestAnimationFrame(draw);
}

// idk();