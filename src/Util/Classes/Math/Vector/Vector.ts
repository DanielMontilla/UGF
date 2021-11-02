/**
 * @param dimension depth of vector
 * @note this class is kinda pointless... maybe will remove
 */
export default abstract class Vector extends Array<number> {
   constructor(values: number[]) {
      super(...values);
      Object.setPrototypeOf(this, new.target.prototype); // what the fuck https://stackoverflow.com/questions/41102060/typescript-extending-error-class
   }
}