import Surface from './Surface';
import Sprite from './Entities/Sprite';
import { createCanvas, createContext, createOrthoMatrix, createProgram, createTexture } from './webgl-utils';
import { vertexShader as rectangle_vs, fragmentShader as rectangle_fs } from './Shaders/Rectangle';
import { vertexShader as sprite_vs, fragmentShader as sprite_fs } from './Shaders/Sprite';
import { mapValue, rand, loadImage } from './util';
import Texture from './Renderer/Texture';

let start = async () => {

   let s = new Surface(1200, 850, [0.15, 0.15, 0.15]);

   let gl = s.renderer.gl;
   
   let size = 64
   let scale = 2;
   let amount = 2**12;
   
   let texture = await Texture.fromPath('./assets/test_sheet.png', { height: size, width: size, cols: 2, rows: 2 });
   
   class mySprites extends Sprite {
      
      speed = { x: rand(-50, 50), y: rand(-50, 50) };
      
      constructor() {
         super(
            s,
            rand(-s.width, s.width),
            rand(-s.height, s.height),
            texture
         );
      }
   }
      
   let sprites: mySprites[] = [];

   for (let i = 0; i < amount; i++) {
      let sprite = new mySprites();

      setInterval(sprite.randomFrame, rand(0, 1000, true));

      sprites.push(sprite)
   }

   let fpsText = <HTMLElement>document.getElementById('fps');
   let amountText = <HTMLElement>document.getElementById('amount');

   amountText.innerHTML = `Amount: ${amount}`;

   let a_key = s.addKeyInput('a');
   let w_key = s.addKeyInput('w');
   let s_key = s.addKeyInput('s');
   let d_key = s.addKeyInput('d');
   let cSpeed = 600;

   s.update = (dt: number) => {
      sprites.forEach( p => {
         
         // if (p.x <= 0 || p.x + p.width >= s.width) p.speed.x *= -1;
         // if (p.y <= 0 || p.y + p.height >= s.height) p.speed.y *= -1;
         
         p.x += p.speed.x * dt;
         p.y += p.speed.y * dt;

      });

      if (a_key.pressed) s.camera.move(cSpeed * dt, 0);
      if (d_key.pressed) s.camera.move(-cSpeed * dt, 0);
      if (w_key.pressed) s.camera.move(0, cSpeed * dt);
      if (s_key.pressed) s.camera.move(0, -cSpeed * dt);

      console.log(s.renderer.getCameraTransalation()[6]);

      (<string>fpsText.innerHTML) = `FPS: ${s.fps.toPrecision(3)}`;
   };
}

