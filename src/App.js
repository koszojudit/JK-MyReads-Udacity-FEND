import React from 'react'
import './App.css'
import BookList from "./components/BookList"
import Book from "./components/Book"
import {Route, Link} from 'react-router-dom'
import * as BooksAPI from './BooksAPI'

class BooksApp extends React.Component {
  state = {
    books: [],
    searchResults: [],
  }

  // Get the books from the API before loading main screen
  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({books:books})
    })
  }

  updateResults = (searchExpression) => {
    if (searchExpression) {
      BooksAPI.search(searchExpression).then(books => {
        if (books.error) {
          this.setState({ searchResults: [] })
        } else {
          this.setState({ searchResults: books })
          console.log(books)
        }
      })
    } else {
      this.setState({ searchResults: [] })
    }
  }

  render() {
    const { books , searchResults } = this.state
    return (
      <div className="app">

        <Route exact path="/search" render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link className="close-search" to="/">Close</Link>
              <div className="search-books-input-wrapper">
                  <input type="text"
                    placeholder="Search by title or author"
                    onChange={(event) => this.updateResults(event.target.value)}
                  />
              </div>
            </div>

            <ol className="books-grid">
              {this.state.searchResults.map((book, i) => (
                <Book key={i} book={book}/>
                  ))}
            </ol>

          </div>
        )}/>

        <Route exact path="/" render={() => (
          <BookList/>
        )}/>

      </div>
      )
    }
  }

  export default BooksApp
