import React, { useState } from "react";

import Featured from "./featured/Featured";
import Hero from "./hero/Hero";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import Recent from "./recent/Recent";

import Header from "../common/header/Header";
import Footer from "../common/footer/Footer";
import AIChatButton from "../chat/AIChatButton";
import Chat from "../Chat";

const Home = ({login}) => {
  const [chatOpen, setChatOpen] = useState(false);
const history=useHistory()
  const handleAIChatClick = () => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      alert("Please login to your account to access chatbot");
      history.push("/login");
    }
    setChatOpen(!chatOpen);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
  };
  return (
    <>
      <Header login={login}/>
      <Hero />
      <Featured />
      <Recent />
      <Footer />
      <AIChatButton onClick={handleAIChatClick} />
      {chatOpen && <Chat onClose={handleCloseChat} />}

    </>
  );
};

export default Home;
