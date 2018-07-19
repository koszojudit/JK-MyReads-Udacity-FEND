import React from 'react'
import './App.css'
import BookList from "./components/BookList"
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
                <li key={i}>
                  <div className="book">
                    <div className="book-top">
                      <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: book.imageLinks ? `url(${book.imageLinks.thumbnail})` : '' }}></div>
                        <div className="book-shelf-changer">
                          <select>
                            <option value="move" disabled>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                            </select>
                          </div>
                        </div>
                        <div className="book-title">{book.title}</div>
                        <div className="book-authors">{book.authors ? book.authors.toString() : ' '}</div>
                      </div>
                    </li>
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
