import Circle from "../Entities/Circle";
import { Rectangle, Surface } from "../UGF";

const main = async () => {

   let s = new Surface();

   let a = .5;
   let [x, y] = s.center;

   let a_key = s.addKeyInput('a');
   let w_key = s.addKeyInput('w');
   let s_key = s.addKeyInput('s');
   let d_key = s.addKeyInput('d');

   let bird = new Rectangle(
      s,
      100, 100,
      50, 50,
      [ 200, 40, 26 ]
   ).setAnchor(a);

   let other = new Circle(
      s,
      -300, -150, 300, [ 39, 2, 135 ]
   )

   s.camera.moveTo(x, y);
   
   let cSpeed = 600;
   s.update = (dt: number) => {
      bird.rotateBy( 2 * dt );
      other.x += 100 * dt;
      if (a_key.pressed) s.camera.moveBy(cSpeed * dt, 0);
      if (d_key.pressed) s.camera.moveBy(-cSpeed * dt, 0);
      if (w_key.pressed) s.camera.moveBy(0, cSpeed * dt);
      if (s_key.pressed) s.camera.moveBy(0, -cSpeed * dt);
   };

}

export default main;