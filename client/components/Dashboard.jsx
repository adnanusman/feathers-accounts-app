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
    this.changeBalance = this.changeBalance.bind(this);
    this.disableLoading = this.disableLoading.bind(this);
    this.addEntry = this.addEntry.bind(this);
    this.handleCategories = this.handleCategories.bind(this);
    this.handleSources = this.handleSources.bind(this);
    this.handleHidden = this.handleHidden.bind(this);
    this.getData = this.getData.bind(this);

    this.state = {
      isLoading: true,
      addSources: false,
      addCategories: false,
      errorMessage: '',
      successMessage: '',
      hidden: true
    }
  }

  componentWillMount() {
    this.setBalance();
    this.getData('source')
      .then(response => {
        this.sources = response;
      });

    this.getData('categories')
      .then(response => {
        this.categories = response;
      })

    this.getData('entries')
      .then(response => {
        this.entries = response;
      })
      .then(() => {
        this.disableLoading();
      })
  }

  changeBalance(type, amount, del = false) {
    let newBalance;
    
    if(del === false) {
      newBalance = type === 'Income' ? parseInt(this.balance) + parseInt(amount) : parseInt(this.balance) - parseInt(amount);
    } else {
      newBalance = type === 'Income' ? parseInt(this.balance) - parseInt(amount) : parseInt(this.balance) + parseInt(amount);
    }
  
    this.client.service('balance')
      .find({
        query: {
          personId: {
            $eq: this.userId
          }
        }
      })
      .then(response => {
        const balanceId = response.data[0].id;

        this.client.service('balance')
          .patch(balanceId, {
            currentBal: newBalance
          })
          .then(response => {
            this.balance = response.currentBal;

            // just to update the state and reset the component
            this.setState({
              errorMessage: ''
            })
          })
      })
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
          })
        } else {
          this.balance = response.data[0].currentBal;
        }
      })
  }

  getData(serviceName) {
    return new Promise((resolve, reject) => { 
      this.client.service(serviceName)
      .find({
        query: {
          personId: {
            $eq: this.userId
          }
        }
      })
      .then(response => {
        if(response.data.length === 0) {
          resolve(null);
        } else {
          resolve(response.data);
        }
      })
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

    const title = document.entriesForm.title.value;
    const category = document.entriesForm.category.value;
    const type = document.entriesForm.type.value;

    let source;
    if(document.entriesForm.source) {
      source = document.entriesForm.source.value;
    } else {
      source = '';
    }

    const amount = document.entriesForm.amount.value;

    if(title === '') {
      this.setState({
        errorMessage: 'A title is required',
        successMessage: ''
      })
      return;
    }

    if(amount === '') {
      this.setState({
        errorMessage: 'An amount is required',
        successMessage: ''
      })
      return;
    }

    this.client.service('entries')
      .create({
        personId: this.userId,
        title,
        categoryId: category,
        type,
        source,
        amount
      })
      .then(() => {
        this.getData('entries')
          .then(response => {
            this.entries = response;

            this.changeBalance(type, amount);

            this.setState({
              successMessage: 'Successfully added entry',
              errorMessage: ''
            })

            document.entriesForm.reset();
          })
      })
      .catch(() => {
        this.setState({
          errorMessage: 'There was an error adding this entry',
          successMessage: ''
        })
      })
  }

  deleteEntry(entryId, type, amount) {
    this.client.service('entries')
      .remove(entryId)
      .then(() => {
        this.getData('entries')
        .then(response => {
          this.entries = response;
          this.changeBalance(type, amount, true);

          this.setState({
            successMessage: 'Deleted Entry Successfully.',
            errorMessage: ''
          })
        })
      })
      .catch(() => {
        this.setState({
          errorMessage: 'There was a problem, try again.',
          successMessage: ''
        })
      })
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

  handleHidden() {
    this.setState({
      hidden: !this.state.hidden
    })
  }
  
  render() {
    const { isLoggedIn, balance, sources, categories, entries } = this;
    let { addSources, addCategories, isLoading, errorMessage, successMessage, hidden } = this.state;

    if(isLoading) {
      return (
        <div>Loading...</div>
      )
    }

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
          <div className="main-content">
            <div className="form-container">
              <form name="entriesForm" onSubmit={this.addEntry}>
                <fieldset>
                  <label htmlFor="title">Title:</label>
                  <input type="text" name="title" id="title" placeholder="title" />
                </fieldset> 
                
                <fieldset>
                  <label htmlFor="category">Category:</label>
                  <select name="category" id="category">
                  {categories && categories.map(category => {
                    return (
                      <option key={category.id} value={category.id}>{category.title}</option>
                    )
                  })}

                  </select>
                </fieldset>          

                <fieldset>
                  <label htmlFor="type">Type:</label>
                  <select name="type" id="type" onChange={this.handleHidden}>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </fieldset>
                
                {hidden ? ( 
                  <div></div> 
                ) : ( 
                  <fieldset>
                    <label htmlFor="source">Source:</label>
                    <select name="source" id="source">
                    {sources && sources.map(source => {
                      return (
                        <option key={source.id} value={source.id}>{source.title}</option>
                      )
                    })}
                    </select>
                  </fieldset>
                )}

                <fieldset>
                  <label htmlFor="amount">Amount:</label>
                  <input type="number" name="amount" id="amount" placeholder="Enter Amount"></input>
                </fieldset>
                
                <button type="submit">Add Entry</button>         
              </form>

              {errorMessage && 
                <div className="error-message">
                  {errorMessage}
                </div>
              }

              {successMessage && 
                <div className="success-message">
                  {successMessage}
                </div>
              }
            </div>
            <div className="entry-container">
              <table>
                <tbody>
                  <tr>
                    <th>Created</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Source</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                  
                  {entries ? ( entries.map(entry => {
                    if(categories) {
                      return categories.map(category => {
                        if(entry.categoryId === category.id) {
                          let categoryTitle = category.title;
                          // if its an expense entry, check for the source, otherwise ignore it as it will be empty.
                          if(sources && entry.type === 'Expense') {
                            return sources.map(source => {
                              if(parseInt(entry.source) === source.id) {        
                                let sourceTitle = source.title;
                                return (
                                  <tr key={entry.id}>
                                    <td>{entry.createdAt}</td>
                                    <td>{entry.title}</td>
                                    <td>{categoryTitle}</td>
                                    <td>{sourceTitle}</td>
                                    <td>{entry.type}</td>
                                    <td>${entry.amount}</td>
                                    <td><button onClick={() => this.deleteEntry(entry.id, entry.type, entry.amount)}>Delete</button></td>  
                                  </tr>
                                )  
                              }
                            })
                          } else {
                            return (
                              <tr key={entry.id}>
                                <td>{entry.createdAt}</td>
                                <td>{entry.title}</td>
                                <td>{categoryTitle}</td>
                                <td>{entry.source}</td>
                                <td>{entry.type}</td>
                                <td>${entry.amount}</td>
                                <td><button onClick={() => this.deleteEntry(entry.id, entry.type, entry.amount)}>Delete</button></td>  
                              </tr>
                            )  
                          }
                        }
                      })
                    }
                  })) : (
                    <tr>
                      <td>There were no entries found..</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>        
        ))}         
      </div>          
    );
  }
}
 
export default Dashboard;