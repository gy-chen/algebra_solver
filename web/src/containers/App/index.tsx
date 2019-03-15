import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import EquationInput from '../../containers/EquationInput';
import EquationResult from '../../containers/EquationResult';


const Layout = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, .05);
`;

/**
 * App
 * 
 * This component does:
 *  - organize routes
 */
class App extends Component {
    render() {
        return (
            <Layout>
                <Switch>
                    <Route path="/task" component={EquationResult} />
                    <Route path="/" component={EquationInput} />
                </Switch>
            </Layout>
        );
    }
}

export default App;

