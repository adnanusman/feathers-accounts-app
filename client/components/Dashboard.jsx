import React, { Component } from 'react';

import LoginHelper from './LoginHelper.jsx';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.client = this.props.client;
    this.isLoggedIn = this.props.isLoggedIn;
    this.userId = this.props.userId;

    console.log('userid', this.userId);

    this.logout = this.logout.bind(this);
    this.setBalance = this.setBalance.bind(this);
    this.disableLoading = this.disableLoading.bind(this);

    this.state = {
      isLoading: true
    }

    this.setBalance();
  }

  setBalance() {
    const userId = this.userId;

    this.client.service('balance')
      .find({
        query: {
          personId: {
            $eq: userId
          }
        }
      })
      .then(response => {
        if(response.data.length === 0) {
          this.client.service('balance')
          .create({
            personId: userId
          })
          .then(response => {
            this.balance = response.currentBal;          
            this.disableLoading();
          })
        } else {
          this.balance = response.data[0].currentBal;
          this.disableLoading();
        }
      })
  }

  disableLoading() {
    this.setState({
      isLoading: false
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
    const balance = this.balance;

    if(!isLoggedIn) {
      return (
        <LoginHelper client={this.client} />
      )
    }

    return (
      <div className="flex-container">
        <div className="header-container">
          <div className="header-left">
            <h1>Dashboard</h1>
          </div>
        
          <div className="header-right">
            <button type="button" onClick={this.logout} className="button button-primary block signup">Logout</button>
            
            <p>Your current balance is: ${balance}</p>
          </div>
        </div>

        {/* <form name="balanceForm" onSubmit={this.addBalance}>
          <input type="text" name="balance" id="balance" />
          <button type="submit">Add to Balance</button>         
        </form> */}

      </div>          
    );
  }
}
 
export default Dashboard;