
declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
    const src: string;
    export default src;
}

declare module '*.m.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.m.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.m.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module 'raw-loader!*' {
  const value: string;
  export default value;
}

declare module '!*' {
  const value: string;
  export default value;
}