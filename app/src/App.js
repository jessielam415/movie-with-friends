import React from "react";

import { Route, Switch, BrowserRouter } from "react-router-dom";

import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Main from "./components/Main/Main";

import { checkSession } from "./actions/user";

import "./App.css";

class App extends React.Component {

    componentDidMount() {
        checkSession(this); // sees if a user is logged in
    }

    // global state passed down includes the current logged in user.
    state = {
        currentUser: null
    }

    render() {
        const { currentUser } = this.state;
        
        return (
            <BrowserRouter>
                <Switch>
                    <Route
                        exact path={["/", "/login", "/main"] /* any of these URLs are accepted. */ }
                        render={ props => (
                            <div className="app">
                                {!currentUser ? <Login {...props} app={this} /> : <Main {...props} user={currentUser} app={this} />}
                            </div>                   
                            
                        )}
                    />
                    <Route
                        exact path={["/signUp"] /* any of these URLs are accepted. */ }
                        render={ props => (
                            <Signup />
                        )}
                    />
                    <Route render={() => <div>404 Not found</div>} />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;