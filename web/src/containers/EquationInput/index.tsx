import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { withRouter } from "react-router-dom";
import { History } from "history";
import { submitTask } from "../../store/task/actions";
import EquationInput from "../../components/EquationInput";
import { RootState } from "../../store/types";
import { EquationInputState } from "../../components/EquationInput/types";
import { TaskState, TaskContentError } from "../../store/task/types";
import EquationInputError from "../../components/EquationInputError";

interface EquationInputContainerProps {
  dispatch: Dispatch;
  history: History;
  state: EquationInputState;
  error: TaskContentError | null;
}

const mapStateToProps = (state: RootState) => {
  return {
    state:
      state.task.state === TaskState.SUBMITTING
        ? EquationInputState.SUBMITTING
        : EquationInputState.NORMAL,
    error: state.task.error
  };
};

const Container = styled.div`
  width: 40ch;
`;

const EquationInputErrorContainer = styled.div`
  padding-left: 15px;
`;

const EuqationInputContainer = ({
  history,
  dispatch,
  error,
  ...props
}: EquationInputContainerProps) => {
  const onSubmit = (content: string) => {
    dispatch(submitTask(content, history));
  };

  return (
    <Container>
      <EquationInput {...props} onSubmit={onSubmit} />
      {renderEquationInputError(error)}
    </Container>
  );
};

const renderEquationInputError = (error: TaskContentError | null) => {
  if (error === null) {
    return null;
  }
  return (
    <EquationInputErrorContainer>
      <EquationInputError error={error} />
    </EquationInputErrorContainer>
  );
};

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(EuqationInputContainer)
);
