import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import EquationInput from '.';
import { EquationInputState } from './types';

storiesOf('EquationInput', module)
    .add('basic', () =>
        <EquationInput
            onSubmit={action('onSubmit')}
        />)
    .add('submitting', () => <EquationInput state={EquationInputState.SUBMITTING} />);