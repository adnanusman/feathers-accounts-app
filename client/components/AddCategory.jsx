import React, { Component } from 'react';

class AddCategory extends Component {
  constructor(props) {
    super(props);

    this.client = this.props.client;
    this.userId = this.props.userId;

    this.getCategories = this.getCategories.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.disableLoading = this.disableLoading.bind(this);

    this.state = {
      isLoading: true,
      errorMessage: '',
      successMessage: ''
    }

    this.getCategories();
  }

  async getCategories() {
    this.client.service('categories')
    .find({
      query: {
        personId: {
          $eq: this.userId
        }
      }
    })
    .then(response => {
      if(response.data.length === 0) {
        this.categories = null;
      } else {
        this.categories = response;
      }
    })
    .catch(() => {
      this.categories = null;
    })
    .then(() => {
      this.disableLoading();
    })
  }

  handleSubmit(e) {
    e.preventDefault();

    const title = document.addCategories.title.value;
    const description = document.addCategories.description.value;

    if(title === '') {
      this.setState({
        errorMessage: 'The title can not be empty.',
        successMessage: ''
      })
    } else {
      this.client.service('categories')
        .create({
          personId: this.userId,
          title,
          description
        })
        .then(() => {
          this.setState({
            successMessage: 'Successfully added category.',
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
    const categories = this.categories;
    let {errorMessage, successMessage, isLoading} = this.state;

    if(isLoading) {
      return (
        <div>Loading...</div>
      )
    }
  
    return ( 
      <div className="flex-container">
        <h1>Add a category</h1>

        <form name="addCategories" onSubmit={this.handleSubmit}>
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

        <h2>Existing categories:</h2>

        {categories ? (
          <table>
            <tbody>
              <tr>
                <th>Title</th>
                <th>Description</th>
              </tr>
          
              {categories.data.map(category => {
                return (
                  <tr>
                    <td key={category.id}>{category.title}</td>
                    <td key={category.id}>{category.description ? category.description : 'no description provided.'}</td>
                  </tr>
                )
              })}
              
            </tbody>         
          </table>
        ) : (
          <p>There were no categories found.</p>
        )}
      </div>


     );
  }
}
 
export default AddCategory;