const learningDrawElements = () => {
   let canvas        = createCanvas(1200, 900);
   let gl            = createContext(canvas);
   let projection    = createOrthoMatrix(canvas.width, canvas.height);
   let program       = createProgram(gl, rectangle_vs, rectangle_fs);

   const MAX_QUAD_AMOUNT   = 1000;
   const VERTEX_PER_QUAD   = 4;
   const UNIT_PER_VERTEX   = 5;
   const VERTEX_SIZE       = 4 * UNIT_PER_VERTEX;
   const MAX_VERTEX_AMOUNT = MAX_QUAD_AMOUNT * VERTEX_PER_QUAD * UNIT_PER_VERTEX;

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

   gl.uniformMatrix4fv(projectionLocation, false, projection);

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
         let offset = i * UNIT_PER_VERTEX * VERTEX_PER_QUAD;
         createQuad(r.x, r.y, r.width, r.height, r.color).forEach( (v, j) =>  vao.set(v, offset + j * UNIT_PER_VERTEX) )
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

const learningTextures = async () => {
   let canvas        = createCanvas(1200, 900);
   let gl            = createContext(canvas);
   let projection    = createOrthoMatrix(canvas.width, canvas.height);
   let program       = createProgram(gl, sprite_vs, sprite_fs);

   const MAX_QUAD          = 2**10;
   const UNIT_SIZE         = 4;
   const UNITS_PER_VERTEX  = 5;  // [x, y, texture_index, texcord_x, texcord_y]
   const VERTEX_PER_QUAD   = 4;
   const INDICES_PER_QUAD  = 6;

   const VERTEX_SIZE       = UNIT_SIZE       * UNITS_PER_VERTEX;
   const UNITS_PER_QUAD    = VERTEX_PER_QUAD * UNITS_PER_VERTEX;
   const MAX_INDICES       = MAX_QUAD        * INDICES_PER_QUAD;
   const MAX_UNIT          = UNITS_PER_QUAD  * MAX_QUAD;
   const MAX_SIZE          = MAX_UNIT        * UNIT_SIZE;

   let vao     = new Float32Array(MAX_UNIT);
   let vbo    = <WebGLBuffer> gl.createBuffer();
   let iao    = new Uint16Array(MAX_INDICES);
   let ibo    = <WebGLBuffer> gl.createBuffer();
      
   gl.useProgram(program);

   class Sprite {
      x: number
      y: number
      width: number
      height: number
      texture: WebGLTexture;
      unit: number;

      constructor(x: number, y: number, unit: number, source: HTMLImageElement) {
         this.x         = x;
         this.y         = y;
         this.width     = source.width;
         this.height    = source.height;
         this.unit      = unit;
         this.texture   = createTexture(gl, source, unit);
      }

      scale = (n: number) => {
         this.width *= n;
         this.height *= n;
         return this;
      }
   }

   let spritesList: Sprite[] = [
      new Sprite(100, 100, 0, await loadImage('./assets/debug.png')).scale(5),
      new Sprite(500, 300, 1, await loadImage('./assets/guy.png')).scale(5)
   ];

   const createQuadData = (sprite: Sprite) => {
      let [ x, y, width, height, unit ] = [
         sprite.x,
         sprite.y,
         sprite.width,
         sprite.height,
         sprite.unit
      ]

      let quad = [
         x           , y         , unit, 0, 0,  // v1
         x + width   , y         , unit, 1, 0,  // v2
         x           , y + height, unit, 0, 1,  // v3
         x + width   , y + height, unit, 1, 1  // v4
      ]
      
      return quad;
   };

   for (let i = 0; i < MAX_QUAD; i++) {
      let offset = 4 * i;  // SIZE OF QUAD * CURRENT QUAD INDEX

      iao.set([
         0 + offset, 1 + offset, 2 + offset,
         2 + offset, 1 + offset, 3 + offset
      ], INDICES_PER_QUAD * i)
   }

   let positionLocation    = gl.getAttribLocation(program, 'a_position');
   let texcoordLocation    = gl.getAttribLocation(program, 'a_texCoord');
   let texIndexLocation    = gl.getAttribLocation(program, 'a_texIndex');
   let projectionLocation  = gl.getUniformLocation(program, 'u_projection');
   let texturesLocation    = gl.getUniformLocation(program, 'u_textures');

   gl.uniformMatrix4fv(projectionLocation, false, projection);
   // gl.uniform1i(textureLocation, 0);
   gl.uniform1iv(texturesLocation, new Int32Array([0, 1, 2, 3]));

   gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
   
   gl.enableVertexAttribArray(positionLocation);
   gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, VERTEX_SIZE, 0);
   gl.enableVertexAttribArray(texIndexLocation);
   gl.vertexAttribPointer(texIndexLocation, 1, gl.FLOAT, false, VERTEX_SIZE, UNIT_SIZE * 2);
   gl.enableVertexAttribArray(texcoordLocation);
   gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, VERTEX_SIZE, UNIT_SIZE * 3);
   
   gl.bufferData(gl.ARRAY_BUFFER, MAX_SIZE, gl.DYNAMIC_DRAW);
   
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(iao), gl.STATIC_DRAW);

   gl.clearColor(0, 0, 0, 1);
   gl.viewport(0, 0, canvas.width, canvas.height);
   gl.clear(gl.COLOR_BUFFER_BIT);

   gl.enable(gl.BLEND);
   gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
   
   let previousTime = performance.now();

   const update = (dt: number) => {

   }

   const draw = (currentTime: number) => {
      let dt = (currentTime - previousTime) * 0.001;

      gl.clear(gl.COLOR_BUFFER_BIT);

      spritesList.forEach( (s, i) => {
         vao.set(createQuadData(s), i * UNITS_PER_QUAD)
      })

      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, vao);

      gl.drawElements(
         gl.TRIANGLES,
         INDICES_PER_QUAD * spritesList.length, 
         gl.UNSIGNED_SHORT,
         0
      );

      previousTime = currentTime;
      requestAnimationFrame(draw);
   }

   requestAnimationFrame(draw);
}

// learningTextures();

start();