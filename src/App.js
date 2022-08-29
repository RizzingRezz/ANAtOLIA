import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/pages/Home';
import Presentation from './components/pages/Presentation';
import Calendar from './components/pages/Calendar';
import Contact from './components/pages/Contact';
import Instruments from './components/pages/Instruments';
import Consortium from './components/pages/Consortium';
import Data from './components/pages/Data';
import ScrollToTop from './components/ScrollToTop';
import Article from './components/pages/Article';
import Footer from './components/Footer';
import NotFound from './components/pages/NotFound';


function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path="/article/:id" element={<Article />} />
          <Route path='/presentation' exact element={<Presentation />} title="About Page" />
          <Route path='/calendar' exact element={<Calendar />} />
          <Route path='/contact' exact element={<Contact />} />
          <Route path='/instruments' exact element={<Instruments />} />
          <Route path='/consortium' exact element={<Consortium />} />
          <Route path='/data' exact element={<Data />} />
          <Route path='*' exact element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
