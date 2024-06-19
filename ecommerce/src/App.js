import './App.css';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter as Router , Routes , Route} from 'react-router-dom';
import Shop from './pages/Shop';
import ShopCategory from '../src/pages/ShopCategory'
import Product from './pages/Product';
import Cart from './pages/Cart';
import Footer from './components/Footer/Footer';
import men_banner from './components/Assets/banner_mens.png'
import women_banner from './components/Assets/banner_women.png'
import kid_banner from './components/Assets/banner_kids.png'
import LoginSignup from './pages/LoginSignup';

function App() {
  return (
    <div>
      <Router>
      <Navbar/>
     <Routes>
      <Route path='/' element={<Shop/>}/>
      <Route path='/mens' element={<ShopCategory banner={men_banner} category="men"/>}/>
      <Route path='/womens' element={<ShopCategory banner={women_banner} category="women"/>}/>
      <Route path='/kids' element={<ShopCategory banner={kid_banner} category="kid"/>}/>
      <Route path='/product' element={<Product/>}/>
        <Route path='/product/:productId' element={<Product/>}>
      </Route>
      <Route path='/login' element={<LoginSignup/>}/>
      <Route path='/cart' element={<Cart/>}/>
     </Routes>
     <Footer/>
     </Router>
    </div>
  );
}

export default App;
//01:31:33