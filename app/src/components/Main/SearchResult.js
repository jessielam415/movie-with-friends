import React, { Component } from "react";
import Pagination from "react-bootstrap/Pagination";
import "./Styles/SearchResult.css";
import ENV from './../../config.js';
const API_HOST = ENV.api_host

export default class SearchResult extends Component {
    constructor(props){
        super(props);
        this.state = {
            movies: props.movies,
            searchTerm: props.searchTerm,
            searched: props.searched,
            currentMovie: props.currentMovie,
            page: 0,
            topMovies: props.topMovies
        }
    }

    getResults = () => {
        let results;
        if (this.state.searched) {
            results = this.state.movies.filter((movie) =>{
                return movie.title.toLowerCase().includes(this.state.searchTerm);
            })
            results.sort((a,b) => (a.title >= b.title) ? 1 : -1)
        }
        else if (!this.state.searched) {
            results = this.state.topMovies;
        }
        return results
    }

    componentDidUpdate(){
        if (this.props.searchTerm !== this.state.searchTerm && this.props.searched) {
            this.setState({
                searchTerm: this.props.searchTerm,
                searched: true,
                page: 0
            })
        }
    }
    onClick = (title) =>{
        this.setState({
            currentMovie: title,
            searched: false,
        });
        this.props.handleUpdate(title, false)
    }

    updatePage = (pageNumber) => {
        this.setState({page: pageNumber});
        window.scrollTo(0,0);
    }

    render() {
        let results = this.getResults();
        let page = this.state.page;
        let resultsOnPage = results.slice(page * 20, Math.min(page + 20, results.length));
        let pagination = [];
        for (let i = 0; i < Math.ceil(results.length / 20); i++) {
            pagination.push(
                <Pagination.Item key={i} active={i === page} onClick={() => this.updatePage(i)}>
                    {i+1}
                </Pagination.Item>
            )
        }

        return (
            <div>
                <h1>{this.state.searched ? "Results" : "Top rated movies"}</h1>
                {resultsOnPage.map((movie) =>
					<div id={movie.title} className="movie-result shadow p-3 mb-5 bg-white" onClick={() => this.onClick(movie.title)} key={movie.title}>
						<img className="movie-result-image" src={movie.image}/>
                        <h2>{movie.title}</h2>
                        <p>{movie.date + " " +movie.runtime + "min " + movie.ageRating}</p>
                        <p>{movie.synopsis}</p>
                        <p>Average rating: {Math.round(movie.avgRating *10) /10}/5</p>
					</div>
				)}
                <Pagination>{pagination}</Pagination>
            </div>
        )
    }


}