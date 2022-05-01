import User from './User';
import { useState, useLayoutEffect} from 'react';
import './Styles/UsersDatabase.css';
import ReactPaginate from 'react-paginate';
import AddNewUser from './AddNewUser';
import ENV from './../../../config.js';
const API_HOST = ENV.api_host

//This functional component is created with reference to the following tutorials
//https://www.youtube.com/watch?v=mZvKPtH9Fzo&ab_channel=PedroTech
//https://www.youtube.com/watch?v=HANSMtDy508&t=170s&ab_channel=PedroTech

function UsersDatabase(props) {

  const [searchTerm, setSearchTerm] = useState("");
  
  const [filteredUsers, setFilteredUsers] = useState(props.users);

  const [pageNumber, setPageNumber] = useState(0);

  const [searchBy, setSearchBy] = useState("username");

  const usersPerPage = 4;

  const pagesVisited = pageNumber * usersPerPage;

  useLayoutEffect(() => {
    const filteredArray = props.users.filter((val) => {
        if (searchTerm == "") {
            return val
        } else if (searchBy == "username" && val.username.toLowerCase().includes(searchTerm.toLowerCase())) {
            return val
        } else if (searchBy == "firstName" && val.firstName.toLowerCase().includes(searchTerm.toLowerCase())) {
            return val
        } else if (searchBy == "lastName" && val.lastName.toLowerCase().includes(searchTerm.toLowerCase())) {
            return val
        } else if (searchBy == "password" && val.password.toLowerCase().includes(searchTerm.toLowerCase())) {
            return val
        } else if (searchBy == "gender" && val.gender.toLowerCase().includes(searchTerm.toLowerCase())) {
            return val
        } else if (searchBy == "age" && val.age == (searchTerm)) {
            return val
        } else if (searchBy == "userType" && "admin".includes(searchTerm.toLowerCase()) && (val.is_admin)) {
            return val
        } else if (searchBy == "userType" && "regular".includes(searchTerm.toLowerCase()) && !(val.is_admin)) {
            return val
        } else if (searchBy == "followers" && val.followers.some((element) => element.toLowerCase().includes(searchTerm.toLowerCase()))) {
          return val
        } else if (searchBy == "followings" && val.following.some((element) => element.toLowerCase().includes(searchTerm.toLowerCase()))) {
          return val
        }
    });
    setFilteredUsers(filteredArray);
  }, [JSON.stringify(props.users), searchTerm, props.users])

  const displayUsers = filteredUsers
    .slice(pagesVisited, pagesVisited + usersPerPage)
    .map(user => (
      <User user={user}
          deleteUser={props.deleteUser.bind(this, user.username)} changeToAdmin={props.changeToAdmin.bind(this, user.username)}
          changeUsername = { props.changeUsername } 
          changePassword = { props.changePassword }
        resetFilteredUsers = {props.setFilteredUsers} 
      />
    ));
    
  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);

  const changePage = ({ selected }) => {
      setPageNumber(selected);
  };

  return (
    <div >
      <h1>User Database</h1>
      <div>
        <span className="spanAdmin"><AddNewUser addUser={props.addUser}/></span>
      </div>
      <span>Search by: </span>
      <select className="searchBy" value={searchBy} onChange={event => { setSearchBy(event.target.value) }}>
        <option value={'username'}>Username</option>
        <option value={'firstName'}>First Name</option>
        <option value={'lastName'}>Last Name</option>
        <option value={'password'}>Password</option>
        <option value={'gender'}>Gender</option>
        <option value={'age'}>Age</option>
        <option value={'userType'}>User Type</option>
        <option value={'followers'}>Followers</option>
        <option value={'followings'}>Following</option>
      </select>
      <br></br>
      <input className="inputSearchTerm" type="text" placeholder="Enter search term" onChange={event => {setSearchTerm(event.target.value)}}/>
      {displayUsers}
      <div className="paginate">
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

export default UsersDatabase;
