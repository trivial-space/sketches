declare module 'geo-3d-box' {
  function box(params: {size: number[], segments: number}): any
}

declare var module : {
  hot: {
    dispose: Function
    accept: Function
  }
}

declare module "*.glsl" {
    const content: string;
    export default content;
}
declare module "*.vert" {
    const content: string;
    export default content;
}
declare module "*.frag" {
    const content: string;
    export default content;
}

declare var require: (string) => any
