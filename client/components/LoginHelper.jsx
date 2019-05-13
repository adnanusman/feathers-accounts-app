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
  async checkAuth() {
    await new Promise((resolve, reject) => {
      this.client.authenticate().then((response) => {
        if(response.accessToken.length > 0) {
          // set login status to true if there is a token

          this.client.passport.verifyJWT(response.accessToken)
          .then(response => {
            this.userId = response.userId;

            this.isLoggedIn = true;

            // set loading state to false
            this.setState({
              isLoading: false
            });

            resolve();
          })
        }
      }).catch(() => {
        this.setState({
          isLoading: false
        });
      });
    })
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

    const timestamp = new Date().getTime();

    await new Promise((resolve, reject) => {
      this.client.authenticate(payload)
      .then(response => {
        this.client.passport.verifyJWT(response.accessToken)
        .then(response => {
          this.userId = response.userId;

          // check if user activity exists..
          this.client.service('activity')
            .find({
              query: {
                personId: {
                  $eq: response.userId
                }
              }
            })
            .then(response => {
              // if exists, add a login count to the database..
              this.client.service('activity')
                .patch(response.data[0].id, {
                  loginCount: response.data[0].loginCount + 1,
                })
                .then(() => {
                  this.isLoggedIn = true;
                  this.setState({
                    isLoading: false
                  })
                  resolve();
                })
            })
            .catch(() => {
              // otherwise create the activity entry for this user
              this.client.service('activity')
                .create({
                  personId: this.userId,
                  lastLogin: timestamp
                })
                .then(() => {
                  this.isLoggedIn = true;
                  this.setState({
                    isLoading: false
                  })
                  resolve();
                })
            })
        })
      })
      .catch(err => {
        this.setState({
          errorMessage: err.message,
          isLoading: false
        })
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
          userId={this.userId}
        />
      )
    }
    
    return ( 
      <main className="login container">
        <div className="row">
          <div className="col-12 col-6-tablet push-3-tablet text-center heading">
            <h1 className="font-100">Log in or signup</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
            <form className="form" onSubmit={this.login}>
              <fieldset>
                <input className="block" type="email" name="email" placeholder="email" />
              </fieldset>

              <fieldset>
                <input className="block" type="password" name="password" placeholder="password" />
              </fieldset>

              {errorMessage && 
                <div className="error-message">
                  {errorMessage}
                </div>
              }

              <button type="submit" onClick={this.login} className="button button-primary block signup">
                Log in
              </button>

              <button type="button" onClick={this.signup} className="button button-primary block signup">
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