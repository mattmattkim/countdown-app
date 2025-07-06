declare module '@pqina/flip' {
  export interface TickOptions {
    value?: any;
    view?: {
      children?: Array<{
        view: string;
        transform?: string;
      }>;
    };
  }

  export interface TickInstance {
    value: any;
    destroy: () => void;
  }

  export interface TickDOM {
    create: (element: HTMLElement, options?: TickOptions) => TickInstance;
  }

  const Tick: {
    DOM: TickDOM;
  };

  export default Tick;
}