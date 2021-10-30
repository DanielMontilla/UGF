import Surface from './Surface';
import Sprite from './Entities/Sprite';
import { rand } from './util';
import Texture from './Renderer/Texture';
import Rectangle from './Entities/Rectangle';

let main = async () => {

   let s = new Surface(1200, 800, [0.15, 0.15, 0.15]);
   
   let size = 64
   
   let texture = await Texture.fromPath('./assets/test_sheet.png', { height: size, width: size, cols: 2, rows: 2 });

   let mySprite = new Sprite(s, 0, 0, texture).scale(5);
   let mySprite2 = new Sprite(s, s.width / 2, s.height / 2, texture).scale(5);

   mySprite.x -= mySprite.width / 2;
   mySprite.y -= mySprite.height / 2;
   mySprite2.x -= mySprite.width / 2;
   mySprite2.y -= mySprite.height / 2;

   // let myRect = new Rectangle(s, 100, 500, 100, 100);

   let fpsText = <HTMLElement>document.getElementById('fps');

   let a_key = s.addKeyInput('a');
   let w_key = s.addKeyInput('w');
   let s_key = s.addKeyInput('s');
   let d_key = s.addKeyInput('d');

   let q_key = s.addKeyInput('q');
   let e_key = s.addKeyInput('e');

   let space = s.addKeyInput(' ');
   space.onDownOnceCallback = () => s.camera.reset();

   let [left, up, right, down] = s.createKeys(['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown']);

   left.onDownOnceCallback = () => {
      mySprite.flip('x');
   }

   let cSpeed = 600;
   let zFactor = .01;

   s.update = (dt: number) => {

      if (e_key.pressed) s.camera.scale(1 + zFactor);
      if (q_key.pressed) s.camera.scale(1 - zFactor)

      if (a_key.pressed) s.camera.move(cSpeed * dt, 0);
      if (d_key.pressed) s.camera.move(-cSpeed * dt, 0);
      if (w_key.pressed) s.camera.move(0, cSpeed * dt);
      if (s_key.pressed) s.camera.move(0, -cSpeed * dt);

      (<string>fpsText.innerHTML) = `FPS: ${s.fps.toPrecision(3)} | ZOOM: x${s.camera.zoomFactor}`;
   };
}

main();