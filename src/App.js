import React, {Component} from 'react'
import './App.css'
import BookList from "./components/BookList"
import Book from "./components/Book"
import {Route, Link} from 'react-router-dom'
import * as BooksAPI from './BooksAPI'

class BooksApp extends Component {
  state = {
    books: [],
    searchResults: [],
  }

  // Update shelf of the books
  updateShelf = (book, shelf) => {
    let books;
    if (this.state.books.findIndex(b => b.id === book.id) > 0) {
      // Change position of existing books
      books = this.state.books.map(b => {
        if (b.id === book.id) {
          return {...book, shelf}
        } else {
          return b
        }
      })
    } else {
      // Add a new book to the shelf
      books = [...this.state.books, {...book, shelf}]
    }

    this.setState({books})

    BooksAPI.update(book, shelf).then((data) => {
      // shelf updated on the server
    })
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
    //const { books , searchResults } = this.state
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
            <Book key={i} book={book}
              onUpdateBook={(book, shelf) => this.updateShelf(book, shelf)}/>
          ))}
          </ol>

        </div>
      )}/>

      <Route exact path="/" render={() => (
        <BookList books={this.state.books}
          onUpdateShelf={(book, shelf) => this.updateShelf(book, shelf)}/>
      )}/>

      </div>
    )
  }
}

export default BooksApp
