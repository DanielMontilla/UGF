/* UTILITY TYPES */
type Dictionary<K extends string, T> = { [P in K]?: T }
type rgb = [r: number, g: number, b: number];

type PipelineName = 'sprite' | 'polygon';

interface attributeInfo {
   location: number;
   buffer: WebGLBuffer;
   size: number;
   type: number;
}

interface uniformInfo {
   location: WebGLUniformLocation;
   size: number;
   type: number;
}

type keyCode =
   | 'a'
   | 'b'
   | 'c'
   | 'd'
   | 'e'
   | 'f'
   | 'g'
   | 'h'
   | 'i'
   | 'g'
   | 'k'
   | 'l'
   | 'm'
   | 'n'
   | 'o'
   | 'p'
   | 'q'
   | 'r'
   | 's'
   | 'u'
   | 'v'
   | 'w'
   | 'x'
   | 'y'
   | 'z';

type keyEvent = 'keydown' | 'keyup';