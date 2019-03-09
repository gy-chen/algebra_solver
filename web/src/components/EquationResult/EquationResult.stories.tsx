import React from 'react';
import { storiesOf } from '@storybook/react';
import EquationResult from '.'

storiesOf('EquationResult', module)
    .add('basic', () => <EquationResult />);