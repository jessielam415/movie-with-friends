import React, { Component } from "react";
import './Styles/Admin.css'
import UsersDatabase from './Admin/UsersDatabase';
import MoviesDatabase from './Admin/MoviesDatabase';
import PostsDatabase from "./Admin/PostsDatabase";
import ENV from './../../config.js';
const API_HOST = ENV.api_host

//Admin page component
export default class Admin extends Component {

  constructor() {
    super();
    this.state = {
      users: [],
      movies: [],
      posts: []
    }
  }

  //get all user information 
  getUsers = () => {
		fetch(`${API_HOST}/user`, {
			method: "GET",
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then((response) => {
			return response.json()
		})
		.then((json) => {
			const users = json;
			this.setState({
				users: users
			})
			return json;
		})
  }

  //get all movie information 
  getMovies = () => {
		fetch(`${API_HOST}/movie`, {
			method: "GET",
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then((response) => {
			return response.json()
		})
		.then((json) => {
			const movies = json;
			this.setState({
				movies: movies
			})
			return json;
		})
  }

  //get all post information 
  getPosts = () => {
		fetch(`${API_HOST}/post`, {
			method: "GET",
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then((response) => {
			return response.json()
		})
		.then((json) => {
			const posts = json;
			this.setState({
				posts: posts
			})
			return json;
		})
  }

	componentDidMount = () => {
    this.getUsers();
    this.getMovies();
    this.getPosts();
  }
  
  // Deletes user and all posts by that user from database
  deleteUser = (username, e) => {
    fetch(`${API_HOST}/deleteUser/${username}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 200) {
        console.log("Deleted");
        this.getUsers();
      } else {
        alert('Could not delete user')
      }
    });
    
    this.postDeletionHelper(username);

    this.followDeletion(username);

    this.getPosts();
  }

  // Changes the username of a user
  changeUsername = (userObject, e) => {
    e.preventDefault()
    const user = this.state.users.find((user) => user.username == userObject.username)
    if (this.state.users.some((user) => user.username == userObject.newUsername)) {
      alert("This username is already taken!")
    }
    else {
      const userID = user._id;
      const data = {
        "path": "username",
        "value": userObject.newUsername
      }
      console.log(user.username)
      const url1 = `${API_HOST}/user/${userID}`;
      const request = new Request(url1, {
        method: 'PATCH',
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data)
      });
      console.log(request);
      fetch(request)
        .then((res) => {
          if (res.status === 200) {
            alert("Changed username")
            this.getUsers();
          } else {
            alert("Could not change username")
          }
        }).catch((error) => {
          alert("Could not change username")
        });
    } 
  }

  // Changes the password of a user
  changePassword = (userObject, e) => {
    e.preventDefault()
    // url for request (updating password in db)
    const url = '/user/password/admin/' + userObject.username
    const user = this.state.users.find(element => element.username === userObject.username)
    
    // The data we are going to send in our request
    let data = {
      newPassword: userObject.newPassword
    }
    
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
      method: 'PATCH', 
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
    });

    // Send the request with fetch()
    fetch(request)
    .then((res) => {
      console.log(res)
    
      if (res.status === 200) {

          alert('Password change confirmed!')
          this.getUsers();
      } else {
        alert('Password change failed!')
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  // Changes a regular user to an admin
  changeToAdmin = (username, event) => {
		const user = this.state.users.find((user) => user.username == username)
    const userID = user._id;
    const data = {
      "path": "is_admin",
      "value": true
    }
    const url1 = `${API_HOST}/user/${userID}`;
    const request = new Request(url1, {
      method: 'PATCH',
      headers: {    "Content-type": "application/json"  },
      body: JSON.stringify(data)
    });
    console.log(request);
    fetch(request)
      .then((res) => {
        if (res.status === 200) {
          alert("Added as admin!")
          this.getUsers();
        } else {
          console.log("Could not add as admin")
        }
      }).catch((error) => {
        console.log("Could not add as admin")
      });
  }

  // Add a new user
  addUser = (userObject, event) => {
    event.preventDefault()
    const existingUsername = this.state.users.filter((user) => {
      if (userObject.username == user.username) {
        return user;
      }
    })
    const blankInput = this.state.users.filter((user) => {
      if (userObject.username == "" || userObject.first_name == "" || userObject.last_name == "" || userObject.password == ""
          || userObject.age == "") {
        return user;
      }
    })
    if (existingUsername.length != 0) {
      alert("This username is taken!")
    } else if (blankInput.length != 0) {
      alert("Please fill in all fields!")
    } else if (isNaN(userObject.age)) {
      alert("Please enter a valid age")
    } else if (parseInt(userObject.age) < 0 || parseInt(userObject.age) > 200) {
      alert("Please enter a valid age")
    } else {
			// The data we are going to send in our request
			let data = {
				firstName: userObject.first_name,
				lastName: userObject.last_name,
				age: parseInt(userObject.age),
				gender: userObject.gender,
				username: userObject.username,
        password: userObject.password,
        is_admin: userObject.is_admin
			}

			// Create our request constructor with all the parameters we need
      if (userObject.is_admin) {
          // Use the admin user creation route to create admin users 
        	const url = `${API_HOST}/user/admin`;
          const request = new Request(url, {
          method: 'post', 
          body: JSON.stringify(data),
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
        });
        // Send the request with fetch()
        fetch(request)
        .then((res) => {
          if (res.status === 200) {
            // If user was added successfully, tell the user.
            alert('You have successfully added a new user');
            this.getUsers();
          } else {
            // If server couldn't add the user, tell the user.
            console.log('Could not add new user')
          }
        }).catch((error) => {
          console.log(error)
        })
      } else {
        // Use the regular user creation route to create regular users 
        const url = `${API_HOST}/user`;
        const request = new Request(url, {
          method: 'post', 
          body: JSON.stringify(data),
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
        });
        // Send the request with fetch()
        fetch(request)
        .then((res) => {
          if (res.status === 200) {
            // If user was added successfully, tell the user.
            alert('You have successfully added a new user')
            this.getUsers();
          } else {
            // If server couldn't add the user, tell the user.
            console.log('Could not add new user')
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    } 
  }
  
  // Add a new movie
  addMovie = (movieObject, event) => {
    event.preventDefault()
    const existingMovie = this.state.movies.filter((movie) => {
      if (movieObject.title == movie.title) {
        return movie;
      }
    })
    const blankInput = this.state.movies.filter((movie) => {
      if (movieObject.title == "" || movieObject.runtime == "" || movieObject.ageRating == ""
        || movieObject.synopsis == "" || movieObject.date == "" || movieObject.genre == "" || movieObject.image == "") {
        return movie;
      }
    })
    if (existingMovie.length != 0) {
      alert("This movie is already in database!")
      event.preventDefault()
    } else if (blankInput.length != 0) {
      alert("Please fill in all fields")
      event.preventDefault()
    } else {
      let data = {
				title: movieObject.title,
				runtime: movieObject.runtime,
				ageRating: movieObject.ageRating,
        synopsis: movieObject.synopsis,
        date: movieObject.date,
				genre: movieObject.genre,
				image: movieObject.image
			}
      const url = `${API_HOST}/movie`;
      const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
      });
      // Send the request with fetch()
      fetch(request)
      .then((res) => {
        if (res.status === 200) {
          // If movie was added successfully, tell the user.
          alert('You have successfully added a new movie')
          this.getMovies();
        } else {
          // If server couldn't add the movie, tell the user.
          console.log('Could not add new movie')
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }

  deleteMovie = (id, e) => {
    fetch(`/movie/${id}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 200) {
        console.log("Deleted");
        this.getMovies();
      } else {
        alert('Could not delete user')
        console.log(res.status)
      }
    });
  }

  // Delete a post
  deletePost = (id, e) => {
    fetch(`${API_HOST}/post/${id}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 200) {
        console.log("Deleted");
        this.getPosts();
      } else {
        alert('Could not delete post')
      }
    });
  }

  // Helper function of deleteUser
  postDeletionHelper = (username) => {
    fetch(`${API_HOST}/posts/${username}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 200) {
        this.getPosts();
      } else {
        alert('Could not delete post')
      }
    });
  }

  followDeletion = (username) => {
    fetch(`${API_HOST}/delete/user/follow/${username}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 200) {
        this.getPosts();
      } else {
        alert('Could not delete post')
      }
    });
  }
  
  render() {
    return (
      <div className="Admin">
        <div className="database">
          <UsersDatabase users={this.state.users} deleteUser={this.deleteUser} changeToAdmin={this.changeToAdmin} addUser={this.addUser} changeUsername={this.changeUsername} changePassword={this.changePassword} />
        </div>
        <div className="database">
          <PostsDatabase posts={this.state.posts} users={this.state.users} movies={this.state.movies} deletePost={this.deletePost} />
        </div>
        <div className="database">
          <MoviesDatabase movies={this.state.movies} addMovie={this.addMovie} deleteMovie={ this.deleteMovie}/>
        </div> 
      </div>
    );
  }
}

