export interface ITimer {
  elapsed(): number;
  start(): void;
  end(): void;
}