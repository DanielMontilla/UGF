import { SpriteOptions } from "../types";
import { Texture } from "./texture";

export class Sprite {

  public readonly texture: Texture;

  constructor(options: SpriteOptions) {
    const { texture } = options;

    this.texture = texture;
  }

  public static async fromAsset(path: string): Promise<Sprite> {
    const texture = await Texture.fromAsset(path);
    return new Sprite({ texture });
  }
}