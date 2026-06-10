declare module "@vendetta/metro" {
  export function findByProps(...props: string[]): any;
  export function findByDisplayName(name: string): any;
  export function findByStoreName(name: string): any;
}

declare module "@vendetta/spitroast" {
  export function before(name: string, object: any, callback: (args: any[]) => void): () => void;
  export function after(name: string, object: any, callback: (args: any[], ret: any) => any): () => void;
  export function instead(name: string, object: any, callback: (args: any[], original: (...args: any[]) => any) => any): () => void;
}
