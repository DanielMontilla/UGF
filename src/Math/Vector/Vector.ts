/**
 * @param dimension depth of vector
 * @param values starting values. If not specified then it will intilize as the 0 vector
 */
export default abstract class Vector extends Array<number> {
   constructor(dimmesion: number) {
      super(dimmesion);
      this.fill(0);
   }
}