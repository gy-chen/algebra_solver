export interface EquationInputProps {
  state?: EquationInputState;
  onSubmit?(equation: string): void;
}

export enum EquationInputState {
  NORMAL,
  SUBMITTING
}
