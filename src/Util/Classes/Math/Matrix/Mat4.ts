/**
 * TODO: abstract all into Mat abstract parent class for all Matrix classes
 */

export default class Mat4 extends Array<number> {

   public static readonly SIZE = 16;

   constructor(
      values?: number[]
   ) {
      values = (values) ? values : new Array<number>(Mat4.SIZE);
      if (values.length < Mat4.SIZE) values.concat(new Array<number>(Mat4.SIZE - values.length).fill(0));
      if (values.length > Mat4.SIZE) throw new Error(`Mat4 can't have more than 16 values`);
      super(...values);
   };

   public static Identity(): Mat4 {
      return new Mat4([
         1, 0, 0, 0,
         0, 1, 0, 0,
         0, 0, 1, 0,
         0, 0, 0, 1
      ]);
   }
}