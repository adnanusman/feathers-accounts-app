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
    this.getData = this.getData.bind(this);

    this.state = {
      isLoading: true,
      addSources: false,
      addCategories: false,
      errorMessage: '',
      successMessage: ''
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
    const source = document.entriesForm.source.value;
    const amount = document.entriesForm.amount.value;


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
            this.setState({
              successMessage: 'Successfully added entry',
              errorMessage: ''
            })    
          })
      })
      .catch(() => {
        this.setState({
          errorMessage: 'There was an error adding this entry',
          successMessage: ''
        })
      })
  }

  deleteEntry(entryId) {
    this.client.service('entries')
      .remove(entryId)
      .then(() => {
        this.getData('entries')
        .then(response => {
          this.entries = response;
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
  
  render() {
    const { isLoggedIn, balance, sources, categories, entries } = this;
    let { addSources, addCategories, isLoading, errorMessage, successMessage } = this.state;

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
          <div class="main-content">
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
                  <select name="type" id="type">
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </fieldset>

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
                  </tr>
                  
                  {entries && entries.map(entry => {
                    if(categories) {
                      return categories.map(category => {
                        if(entry.categoryId === category.id) {
                          let categoryTitle = category.title;
                          if(sources) {
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
                                    <td><button onClick={() => this.deleteEntry(entry.id)}>Delete</button></td>  
                                  </tr>
                                )  
                              }
                            })
                          }
                        }
                      })
                    }
                  })}
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