import React, { Component } from 'react';

import LoginHelper from './LoginHelper.jsx';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.client = this.props.client;
    this.isLoggedIn = this.props.isLoggedIn;
    this.userId = this.props.userId;

    this.logout = this.logout.bind(this);
    this.setBalance = this.setBalance.bind(this);

    this.state = {
      isLoading: false
    }

    this.setBalance();
  }

  setBalance() {
    const userId = this.userId;

    this.client.service('activity')
      .find({
        query: {
          personId: {
            $eq: userId
          }
        }
      })
      .then(response => {
        if(response.data[0].loginCount === 1) {
          this.client.service('balance')
            .create({
              personId: userId
            })
        } else {
          this.client.service('balance')
            .find({
              query: {
                personId: {
                  $eq: userId
                }
              }
            })
            .then(response => {
              console.log(response);
            })
        }
      })
      .catch((err) => {
        // console.log(err)
      })
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
        <h1>Dashboard</h1>
        {/* <form name="balanceForm" onSubmit={this.addBalance}>
          <input type="text" name="balance" id="balance" />
          <button type="submit">Add to Balance</button>         
        </form> */}

        <button type="button" onClick={this.logout} className="button button-primary block signup">Logout</button>
      </div>      
     );
  }
}
 
export default Dashboard;