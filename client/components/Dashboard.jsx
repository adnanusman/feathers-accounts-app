import React, { Component } from 'react';

import LoginHelper from './LoginHelper.jsx';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.client = this.props.client;
    this.isLoggedIn = this.props.isLoggedIn;
    this.logout = this.logout.bind(this);

    this.state = {
      isLoading: false
    }
  }

  async logout() {
    this.setState({
      isLoading: true
    })

    await this.client.logout()
    .then(() => {
      this.isLoggedIn = false; 

      this.setState({
        isLoading: false
      })
    });
  }
  
  render() {
    const isLoggedIn = this.isLoggedIn;

    if(!isLoggedIn) {
      return (
        <LoginHelper client={this.client} />
      )
    }

    return (
      <div>
        <h1>Dashboard test</h1>
        <button type="button" onClick={this.logout} class="button button-primary block signup">Logout</button>
      </div>      
     );
  }
}
 
export default Dashboard;