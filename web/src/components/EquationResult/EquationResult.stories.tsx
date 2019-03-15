import React from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';
import EquationResult from '.'

storiesOf('EquationResult', module)
    .add('basic', () => <EquationResult />)
    .add('with task', () => {
        const task = {
            id: '4413',
            state: 'DONE',
            content: 'x + y = 0',
            result: {
                x: 0,
                y: 0,
                _loss: 0
            }
        };

        const Container = styled.div`
            width: 250px;
        `;

        return (
            <Container>
                 <EquationResult task={task} />
            </Container>
        );
    });