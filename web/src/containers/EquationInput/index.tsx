import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { withRouter } from 'react-router-dom';
import { History } from 'history';
import { submitTask } from '../../store/task/actions';
import EquationInput from '../../components/EquationInput';
import { RootState } from '../../store/types';
import { EquationInputState } from '../../components/EquationInput/types';

interface EquationInputContainerProps {
    dispatch: Dispatch,
    history: History,
    state: EquationInputState
}

const mapStateToProps = (state: RootState) => {
    return {
        state: state.task.submitting ? EquationInputState.SUBMITTING : EquationInputState.NORMAL
    };
};

const EuqationInputContainer = ({ history, dispatch, ...props }: EquationInputContainerProps) => {

    const onSubmit = (content: string) => {
        dispatch(submitTask(content, history));
    }

    return <EquationInput
        {...props}
        onSubmit={onSubmit}
    />;
}

export default withRouter(connect(mapStateToProps, null)(EuqationInputContainer));