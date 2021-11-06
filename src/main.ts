import Surface from './Core/Surface';
import Sprite from './Entities/Sprite';
import Texture from './Renderer/Texture';

let main = async () => {

   let s = new Surface(1200, 800, [0.15, 0.15, 0.15]);
   
   let size = 64
   
   let texture = await Texture.fromPath('./assets/test_sheet.png', { height: size, width: size, cols: 2, rows: 2 });

   let mySprite = new Sprite(s, 0, 0, texture).scale(5);
   let mySprite2 = new Sprite(s, s.width / 2, s.height / 2, texture).scale(5);
   let mySprite3 = new Sprite(s, -s.width / 2, -s.height / 2, texture).scale(5);

   mySprite2.frame = 1;
   mySprite3.frame = 2;

   mySprite.x -= mySprite.width / 2;
   mySprite.y -= mySprite.height / 2;
   mySprite2.x -= mySprite.width / 2;
   mySprite2.y -= mySprite.height / 2;
   mySprite3.x -= mySprite.width / 2;
   mySprite3.y -= mySprite.height / 2;

   let fpsText = <HTMLElement>document.getElementById('fps');

   let a_key = s.addKeyInput('a');
   let w_key = s.addKeyInput('w');
   let s_key = s.addKeyInput('s');
   let d_key = s.addKeyInput('d');

   let q_key = s.addKeyInput('q');
   let e_key = s.addKeyInput('e');

   q_key.onDownCallback = () => {s.camera.scale(.1)};
   e_key.onDownCallback = () => {s.camera.scale(-.1)};

   let space = s.addKeyInput(' ');
   space.onDownOnceCallback = () => s.camera.reset();

   let cSpeed = 600;
   let zFactor = .01;

   s.update = (dt: number) => {

      if (a_key.pressed) s.camera.moveBy(cSpeed * dt, 0);
      if (d_key.pressed) s.camera.moveBy(-cSpeed * dt, 0);
      if (w_key.pressed) s.camera.moveBy(0, cSpeed * dt);
      if (s_key.pressed) s.camera.moveBy(0, -cSpeed * dt);
      (<string>fpsText.innerHTML) = `FPS: ${s.fps.toPrecision(3)} | x: ${s.camera.x.toPrecision(5)} y: ${s.camera.y.toPrecision(5)} | ZOOM: x${s.camera.zoom.x} |
      fx: ${s.camera.focus.x.toPrecision(5)} fy: ${s.camera.focus.y.toPrecision(5)}`;
   };
}

main();