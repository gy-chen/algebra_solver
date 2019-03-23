import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { EquationResultProps } from './types';

const Container = styled.div`
    animation: pop-up .5s cubic-bezier(0, .98, .49, 1.19) forwards;

    @keyframes pop-up {
        0% {
            transform: scale(.8);
        }

        100% {
            transform: none;
        }
    }
`;

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

interface ResultContainerProps {
    hasLargeLoss: boolean
};

const ResultContainer = styled.div`
    position: relative;

    :before {
        display: ${(p: ResultContainerProps) => p.hasLargeLoss ? 'unset' : 'none'};
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        background: rgba(255, 0, 0, .13);
    }

    :after {
        display: ${(p: ResultContainerProps) => p.hasLargeLoss ? 'unset' : 'none'};
        content: 'Cannot find the solution';
        position: absolute;
        left: 100%;
        top: 0;
        padding-left: 15px;
        white-space: nowrap;
        color: red;
        font-weight: bold;
    }

    & > ${RowContainer}:first-child {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    & > ${RowContainer} > ${RowHead} {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
`;

const Loading = styled.div`
    position: relative;
    min-width: 300px;
    min-height: 200px;
    border-radius: .7em;
    background-color: rgba(0, 0, 0, .05);
    overflow: hidden;

    :before {
        content: '';
        animation: slide 1.25s ease-out backwards infinite;
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(to right,
            transparent, rgba(0, 0, 0, .07) 40%, rgba(0, 0, 0, .09) 50%, rgba(0, 0, 0, .07) 60%, transparent 100%);
        transform: translateX(-100%);
    }

    @keyframes slide {
        0% {
            transform: translateX(-100%);
        }

        100% {
            transform: translateX(100%);
        }
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
    const { task, lossThreshold } = props;
    if (!task) {
        return <Loading />;
    }

    let variableRows = _
        .keys(task.result)
        .filter(v => !v.startsWith('_'))
        .map(k => renderVariableRow(k, task.result[k]));

    let hasLargeLoss = false;
    if (task.result._loss && lossThreshold) {
        hasLargeLoss = task.result._loss > lossThreshold;
    }

    return (
        <Container>
            {renderRow('State', task.state)}
            {renderRow('Equation', task.content)}
            <ResultContainer hasLargeLoss={hasLargeLoss}>
                {renderRow('Result', null)}
                {variableRows}
            </ResultContainer>
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