import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "../home/Home";
import About from "../about/About";
import Services from "../services/Services";
import Contact from "../contact/Contact";
import Login from '../common/LoginSignup/Login';
import Signup from "../common/LoginSignup/Signup";
import Profile from "../Profile/Profile";
import Chat from "../Chat";
import DetailedView from '../home/recent/DetailedView'
import ResetPassword from './ResetPassword'
import PaymentPage from "../payment/payment";
import BookingList from "../bookings/BookingList";
import ThankYouPage from "../Confirm/Confirm";
import Success from '../../Success'
import FavoriteItems from "../Fav/FavouriteItems";
const Pages = () => {
  const [login, setLogin] = useState(false);
  const handleLogin = () => {
    setLogin(!login);
  };

  return (
    <>
      <Router>
        <Switch>
          <Route exact path='/' render={(props) => <Home {...props} login={login} handleLogin={handleLogin} />}  />
          <Route exact path='/login' render={(props) => <Login {...props} login={login} handleLogin={handleLogin} />} />
          <Route exact path='/register' render={(props) => <Signup {...props} login={login} handleLogin={handleLogin} />} />
          <Route exact path='/about' component={About} />
          <Route exact path='/services' component={Services} />
          <Route exact path='/profile' render={(props) => <Profile {...props} login={login} handleLogin={handleLogin} />} />
          <Route exact path='/contact' component={Contact} />
          <Route exact path='/payment' component={PaymentPage} />
          <Route exact path='/bookings' component={BookingList} />
          <Route exact path='/fav' component={FavoriteItems} />
          <Route exact path='/done' component={Success} />
          <Route exact path='/confirm' component={ThankYouPage} />
          <Route path="/details/:id" component={DetailedView} />
          <Route path="/resetpassword/:id" component={ResetPassword} />
          <Route path='/chat' component={Chat}/>
        </Switch>
      </Router>
    </>
  );
};

export default Pages;

