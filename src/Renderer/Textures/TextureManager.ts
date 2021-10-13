import Renderer from "../Renderer";
import Texture from "./Texture";

export default class TextureManager {
   registry: Dictionary<string, Texture>;

   constructor(render: Renderer) {
      this.registry = {};
   }

   createTexture() {

   }
}