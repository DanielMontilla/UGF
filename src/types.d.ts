/* UTILITY TYPES */
type Dictionary<K extends string, T> = { [P in K]?: T }
type rgb = [r: number, g: number, b: number];

type EntityType = 'sprite' | 'rectangle';

type keyCode = | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'g' | 'k' | 'l' | 'm' 
               | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
               | ' ' 
               | 'ArrowLeft' | 'ArrowUp' | 'ArrowRight' | 'ArrowDown';

type keyEvent = 'keydown' | 'keyup';

type frame = [ x1: number, y1: number, x2: number, y2: number ];
type frameDataConfig = { height: number, width: number, cols: number, rows: number };