import { Texture } from "../../core/texture";
import { tryCreateTexture } from "../../functions";
import { WebGL2Renderer } from "./webgl2_renderer";

type TextureInfo = { refCount: number, glTexture: WebGLTexture, chunk: number, unit: number };
export class TextureManager {

  get context(): WebGL2RenderingContext { return this.rendererRef.context };

  private readonly textures = new Map<Texture, TextureInfo>();

  public readonly CHUNK_LENGTH: number;

  public constructor(
    public readonly rendererRef: WebGL2Renderer
  ) {
    const { context } = this;

    this.CHUNK_LENGTH = context.getParameter(MAX_TEXTURE_IMAGE_UNITS);
  }

  public addTextureRef(texture: Texture): void {
    const { textures } = this;

    const textureInfo = textures.get(texture);
    if (textureInfo !== undefined) {
      textureInfo.refCount++;
    } else {
      this.initTexture(texture);
    }
  }

  public removeTextureRef(texture: Texture): void {
    const { textures, context } = this;
    
    if (!textures.has(texture)) throw Error('trying to remove undeclared texture');

    const textureInfo = textures.get(texture)!;

    textureInfo.refCount--;

    if (textureInfo.refCount > 0) return;

    const { chunk, unit } = textureInfo;

    const frontTexture = this.findFrontTexture();

    // if front texture isn't the one being removed
    if (frontTexture !== texture) {
      // moving front texture to missing slot
      const frontTextureInfo = textures.get(frontTexture)!;
      textures.set(frontTexture, {...frontTextureInfo, chunk, unit });
    }

    context.deleteTexture(textureInfo.glTexture);
    textures.delete(texture);

  }

  private initTexture(texture: Texture): void {
    const { textures, context } = this;

    if (textures.has(texture)) throw Error('trying to initialize and already initialized texture');

    const refCount = 1;
    const glTexture = tryCreateTexture(context).unwrap();
    const [chunk, unit] = this.findNextAvailableSlot();

    context.bindTexture(TEXTURE_2D, glTexture);
    context.texImage2D(TEXTURE_2D, 0, RGBA, RGBA, UNSIGNED_BYTE, texture.image);

    context.texParameteri(TEXTURE_2D, TEXTURE_WRAP_S, CLAMP_TO_EDGE);
    context.texParameteri(TEXTURE_2D, TEXTURE_WRAP_T, CLAMP_TO_EDGE);
    context.texParameteri(TEXTURE_2D, TEXTURE_MIN_FILTER, LINEAR);
    context.texParameteri(TEXTURE_2D, TEXTURE_MAG_FILTER, LINEAR);

    textures.set(texture, { refCount, glTexture, chunk, unit })
  }

  private findNextAvailableSlot(): [chunk: number, unit: number] {
    const { textures, CHUNK_LENGTH } = this; 

    const frontTexture = this.findFrontTexture();

    const { chunk: frontChunk, unit: fronUnit } = textures.get(frontTexture)!;

    let chunk = frontChunk;
    let unit = fronUnit + 1;

    if (unit >= CHUNK_LENGTH) {
      // if al texture units have been consumed
      chunk++;
      unit = 0;
    }

    return [chunk, unit];
  }

  /// finds the texture with the highest chunk number, and then highest unit count
  private findFrontTexture(): Texture {
    const { textures } = this;

    let frontTexture: Texture | null = null;
    let highestChunk = -1;
    let highestUnit = -1;

    for (const [texture, { chunk, unit }] of textures) {
      if (chunk > highestChunk) {
        highestChunk = chunk;
        highestUnit = unit;
        frontTexture = texture;
      } else if (chunk == highestChunk && unit > highestUnit) {
        highestUnit = unit;
        frontTexture = texture;
      }
    }

    return frontTexture!;
  }
}

const { 
  MAX_TEXTURE_IMAGE_UNITS,
  TEXTURE_2D, RGBA, 
  UNSIGNED_BYTE, 
  TEXTURE_WRAP_S,
  CLAMP_TO_EDGE,
  TEXTURE_WRAP_T,
  TEXTURE_MIN_FILTER,
  LINEAR,
  TEXTURE_MAG_FILTER
} = WebGL2RenderingContext;