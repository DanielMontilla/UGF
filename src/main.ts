import EntityManager from './Entities/EntityManager';
import { VertexDescriptor, AttributeDescriptor, UnitDescriptor } from './Types/webgl';
import { rand, randInt, Rectangle, Sprite, Surface } from './UGF';
import { emptyRecord } from './Util/general';
import { createLayout } from './Util/webgl';

let main = async () => {

   let s = new Surface(1200, 800, [0.2, 0.2, 0.2]);

   let r1 = new Rectangle(s, 600, 400, 150, 150);

   let speed = {
      x: rand(-70, 70),
      y: rand(-70, 70)
   }

   s.update = (dt: number) => {
      r1.rotateBy(3 * dt);
      let dx = speed.x * dt;
      let dy = speed.y * dt;
      r1.moveBy(dx, dy);
   }

}

let l = createLayout({ position: ['x', 'y', 'z'], color: ['r','g','b','a'] });

let v = new EntityManager(l);

let obj = { value: 10, amount: 15 };

main();