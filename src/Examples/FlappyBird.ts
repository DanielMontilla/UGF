import { Rectangle, Surface } from "../UGF";

const main = async () => {

   let s = new Surface();

   let bird = new Rectangle(
      s,
      s.center[0], s.center[1],
      300, 300,
      [ 200, 40, 26 ]
   ).setAnchor(0.5, 0.5);

   
}

export default main;