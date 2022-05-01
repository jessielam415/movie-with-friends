import React, { Component } from "react";
import SelectSearch from "react-select-search";
import { PieChart } from 'react-minimal-pie-chart';
import SearchResult from "./SearchResult.js";
import {Bar} from "react-chartjs-2"; 
import fuzzySearch from './fuzzySearch.js';
import "./Styles/SearchMovie.css";

import ENV from './../../config.js';
const API_HOST = ENV.api_host

// This will be the base component for the login and signup page
export default class SearchMovie extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentMovie: null,
            searched: false,
            searchTerm: null,
            users: [],
            ratings: [],
            movies: [],
            isLoaded: false
        }
    }

    selectMovie(e) {
        this.setState({
            currentMovie: e
        })
    }
    pieChart(ratingData) {
        if (ratingData.length > 0) {
             let data = [
                {title: '1', value:0, color:"#660707"},
                {title: '2', value:0, color:"#BB1313"},
                {title: '3', value:0, color:"#E61010"},
                {title: '4', value:0, color:"#FF2626"},
                {title: '5', value:0, color:"#EA7575"}
            ];
            for (let i=0; i<5; i++){
                data[i]['value'] =(ratingData.filter(rating => {
                    return parseInt(rating.rating) === i+1;
                })).length;
            }

            return <div className="pie"> <h4 className="pie-title">Breakdown of ratings</h4><PieChart className="pie-chart" data={data} label={({ dataEntry }) => dataEntry.value > 0 ? dataEntry.title + " stars" : ""}/> </div>
        
        } else {
            return <div className="pie"> <h4 className="pie-title">Breakdown of ratings</h4> <div id="no-rating-data-info">No rating data currently available for this title</div></div>
        }
    }

    ratingsByAge(data) {
        let byAge= []
        let fst = data.filter(rating => {
            return 13 <= rating.age  && rating.age <= 15;
        })
        let scnd = data.filter(rating => {
            return 16 <= rating.age  && rating.age <= 20;
        })
        let thrd = data.filter(rating => {
            return 21 <= rating.age && rating.age <= 30;
        })
        let last = data.filter(rating => {
            return rating.age > 30;
        })

        byAge.push({text: '13-15', value: fst.length > 0 ? fst.map(rat => rat.rating).reduce((x,y) => x + y, 0) / fst.length : 0});
        byAge.push({text: '16-20', value: scnd.length > 0 ? scnd.map(rat => rat.rating).reduce((x,y) => x + y, 0) / scnd.length : 0});
        byAge.push({text: '21-30', value: thrd.length > 0 ? thrd.map(rat => rat.rating).reduce((x,y) => x + y, 0) / thrd.length : 0});
        byAge.push({text: '30+', value: last.length > 0 ? last.map(rat => rat.rating).reduce((x,y) => x + y, 0) / last.length : 0});
        return byAge;
    } 

    femBarData() {
        let movieData = this.state.ratings.filter(rating => {
            return rating.title === this.state.currentMovie;
        })
        let ratingsFemale = movieData.filter(rating => {
            return rating.gender === 0;
        })
        let ageData = this.ratingsByAge(ratingsFemale);
        return ageData
    }

    maleBarData() {
        let movieData = this.state.ratings.filter(rating => {
            return rating.title === this.state.currentMovie;
        })
        let ratingsMale = movieData.filter(rating => {
            return rating.gender === 1;
        })
        let ageData = this.ratingsByAge(ratingsMale);
        return ageData
    }

    getMoviesAndRatings = () =>{
        const movies = fetch(`${API_HOST}/movie`)
        .then(response => {return response.json()})
        .then(json => {
            return json;
        });
        const ratings = fetch(`${API_HOST}/post/Rating`)
        .then(response => {return response.json()})
        .then(json => {
            return json;
        });
        const users = fetch(`${API_HOST}/user`)
        .then(response => {return response.json()})
        .then(json => {
            return json
        })

        return Promise.all([movies, ratings, users])
    }

    componentDidMount() {
        let inp = document.getElementById("searchMovie").querySelector("input");
        inp.className = "select-search__input-movie";

        inp.onkeydown = (e) => {
            if (e.key === "Enter"){
                this.setState({
                    currentMovie: null,
                    searched: true,
                    searchTerm: inp.value.toLowerCase(),
                })
                inp.blur();
            }
        }
        this.getMoviesAndRatings().then(([movies, ratings, users]) => {
            ratings.forEach((rating) => {
                const user = users.filter((user) => {
                    return user.username === rating.author
                })[0]
                if (user) {
                    rating.age = user.age;
                    rating.gender = user.gender.toLowerCase() === 'female' ? 0 : user.gender.toLowerCase() === 'male' ? 1 : 2;
                    rating.title = rating.movie;
                    rating.rating = parseInt(rating.rating);
                }
            })
            const mov = this.averageRatings(ratings, movies);
            this.setState({
                users: users,
                ratings: ratings,
                movies: mov,
                isLoaded: true
            })
        })

    }
    
    averageRatings = (ratings, movies) => {
        movies.forEach(movie  => {
            const movieRatings = ratings.filter(rating => {
                return rating.title === movie.title;
            })
            movie["avgRating"] = movieRatings.map(rating => rating.rating).reduce((a,b) => a+b,0) / movieRatings.length;
        });
        return movies
    }

    top5 = () => {
        let bestMovies = this.state.movies.sort((a,b) => (a.avgRating >= b.avgRating) ? -1 : 1);
        return bestMovies.slice(0,6);
    }

    handleUpdate = (currentMovie, searched) => {
        this.setState({currentMovie, searched})
    }
	
	render() {
        let options = this.state.movies.map(movie => {
            const item = {}
            item['name'] = movie.title;
            item['value'] = movie.title;
            item.id = movie._id
            return item;
        });
        options.sort((a,b) => (a.name >= b.name) ? 1 : -1)
        let movieInfo;
        let movie = this.state.movies.filter(mov => {
            return mov.title === this.state.currentMovie
        })[0];
        if (movie) {
            let ratings = this.state.ratings.filter(rating => {
                return rating.title === movie.title
            })
            let pie = this.pieChart(ratings)
            movieInfo = <div>
                <div id="movieInfo">
                    <img className="movie-poster" src={movie.image}/>
                    {pie}
                    <h2>{movie.title}</h2>
                    <p>{movie.date + ', ' + movie.ageRating}</p>
                    <p className="synopsis">{movie.synopsis}</p>
                    <p>Average rating: {Math.round(movie.avgRating * 10) /10}/5</p>
                </div>
                <div id="barCharts">
                    <div className="bar-chart-f">
                        <Bar
                            data ={{
                                labels: this.femBarData().map(age => age.text),
                                datasets: [{
                                    data: this.femBarData().map(age => age.value),
                                    backgroundColor: [
                                    '#EA7575', '#FF2626' , '#E61010', '#BB1313'
                                    ]
                                }]
                            }}
                            options= {{
                                legend: {
                                    display: false
                                },
                                title: {
                                    display: true,
                                    text: 'Avg Rating by age group (F)'
                                },
                                scales: {
                                    yAxes: [{
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Average Rating'
                                        },
                                        ticks: {
                                            beginAtZero: true,
                                            max: 5
                                        }
                                    }],
                                    xAxes: [{
                                        scaleLabel:{
                                            display:true,
                                            labelString: 'Age'
                                        }
                                    }]
                                }
                            }}
                        />
                    </div>
                    <div className="bar-chart-m">
                        <Bar 
                            data ={{
                                labels: this.maleBarData().map(age => age.text),
                                datasets: [{
                                    data: this.maleBarData().map(age => age.value),
                                    backgroundColor: [
                                    '#EA7575', '#FF2626' , '#E61010', '#BB1313'
                                    ]
                                }]
                            }}
                            options= {{
                                legend: {
                                    display: false
                                },
                                title: {
                                    display: true,
                                    text: 'Avg Rating by age group (M)'
                                },
                                scales: {
                                    yAxes: [{
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Average Rating'
                                        },
                                        ticks: {
                                            beginAtZero: true,
                                            max: 5
                                        }
                                    }],
                                    xAxes: [{
                                        scaleLabel:{
                                            display:true,
                                            labelString: 'Age'
                                        }
                                    }]
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        }
        else if (this.state.searched) {
            movieInfo = <SearchResult movies={this.state.movies} searched={true} currentMovie={null} searchTerm={this.state.searchTerm} handleUpdate={this.handleUpdate}/>
        }
        else if (this.state.isLoaded) {
            movieInfo = <SearchResult movies={this.state.movies} searched={false} currentMovie={null} searchTerm={null} handleUpdate={this.handleUpdate} topMovies={this.top5()} />
        }
		return (
			<div>
				<h1>Find a Movie</h1>
                <SelectSearch id="searchMovie" onChange={e => this.selectMovie(e)} options={options} search filterOptions={fuzzySearch} placeholder="Search movie... (hit enter to see all results)" onKeyPress={e=> this.keyDown(e)}/>
                <br/>
                {movieInfo}
			</div>
		);
	}
}