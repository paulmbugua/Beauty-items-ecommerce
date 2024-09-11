import './App.css';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import Product from  './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import ShopCategory from './Pages/ShopCategory';
import Footer from './components/Footer/Footer';
import Serums_banner from './components/Assets/banners_serums.png'
import Moisturisers_banner from './components/Assets/banners_moisturisers.png'
import Supplements_banner from './components/Assets/banners_supplements.png'
import Soaps_banner from './components/Assets/banner_soaps.png'
import Toners_banner from './components/Assets/banner_toners.png'




function App() {
  return (
    <div>
      
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/Serums" element={<ShopCategory banner={Serums_banner} category="Serums" />} />
          <Route path="/Moisturisers" element={<ShopCategory banner={Moisturisers_banner} category="Moisturisers" />} />
          <Route path="/Supplements" element={<ShopCategory banner={Supplements_banner} category="Supplements" />} />
          <Route path="/Soaps" element={<ShopCategory banner={Soaps_banner} category="Soaps" />} />
          <Route path="/Toners" element={<ShopCategory banner={Toners_banner} category="Toners" />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />
        </Routes>
        <Footer/>
     
      </BrowserRouter>
     
     
    </div>
  );
}

export default App;
