import React, { Component } from 'react';

class AddSource extends Component {
  constructor(props) {
    super(props);

    this.client = this.props.client;
    this.userId = this.props.userId;

    this.getSources = this.getSources.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.disableLoading = this.disableLoading.bind(this);
    this.deleteSource = this.deleteSource.bind(this);

    this.state = {
      isLoading: true,
      errorMessage: '',
      successMessage: ''
    }

    this.getSources();
  }

  async getSources() {
    this.client.service('source')
    .find({
      query: {
        personId: {
          $eq: this.userId
        }
      }
    })
    .then(response => {
      if(response.data.length === 0) {
        this.sources = null; 
      } else {
        this.sources = response;
      }
    })
    .catch(() => {
      this.sources = null;
    })
    .then(() => {
      this.disableLoading();
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
          this.sources = null;

          this.getSources();
          this.setState({
            successMessage: 'Successfully added source.',
            errorMessage: ''
          })
        })
    }
  }

  deleteSource(sourceId) {
    this.client.service('source')
      .remove(sourceId)
      .then(() => {
        this.sources = null;
        
        this.getSources();
        this.setState({
          successMessage: 'Deleted Source Successfully.',
          errorMessage: ''
        })
      })
  }

  disableLoading() {
    this.setState({
      isLoading: false
    })
  }

  render() { 
    const sources = this.sources;
    let {errorMessage, successMessage, isLoading} = this.state;
  
    if(isLoading) {
      return (
        <div>Loading...</div>
      )
    }

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
                  <tr key={source.id}>
                    <td>{source.title}</td>
                    <td>{source.description ? source.description : 'no description provided.'}</td>
                    <td><button onClick={() => this.deleteSource(source.id)}>Delete</button></td>
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
 
export default AddSource;