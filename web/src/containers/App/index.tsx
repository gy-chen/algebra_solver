import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import EquationInput from '../../components/EquationInput';
import EquationResult from '../../components/EquationResult';

/**
 * App
 * 
 * This component does:
 *  - organize routes
 */
class App extends Component {
    render() {
        return (
            <Switch>
                <Route component={EquationInput} />
                <Route component={EquationResult} />
            </Switch>
        );
    }
}

export default App;

