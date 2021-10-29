import Surface from './Surface';
import Sprite from './Entities/Sprite';
import { rand } from './util';
import Texture from './Renderer/Texture';
import Rectangle from './Entities/Rectangle';

let main = async () => {

   let s = new Surface(1200, 800, [0.15, 0.15, 0.15]);
   
   let size = 64
   let scale = 2;
   let amountS = 2**13;
   let amountR = 2**14 + 1;

   let rangeS = amountS * .3;
   let rangeR = amountR * .3;
   
   let texture = await Texture.fromPath('./assets/test_sheet.png', { height: size, width: size, cols: 2, rows: 2 });
   
   class mySprites extends Sprite {
      
      speed = { x: rand(-50, 50), y: rand(-50, 50) };
      
      constructor() {
         super(
            s,
            rand(-rangeS, rangeS),
            rand(-rangeS, rangeS),
            texture
         );
      }
   }

   class myRectangles extends Rectangle {
      
      speed = { x: rand(-50, 50), y: rand(-50, 50) };
      
      constructor() {
         super(
            s,
            rand(-rangeR, rangeR),
            rand(-rangeR, rangeR),
            rand(50, 100),
            rand(50, 100),
            [rand(0, 1), rand(0, 1), rand(0, 1)]
         );
      }
   }
      
   let sprites: mySprites[] = [];
   let rectangles: myRectangles[] = [];
   
   for (let i = 0; i < amountS; i++) {
      let sprite = new mySprites().setLayer(-1);
      
      setInterval(sprite.randomFrame, rand(0, 1000, true));
      
      sprites.push(sprite)
   }
   for (let i = 0; i < amountR; i++) {
      let rect = new myRectangles().setLayer(1);

      rectangles.push(rect)
   }


   let fpsText = <HTMLElement>document.getElementById('fps');
   let amountText = <HTMLElement>document.getElementById('amount');

   amountText.innerHTML = `sprites: ${amountS} | rectangles: ${amountR} | total: ${amountR + amountS}`;

   let a_key = s.addKeyInput('a');
   let w_key = s.addKeyInput('w');
   let s_key = s.addKeyInput('s');
   let d_key = s.addKeyInput('d');
   let cSpeed = 600;

   s.update = (dt: number) => {
      sprites.forEach( p => {
         
         p.x += p.speed.x * dt;
         p.y += p.speed.y * dt;

      });

      rectangles.forEach( r => {
         r.x += r.speed.x * dt;
         r.y += r.speed.y * dt;
      })

      if (a_key.pressed) s.camera.move(cSpeed * dt, 0);
      if (d_key.pressed) s.camera.move(-cSpeed * dt, 0);
      if (w_key.pressed) s.camera.move(0, cSpeed * dt);
      if (s_key.pressed) s.camera.move(0, -cSpeed * dt);

      (<string>fpsText.innerHTML) = `FPS: ${s.fps.toPrecision(3)}`;
   };
}

main();