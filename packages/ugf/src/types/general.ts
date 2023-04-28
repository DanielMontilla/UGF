export type Anchor = 
  'top left'    | 'top center'    | 'top right'     |
  'center left' | 'center'        | 'center right'  |
  'bottom left' | 'bottom center' | 'bottom right'


export type TickCallback = (dt: DOMHighResTimeStamp) => void;