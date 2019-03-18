import React from 'react';
import { storiesOf } from '@storybook/react';
import EquationInputError from '.';

storiesOf('EquationInputError', module)
    .add('basic', () =>
        <EquationInputError />
    );