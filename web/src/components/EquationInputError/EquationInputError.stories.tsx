import React from "react";
import { storiesOf } from "@storybook/react";
import EquationInputError from ".";
import { TaskContentErrorType } from "../../store/task/types";

storiesOf("EquationInputError", module)
  .add("empty", () => {
    const error = {
      type: TaskContentErrorType.EMPTY,
      position: null,
      token: null
    };

    return <EquationInputError error={error} />;
  })
  .add("unexpected end", () => {
    const error = {
      type: TaskContentErrorType.UNEXPECTED_END,
      position: null,
      token: null
    };

    return <EquationInputError error={error} />;
  })
  .add("unexpected token", () => {
    const error = {
      type: TaskContentErrorType.UNEXPECTED_TOKEN,
      position: null,
      token: "x"
    };

    return <EquationInputError error={error} />;
  })
  .add("unknown token", () => {
    const error = {
      type: TaskContentErrorType.UNKNOWN_TOKEN,
      position: 3,
      token: null
    };

    return <EquationInputError error={error} />;
  })
  .add("other", () => {
    const error = {
      type: TaskContentErrorType.OTHER,
      position: null,
      token: null
    };

    return <EquationInputError error={error} />;
  });
