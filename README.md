# Viewing Our Webapp Online

Our app is deployed at: https://nameless-refuge-86107.herokuapp.com/

To update the app locally, make changes and then run the following:
```
git add ...
git commit ...
git push heroku main
```
# Viewing Our Database

To view our database and collections, you can go to MongoDB Atlas (https://account.mongodb.com/account/login?nds=true) and sign in with the below credentials:

`Email: csc309mongodb@outlook.com`

`Password: 309password309`

If for any reason is it required during sign in, below are the credentials for our MongoDB Database User:

`Username: dbUser`

`Password: dbUserPassword`


# Starting the Webapp Locally
To start the webapp locally, first clone the repository onto your local machine. Then, using the command line, navigate into the "team12" project folder, and then navigate into the “app” directory. Then, you can type:

`npm install`

and

`npm start`

Then navigate to `http://localhost:3000` on whatever internet browser you are using, and you should be able to see our webapp.
# Using the Webapp
## Login Page & Sign Up Page
When you first run the webapp, you will see a login page. You can choose to either log in, or click “Don’t have an account? Sign up here!” to be brought to the sign up page. Signing up is as simple as filling out the required information (as long as the username isnt already taken!). Once you signup and receive a confirmation message, you can go back to the log in page by clicking “Already have an account? Log in here!” and logging in as the user you just created. 
#### Regular User
To log in as a regular user, you can use the below credentials:

`Username: user`

`Password: user`

you can also signup as a new user using your own credentials using the signup page. 

#### Admin User
To log in as an admin, you can use the below credentials:

`Username: admin`

`Password: admin`


## Timeline tab (Regular User and Admin User)
After logging in, you will be brought to the timeline. On the timeline, you will see all of the posts of people you follow as well as of admins (so if you don't follow anyone, you'll only see admin posts!). If there are any poll post types on your timeline, you can interact with the poll by selecting an option. You can also interact with the Watch With Me post types by clicking the link provided in the post. If you want to make your own post, yu can click on the “Create A Post” button on the top right corner of the page, and choose between either a “Watch With Me”, “Poll”, “List” or “Rating” post type. Entering the required information for the post and then clicking “Submit Your Post!” will then exit the pop-up and push your new post to the database for your followers to see! Just refresh the page to see your new post on the timeline.
## Profile Page tab (Regular User and Admin User)
You can also navigate to your profile page, where you will be able to see your profile picture, the number of users you are following and the number of users that are following you, as well as your recent activity. Your recent activity is a collection of your most recent posts, and you can click the "load more" button to keep seeing older and older posts. You can also click on the settings icon beside your profile picture, which will bring up a pop-up and allow you to change your profile picture (you can select from 8 different pre-defined images, where every column is a different category of picture (simple, anime, disney, real actors)), your first name, your last name, and your password. You are also able to log out of the application from this settings page.
## Find Friends tab (Regular User and Admin User)
You can navigate to the Find Friends tab, and click on the “Search Username” prompt under "Find New Friends" to bring up all of the users that are stored in the database, and you can then follow any of these users. You can also see recommended friends under the "Recommended Friends" section and follow them too. Following more users will make your following count (displayed on your profile page) increase. Lastly, on the bottom of the page you can see the list of the people you follow (who you can unfollow) as well as those who follow you.
## Search Movie tab (Regular User and Admin User)
You can navigate to the Search Movie tab, where you will see a "Search Movie" prompt as well as a list of the top 5 rated (average user rating) movies in our database (this list is shown before the user selects or searches for a title). You can then hit enter on the “Search movie” prompt to see all of the movies stored in our datbase as a list of cards containing their movie cover, release date, synopsis, average user rating and age rating. You can then select one of the movies that appears in this list where you will be shown imformation and statistics about the movie, such as the rating distribution among genders. Instead of hitting on enter on the "Search Movie" prompt, you can also select a movie from the dropdown, or start typing in the movie name and then hitting enter to see all movies that begin with the characters you wrote.
## Admin tab (Admin User Only)
Only the admin can access this tab. Navigating to this tab will allow you to perform various admin functionalities, such as adding new users, deleting users, deleting posts, adding new movies, etc. You can also search specific users (by username, name, first name, last name, gender, and age), posts (by poster username, movie or title/description) and movies (by title, genre, date, age, rating, etc).

# Route Overview

All routes return a status code of 200 if successful or other depending on the error (400, 500, etc.)

### User Routes

- ```app.post('/user', ... ) ``` creates a new user in our database. It expects a request body like below and returns the user created:
```
{
firstName: req.body.firstName,
lastName: req.body.lastName,
username: req.body.username,
password: req.body.password,
age: req.body.age,
gender: req.body.gender,
is_admin: req.body.is_admin
}
```
- ```app.post('/user/login', ... ) ``` logs in the user in the database by creating a new session. It expects a request body like below and returns the user:
```
{
username: req.body.username,
password: req.body.password
}
```
- ``` app.post('/user/:username/:follow_username') ``` Add username to follow_username's followers list and follow_username to username's following list. Returns both updated users and the full list of users.

- ```app.patch('/user/firstname/:userid', ...) ``` is used to update a users first name within our database. It returns the updated user and takes the following body:
```
{ 
firstName: req.body.firstName
}
```
- ```app.patch('/user/lastname/:userid', ...) ``` is used to update a users last name within our database. It returns the updated user and takes the following body:
```
{ 
lastName: req.body.lastName
}
```
- ```app.patch('/user/password/:username', ...) ``` is used to update a users last name within our database. It returns the updated user and takes the following body:
```
{ 
password: req.body.password
}
```
- ```app.patch('/user/password/admin/:username', ...) ``` is used to update the password for user with username `username` for the admin functionality. It takes the following body:
```
{ 
password: req.body.password
}
```
- ```app.patch('/user/avatar/:userid', ...) ``` is used to update a users last name within our database. It returns the updated user and takes the following body:
```
{ 
avatar: req.body.avatar
}
```

- ```app.get('/user', ...) ``` returns all of the users in our database. Returns a list of them back to the frontend.
- ```app.get('/user/:userid', ...) ``` returns the information of one user that is stored in our database. Returns a json to the frontend.
- ```app.get('/findUser/:username', ...) ``` returns specific status codes based on whether or not a user in our database has the specified username. 
- ```app.get('/user/logout', ...) ``` logs out a user and destroys the session that was made when a user logged in.
- ```app.get('/users/check-session', ...) ``` checks if the user is logged into the session. 

- ``` app.delete('/user/:username/:following_username') ``` Remove following_username from username's following list and username from following_username's followers list if applicable. Returns both updated users and the full list of users.

- ``` app.delete('/deleteUser/:username') ``` Deletes the user with username from the User database and returns the status code

- ``` app.patch('/user/:id') ``` is used to update a specific field of a user within our database. It returns the updated user and takes the following body: 
```
{
path: req.body.path
value: req.body.value
}
```
The path specifies the specific field you want to update and the value specifies the new value that the field should take
- ``` app.delete('/delete/user/follow/:username', ...) ``` is used to delete the user with `:username` off of everyones followers and followings list when admin deletes a user


### Post Routes

- ```app.post('/post/list', ... ) ``` creates a new post in our database of the List type. It expects a request body like below and returns the list post created:
```
{
title: req.body.title,
options: req.body.options,
author: req.body.author,
timestamp: req.body.timestamp
}
```
- ```app.post('/post/rating', ... ) ``` creates a new post in our database of the Rating type. It expects a request body like below and returns the rating post created:
```
{
movie: req.body.movie,
rating: req.body.rating,
description: req.body.description,
author: req.body.author,
timestamp: req.body.timestamp
}
```
- ```app.post('/post/wwm', ... ) ``` creates a new post in our database of the Watch With Me (WWM) type. It expects a request body like below and returns the wwm post created:
```
{
movie: req.body.movie,
time: req.body.time,
date: req.body.date,
url: req.body.url,
description: req.body.description,
author: req.body.author,
timestamp: req.body.timestamp
}
```
- ```app.post('/post/poll', ... ) ``` creates a new post in our database of the Poll type. It expects a request body like below and returns the poll post created:
```
{
title: req.body.title,
options: req.body.options,
author: req.body.author,
timestamp: req.body.timestamp
}
```
- ```app.patch('/post/poll/update', ...) ``` is used to update the poll post in the database when someone votes for an option on the poll. In this case it will append the author field to the list of votes for the poll option ```name``` for the poll post with id ```id```. It returns the updated poll post and takes the following body:
```
{ 
name: req.body.name
id: req.body.id
author: req.body.user
}
```
- ```app.get('/post', ...) ``` returns all of the posts in the database of all types. Returns a list of them back to the frontend. 
- ```app.get('/post/:type', ... ) ``` returns a list of all the posts of type ```type``` where type is one of ```{List, Rating, Poll, WWM}```. Returns a list of the posts of type ```type``` to the frontend. 
-  ``` app.get('/post/:username/:limit', ...) ``` returns a list of all posts of a user with username ```username``` and only returns the most recent n posts of that user where ```n = :limit``` ordered by timestamp. The route returns an object of form ```{list: ..., length: ...}``` where list is the list of posts and length is the total amount of posts the user has in the database. This essentially is the posts that goes in a users recent activity page
-   ```app.get('/post/:username', ...) ``` returns a list of all of the users posts with username ```username```
-   ``` app.get('/timeline/:username/:limit', ...) ``` returns an object of form ```{list: ..., length: ..., user_to_img: ...}```. `list` is a list of all of the most recent posts of the people that user with username ```username``` follows as well as all of the admins posts ordered by timestamp upto a limit of ```:limit``` posts. This essentially is the posts that goes into the users timeline. `length` is how many posts are actually targeted towards our user which is used help determine when the user can reload for more posts or not. Lastly, `user_to_img` is a object mapping all the usernames of people whose posts are for our user to their avatar img src so we can show it in the timeline
- ```app.delete('/post/:id', ...) ``` deletes the post with the specified id from the Post database
- ``` app.delete('/posts/:username', ...) ``` deletes all of the posts whose author is the user with username `:username`

### Movie Routes
- ``` app.get('/movie') ``` returns all movies in the database.
- ``` app.get('/movie/:id') ``` returns movie with the specified id.
- ``` app.post('/movie') ``` Adds a new movie to our database, expects the following body:
```
{
    title: req.body.title,
    runtime: req.body.runtime,
    ageRating: req.body.ageRating,
    synopsis: req.body.synopsis,
    date: req.body.date,
    genre: req.body.genre,
    image: req.body.image
}
```
- ``` app.delete('/movie/:id') ``` Deletes the movie with the specified id from the Movie database

### Wild Card Route
- ```app.get("*", ...) ``` will look for any route that is not a route defined in our ```server/ ``` and will route it to our frontend ```index.html```. 

# Third-party applications used
-	Bootstrap
-	Chart.js
-   react-chartjs-2 
-   fuse.js
-	react-select-search
-   react-minimal-pie-chart
-   react-paginate
-   bcryptjs
-   express-session

