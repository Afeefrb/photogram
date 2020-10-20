import React, {createContext, useEffect, useReducer, useContext} from 'react';
import './App.css';

import {BrowserRouter, Switch, Route, useHistory} from 'react-router-dom';

//ContextAPI
import {reducer,initialState} from './reducers/useReducer';

//SCREENS & COMPONENTS
import Navbar from './components/Navbar';
import Signup from './components/screens/Signup';
import Signin from './components/screens/Signin';
import Profile from './components/screens/Profile';
import Home from './components/screens/Home';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import FollowingFeed from './components/screens/FollowingFeed';
import Reset from './components/screens/Reset';
import NewPassword from './components/screens/NewPassword';



export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();

  const {state,dispatch} = useContext(UserContext);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    dispatch({type:"USER", payload: user}); //dispatching the user state to all sites

    if(user)  {
      dispatch({type:"USER", payload:user})
    } else if (!user) history.push("/")
    else {
      if(!history.location.pathname.startsWith("/reset")){
        history.push("/signin")
      } 
    }
  },[])

  return(
    <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={Signin} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/profile/:userId" component={UserProfile} />
        <Route path="/create" component={CreatePost} />
        <Route path="/followingFeed" component={FollowingFeed} />
        <Route path="/reset-password" component={Reset} />
        <Route path="/new-password/:token" component={NewPassword} />

    </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState);
  return (
    <UserContext.Provider value={{state,dispatch}}>

      <BrowserRouter>
            <Navbar />
            <Routing />
      </BrowserRouter>

    </UserContext.Provider>
  
  );
}

export default App;
