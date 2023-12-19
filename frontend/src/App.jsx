import { BrowserRouter, Routes, Route} from 'react-router-dom';

// pages and components
import PrivateRoute from './components/private/PrivateRoute';
import PublicRoute from './components/public/PublicRoute';
import Home from './pages/Home';
import Navbar from "./components/public/Navbar";
import Login from './pages/Login';
import Signup from './pages/Signup';
// import ContactUs from './pages/ContactUs';
// import AboutUs from './pages/AboutUs';
import Requests from './pages/Requests';
import Apts from './pages/Apts';
import UserProfile from './pages/UserProfile';
import AptDetail from './pages/AptDetail';
import RealEstateDetail from './pages/RealEstateDetail';

export default function App(){
  return (
    <div className="App">
      <BrowserRouter>

        <Navbar />
        <div className="pages">
          <Routes>

            <Route path='/' element={<Home />} />

            {/* <Route path='/contact_us' element={<ContactUs />} /> */}

            {/* <Route path='/about_us' element={<AboutUs />} /> */}

            <Route path='/apartment_details/:id' element={<AptDetail />} />

            <Route path='/apartments' element={<Apts />} />

            <Route path='/realestate_details/:id' element={<RealEstateDetail />} />

            <Route element={<PrivateRoute />}>
              <Route path='/requests' element={<Requests />} />
              <Route path='/profile' element={<UserProfile />} />
            </Route>

            <Route element={<PublicRoute />}>
              <Route path='/login' element={<Login /> } />
              <Route path='/signup' element={<Signup />} />
            </Route>

          </Routes>
        </div>  
      </BrowserRouter>
      
    </div>
  );
}