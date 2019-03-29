import React from "react";
import styled from "styled-components";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import EquationInput from ".";
import EquationInputError from "../EquationInputError";
import { EquationInputState } from "./types";
import { TaskContentErrorType } from "../../store/task/types";

storiesOf("EquationInput", module)
  .add("basic", () => <EquationInput onSubmit={action("onSubmit")} />)
  .add("submitting", () => (
    <EquationInput state={EquationInputState.SUBMITTING} />
  ))
  .add("with EquationInputError", () => {
    const error = {
      type: TaskContentErrorType.UNKNOWN_TOKEN,
      position: 4,
      token: null
    };

    const ErrorContainer = styled.div`
      padding-left: 15px;
    `;

    return (
      <div>
        <EquationInput />
        <ErrorContainer>
          <EquationInputError error={error} />
        </ErrorContainer>
      </div>
    );
  });
