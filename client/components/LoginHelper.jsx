import React, { Component } from 'react';

import Dashboard from './Dashboard.jsx';

class LoginHelper extends Component {
  constructor(props) {
    super(props);

    this.client = this.props.client;

    this.checkAuth = this.checkAuth.bind(this);
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);

    this.state = {
      isLoading: true,
      errorMessage: ''
    }

    this.checkAuth();
  }

  getCredentials() {
    const user = {
      email: document.querySelector('[name="email"]').value,
      password: document.querySelector('[name="password"]').value
    };
  
    return user;
  };

  async signup() {
    const credentials = this.getCredentials();
    
    // First create the user
    await this.client.service('people').create(credentials);
    // If successful log them in
    await this.login();
  }

  // check authentication before displaying form
  checkAuth() {
    this.client.authenticate().then((response) => {
      if(response.accessToken.length > 0) {
        // set login status to true if there is a token
        this.isLoggedIn = true;

        // set loading state to false
        this.setState({
          isLoading: false
        });
      }
    }).catch(() => {
      this.setState({
        isLoading: false
      });
    });
  }

  async login(e) {
    if(e) {
      e.preventDefault();
    }
    
    const credentials = this.getCredentials();

    this.setState({
      isLoading: true
    })

    // If we get login information, add the strategy we want to use for login
    const payload = Object.assign({ strategy: 'local' }, credentials);

    await this.client.authenticate(payload)
      .then(() => {
        this.isLoggedIn = true;
      })
      .catch(err => {
        this.setState({
          errorMessage: err.message
        })
      })
      .then(() => {
        this.setState({
          isLoading: false
        })
      })
  };

  render() {
    const {isLoading, errorMessage} = this.state;
    const isLoggedIn = this.isLoggedIn;
    
    if(isLoading) {
      return (
        <div>Loading...</div>
      )
    }

    if(isLoggedIn) {
      return (
        <Dashboard 
          client={this.client} 
          isLoggedIn={isLoggedIn} 
        />
      )
    }
    
    return ( 
      <main class="login container">
        <div class="row">
          <div class="col-12 col-6-tablet push-3-tablet text-center heading">
            <h1 class="font-100">Log in or signup</h1>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
            <form class="form" onSubmit={this.login}>
              <fieldset>
                <input class="block" type="email" name="email" placeholder="email" />
              </fieldset>

              <fieldset>
                <input class="block" type="password" name="password" placeholder="password" />
              </fieldset>

              {errorMessage && 
                <div class="error-message">
                  {errorMessage}
                </div>
              }

              <button type="submit" onClick={this.login} class="button button-primary block signup">
                Log in
              </button>

              <button type="button" onClick={this.signup} class="button button-primary block signup">
                Sign up and log in
              </button>
            </form>
          </div>
        </div>
      </main>
     );
  }
}
 
export default LoginHelper;