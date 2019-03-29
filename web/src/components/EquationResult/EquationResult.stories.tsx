import React from "react";
import { storiesOf } from "@storybook/react";
import EquationResult from ".";

storiesOf("EquationResult", module)
  .add("basic", () => <EquationResult />)
  .add("with task", () => {
    const task = {
      id: "4413",
      state: "DONE",
      content: "x + y = 1",
      result: {
        x: 0.79281,
        y: 0.20719,
        _loss: 0
      }
    };

    return <EquationResult task={task} />;
  })
  .add("wtih high loss task", () => {
    const task = {
      id: "4413",
      state: "DONE",
      content: "x - 4413 = 0",
      result: {
        x: 53,
        _loss: 18000
      }
    };

    return <EquationResult task={task} lossThreshold={0.2} />;
  });
