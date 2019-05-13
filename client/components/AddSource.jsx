import React, { Component } from 'react';

import Dashboard from './Dashboard.jsx';

class addSource extends Component {
  constructor(props) {
    super(props);

    this.client = this.props.client;
    this.userId = this.props.userId;

    this.getSources = this.getSources.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.disableLoading = this.disableLoading.bind(this);

    this.state = {
      isLoading: true,
      errorMessage: '',
      successMessage: ''
    }

    this.getSources();
  }

  async getSources() {
    await new Promise((resolve, reject) => {
      this.client.service('source')
      .find({
        query: {
          personId: {
            $eq: this.userId
          }
        }
      })
      .then(response => {
        this.sources = response;
      })
      .catch(() => {
        this.sources = null;
      })
      .then(() => {
        this.disableLoading();
        resolve();
      })
    })
  }

  handleSubmit(e) {
    e.preventDefault();

    const title = document.addSource.title.value;
    const description = document.addSource.description.value;

    if(title === '') {
      this.setState({
        errorMessage: 'The title can not be empty.',
        successMessage: ''
      })
    } else {
      this.client.service('source')
        .create({
          personId: this.userId,
          title,
          description
        })
        .then(() => {
          this.setState({
            successMessage: 'Successfully added source.',
            errorMessage: ''
          })
        })
    }
  }

  disableLoading() {
    this.setState({
      isLoading: false
    })
  }

  render() { 
    const sources = this.sources;
    console.log(sources)
    let {errorMessage, successMessage} = this.state;
  
    return ( 
      <div className="flex-container">
        <h1>Add a source</h1>

        <form name="addSource" onSubmit={this.handleSubmit}>
          <input type="text" name="title" placeholder="title"></input>
          <input type="text" name="description" placeholder="description"></input>

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

          <button type="submit">Submit</button>
        </form>

        <h2>Existing Sources:</h2>

        {sources ? (
          <table>
            <tbody>
              <tr>
                <th>Title</th>
                <th>Description</th>
              </tr>
          
              {sources.data.map(source => {
                return (
                  <tr>
                    <td>{source.title}</td>
                    <td>{source.description ? source.description : 'no description provided.'}</td>
                  </tr>
                )
              })}
              
            </tbody>         
          </table>
        ) : (
          <p>There were no sources found.</p>
        )}
      </div>


     );
  }
}
 
export default addSource;