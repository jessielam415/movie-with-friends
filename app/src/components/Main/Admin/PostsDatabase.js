import Post from './Post';
import { useState, useLayoutEffect } from 'react';
import './Styles/PostsDatabase.css';
import ReactPaginate from 'react-paginate';
import ENV from './../../../config.js';
const API_HOST = ENV.api_host

//This functional component is created with reference to the following tutorials
//https://www.youtube.com/watch?v=mZvKPtH9Fzo&ab_channel=PedroTech
//https://www.youtube.com/watch?v=HANSMtDy508&t=170s&ab_channel=PedroTech
function PostsDatabase(props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPosts, setFilteredPosts] = useState(props.posts);

  const [pageNumber, setPageNumber] = useState(0);

  const postsPerPage = 3;

  const [searchBy, setSearchBy] = useState("user");

  const pagesVisited = pageNumber * postsPerPage;

  useLayoutEffect(() => {
    const filteredArray = props.posts.filter((post) => {
        if (searchTerm == "") {
          return post
        } else if (searchBy == "type" && post.__type.toLowerCase().includes(searchTerm.toLowerCase())) {
          return post
        } else if (searchBy == "movie" && post.__type == "List" && post.options.some((element) => element.option.toLowerCase().includes(searchTerm.toLowerCase()))) {
          return post
        } else if (searchBy == "movie" && post.__type == "Poll" && post.options.some((element) => element.option.toLowerCase().includes(searchTerm.toLowerCase()))) {
          return post
        } else if (searchBy == "movie" && post.__type == "Rating" && post.movie.toLowerCase().includes(searchTerm.toLowerCase())) {
          return post
        } else if (searchBy == "movie" && post.__type == "WWM" && post.movie.toLowerCase().includes(searchTerm.toLowerCase())) {
          return post
        } else if (searchBy == "content" && post.__type == "List" && post.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          return post
        } else if (searchBy == "content" && post.__type == "Poll" && post.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          return post
        } else if (searchBy == "content" && post.__type == "WWM" && post.description.toLowerCase().includes(searchTerm.toLowerCase())) {
          return post
        } else if (searchBy == "content" && post.__type == "Rating" && post.description.toLowerCase().includes(searchTerm.toLowerCase())) {
          return post
        } else if (searchBy == "user" && post.author.toLowerCase().includes(searchTerm.toLowerCase())) {
          return post
        } 
    });
    setFilteredPosts(filteredArray);
  }, [JSON.stringify(props.posts), searchTerm, props.posts])

  const displayPosts = filteredPosts
      .slice(pagesVisited, pagesVisited + postsPerPage)
      .map(post => (
        <Post post = {post}
          deletePost={props.deletePost.bind(this, post._id)}
          users = {props.users}
        />
      ));
    
  const pageCount = Math.ceil(filteredPosts.length / postsPerPage);

  const changePage = ({ selected }) => {
      setPageNumber(selected);
  };
  
    return (
      <div className="deletePosts">
        <h1>Post Database</h1>
        <div>
          <span className="spanAdmin">
            {/* Currently we cannot add posts to the arrays, since the add post 
            component is recycled from  */}
            You are an admin user. You can create a global post in the timeline. 
					</span>
        </div>
        <div> <span>Search by:  </span>
          <select className="searchBy" value={searchBy} onChange={event => { setSearchBy(event.target.value) }}>
          <option value={'user'}>Username</option>
          <option value={'type'}>Post Type</option>
          <option value={'content'}>Title/Description</option>
          <option value={'movie'}>Movie</option>
        </select>
      </div>

      <input className="inputSearchTerm" type="text" placeholder="Enter Search Term" onChange={ event => {setSearchTerm(event.target.value)}}/>
      {displayPosts}
      <div >
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
    </div>
  );
}

export default PostsDatabase;
