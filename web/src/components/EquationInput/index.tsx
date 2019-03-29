import { invoke } from "lodash";
import React, { Component, ChangeEvent, FormEvent } from "react";
import styled from "styled-components";
import { EquationInputProps, EquationInputState } from "./types";

const InputContainer = styled.div``;

const Input = styled.input`
  width: 100%;
  font-family: monospace;
  font-size: 1em;
  padding: 0.5em 1em;
  color: rgba(0, 0, 0, 0.87);
`;

/**
 * EquationInput
 *
 * Input bar for submitting equation want to solve.
 *
 * Props:
 *   - state: state of the input, can be NORMAL and SUBMITTING
 *   - onSubmit: callback
 */
class EquationInput extends Component<EquationInputProps> {
  state = {
    inputText: ""
  };

  constructor(props: EquationInputProps) {
    super(props);

    this.onInputChange = this.onInputChange.bind(this);
    this.onInputSumit = this.onInputSumit.bind(this);
  }

  onInputChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      inputText: e.target.value
    });
  }

  onInputSumit(e: FormEvent) {
    e.preventDefault();
    invoke(this.props, "onSubmit", this.state.inputText);
  }

  render() {
    return (
      <InputContainer>
        <form onSubmit={this.onInputSumit}>
          <Input
            placeholder="x - 1 = 0"
            onChange={this.onInputChange}
            value={this.state.inputText}
            readOnly={this.props.state === EquationInputState.SUBMITTING}
          />
        </form>
      </InputContainer>
    );
  }
}

export default EquationInput;
