import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { EquationResultProps } from './types';

const Container = styled.div``;

const RowHead = styled.div`
    text-transform: uppercase;
    flex-grow: 1;
    flex-basis: 0;
    line-height: 1.5em;
    padding: .4em .5em; 
    background-color: rgb(224, 225, 226);
`;

const RowContent = styled.div`
    flex-grow: 1.5;
    flex-basis: 0;
    padding: 0 .5em;
`;

const VariableRowHead = styled.div`
    flex-grow: 1;
    flex-basis: 0;
    line-height: 1.5em;
    padding: .4em .5em; 
    text-align: right;
    background-color: rgb(224, 225, 226, .4);
`;

const RowContainer = styled.div`
    min-width: 300px;
    display: flex;
    align-items: baseline;
    border-bottom: solid 1px;
    border-bottom-color: rgba(0, 0, 0, .15);
    background: white;

    &:first-child {
        border-top-left-radius: .7em;
        border-top-right-radius: .7em;
    }

    &:first-child > ${RowHead} {
        border-top-left-radius: .7em;
    }

    &:last-child {
        border-bottom-left-radius: .7em;
        border-bottom-right-radius: .7em;   
    }

    &:last-child > ${VariableRowHead} {
        border-bottom-left-radius: .7em;
    }
`;

/**
 * EquationResult
 * 
 * Display equation solve result.
 * 
 * Props:
 *   - lossThreshod: threshold of loss value, if loss if greater than this threshold,
 *                   then the equation solve result will be mark as incorrect.
 *   - task: task object that retrived from backend.
 */
const EquationResult = (props: EquationResultProps) => {
    const { task } = props;
    if (!task) {
        // TODO return segment
        return null;
    }

    let variableRows = _
        .keys(task.result)
        .filter(v => !v.startsWith('_'))
        .map(k => renderVariableRow(k, task.result[k]));

    return (
        <Container>
            {renderRow('State', task.state)}
            {renderRow('Equation', task.content)}
            {renderRow('Result', null)}
            {variableRows}
        </Container>
    );
}

const renderVariableRow = (variable: string, result: number | null | undefined) => {
    return (
        <RowContainer key={variable}>
            <VariableRowHead>{variable}</VariableRowHead>
            <RowContent>{result}</RowContent>
        </RowContainer>
    );
}

const renderRow = (title: string, content: string | null) => {
    return (
        <RowContainer>
            <RowHead>{title}</RowHead>
            <RowContent>{content}</RowContent>
        </RowContainer>
    );
}

export default EquationResult;