import React from 'react';
import styled from 'styled-components';
import { EquationInputErrorProps } from './types';
import { TaskContentErrorType } from '../../store/task/types';

const Container = styled.div``;

const ErrorMessage = styled.div`
    font-family: monospace;
    color: red;
    font-weight: bold;
`;

interface PositionErrorProps {
    position: number
}

const PositionError = styled.div`
    :before {
        font-family: monospace;
        color: red;
        content: '>';
        display: inline-block;
        transform: rotate(-90deg) translateY(${(p: PositionErrorProps) => p.position}ch);
    }
`;


/**
 * EquationInputError
 * 
 * props:
 *   - error: TaskContentError
 */
const EquationInputError = (props: EquationInputErrorProps) => {
    const { error } = props;
    return (
        <Container>
            {renderPositionError(error.position)}
            {renderErrorMessage(error.type, error.token)}
        </Container>
    );
}

const errorMessages = {
    [TaskContentErrorType.EMPTY]: 'Please input equation',
    [TaskContentErrorType.UNEXPECTED_END]: 'Please complete your equation',
    [TaskContentErrorType.UNEXPECTED_TOKEN]: 'Unexpected token: ',
    [TaskContentErrorType.UNKNOWN_TOKEN]: 'Unknown token',
    [TaskContentErrorType.OTHER]: 'Error'
};

const renderErrorMessage = (errorType: TaskContentErrorType, token: string | null) => {
    let errorMessage = errorMessages[errorType];
    if (token !== null) {
        errorMessage = errorMessage + token;
    }
    return <ErrorMessage>{errorMessage}</ErrorMessage>;
}

const renderPositionError = (position: number | null) => {
    if (position === null) {
        return null;
    }
    return <PositionError position={position} />;
}

export default EquationInputError;