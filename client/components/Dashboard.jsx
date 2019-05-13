import React, { Component } from 'react';

import LoginHelper from './LoginHelper.jsx';
import AddSource from './AddSource.jsx';
import AddCategory from './AddCategory.jsx';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.client = this.props.client;
    this.isLoggedIn = this.props.isLoggedIn;
    this.userId = this.props.userId;

    this.logout = this.logout.bind(this);
    this.setBalance = this.setBalance.bind(this);
    this.disableLoading = this.disableLoading.bind(this);
    this.addEntry = this.addEntry.bind(this);
    this.handleCategories = this.handleCategories.bind(this);
    this.handleSources = this.handleSources.bind(this);

    this.state = {
      isLoading: true,
      addSources: false,
      addCategories: false
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

  addEntry(e) {
    e.preventDefault();

    console.log(e);
  }

  handleSources(e) {
    e.preventDefault();

    this.setState({
      addSources: true,
      addCategories: false
    })
  }
  
  handleCategories(e) {
    e.preventDefault();
    
    this.setState({
      addCategories: true,
      addSources: false
    })
  }
  
  render() {
    const isLoggedIn = this.isLoggedIn;
    const balance = this.balance;
    let {addSources, addCategories} = this.state;

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


        <div>
          <button onClick={this.handleCategories}>Add Category</button>
          <button onClick={this.handleSources}>Add Source</button>
        </div>
        {addSources ? ( 
          <AddSource 
            client={this.client}
            userId={this.userId} 
          />
        ) : (addCategories ? (
          <AddCategory 
            client={this.client}
            userId={this.userId} 
          />
        ) : (
          <form name="entriesForm" onSubmit={this.addEntry}>
            <fieldset>
              <input type="text" name="title" id="title" placeholder="title" />
            </fieldset> 
            
            <fieldset>
              <select name="category">
                <option value="1">Service 1</option>
                <option value="2">Service 2</option>
              </select>
            </fieldset>          
            
            <fieldset>
              <select name="type">
                <option value="Income" defaultValue>Income</option>
                <option value="Income">Expense</option>
              </select>
            </fieldset>

            <fieldset>
              <select name="source">
                <option value="1">Source 1</option>
                <option value="2">Source 2</option>
                <option value="3">Source 3</option>
              </select>
            </fieldset>

            <fieldset>
              <input type="number" name="amount" id="amount" placeholder="Enter Amount"></input>
            </fieldset>
            
            <button type="submit">Add Entry</button>         
          </form>
        ))}
      </div>          
    );
  }
}
 
export default Dashboard;