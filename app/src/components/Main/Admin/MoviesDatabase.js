import { useState, useLayoutEffect } from 'react';
import Movie from './Movie';
import './Styles/MovieDatabase.css';
import ReactPaginate from 'react-paginate';
import AddNewMovie from './AddNewMovie';
import ENV from './../../../config.js';
const API_HOST = ENV.api_host

//This functional component is created with reference to the following tutorials
//https://www.youtube.com/watch?v=mZvKPtH9Fzo&ab_channel=PedroTech
//https://www.youtube.com/watch?v=HANSMtDy508&t=170s&ab_channel=PedroTech

function MoviesDatabase(props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredMovies, setFilteredMovies] = useState(props.movies);
  const [searchBy, setSearchBy] = useState("title");

  const [pageNumber, setPageNumber] = useState(0);

  const moviesPerPage = 4;

  const pagesVisited = pageNumber * moviesPerPage;

  useLayoutEffect(() => {
    const filteredArray = props.movies.filter((movie) => {
        if (searchTerm == "") {
          return movie
        } else if (searchBy == "title" && movie.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          return movie
        } else if (searchBy == "date" && movie.date.includes(searchTerm)) {
            return movie
        } else if (searchBy == "genre" && movie.genre.toLowerCase().includes(searchTerm.toLowerCase())) {
            return movie
        } else if (searchBy == "runtime" && movie.runtime.includes(searchTerm)) {
            return movie
        } else if (searchBy == "ageRating" && movie.ageRating.toLowerCase().includes(searchTerm.toLowerCase())) {
            return movie
        } else if (searchBy == "synopsis" && movie.synopsis.toLowerCase().includes(searchTerm.toLowerCase())) {
            return movie
        }
    });
    setFilteredMovies(filteredArray);
  }, [JSON.stringify(props.movies), searchTerm, props.movies])

  const displayMovies = filteredMovies
      .slice(pagesVisited, pagesVisited + moviesPerPage)
      .map(movie => (
        <Movie movie={movie} deleteMovie={ props.deleteMovie.bind(this, movie._id)}/>
      ));
    
  const pageCount = Math.ceil(filteredMovies.length / moviesPerPage);

  const changePage = ({ selected }) => {
      setPageNumber(selected);
  };

  return (
    <div>
      <h1>Movie Database</h1>
      <AddNewMovie addMovie={props.addMovie} />
      <br></br>
      <label className="labelSearchBy">Search by:</label>
      <select className="searchBy" value={searchBy} onChange={event => { setSearchBy(event.target.value) }}>
        <option value={'title'}>Title</option>
        <option value={'date'}>Date</option>
        <option value={'genre'}>Genre</option>
        <option value={'ageRating'}>Age Rating</option>
        <option value={'synopsis'}>Synopsis</option>
        <option value={'runtime'}>Runtime</option>
      </select>
      <br></br>
      <input className="inputSearchTerm" type="text" placeholder="Enter Search Term" onChange={event => { setSearchTerm(event.target.value) }} />
      {displayMovies}
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"paginationBttnsAdmin"}
        previousLinkClassName={"previousBttnAdmin"}
        nextLinkClassName={"nextBttnAdmin"}
        disabledClassName={"paginationDisabledAdmin"}
        activeClassName={"paginationActiveAdmin"}
        />
    </div>

  );
}

export default MoviesDatabase;
