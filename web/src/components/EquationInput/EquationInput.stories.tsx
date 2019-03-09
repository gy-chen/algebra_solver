import React from 'react';
import { storiesOf } from '@storybook/react';
import EquationInput from '.'

storiesOf('EquationInput', module)
    .add('basic', () => <EquationInput />);