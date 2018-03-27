// tslint:disable-next-line:interface-name
interface NodeModule {
  hot?: {
    dispose(onDispose: () => void): void;
    accept(onAccept: () => void): void;
  };
}
