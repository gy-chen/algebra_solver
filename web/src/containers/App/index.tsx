import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import EquationInput from '../../containers/EquationInput';
import EquationResult from '../../containers/EquationResult';

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
                <Route path="/task" component={EquationResult} />
                <Route path="/" component={EquationInput} />
            </Switch>
        );
    }
}

export default App;

