import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { useAuthContext } from './hooks/useContexts';

// pages and components
import Home from './pages/Home';
import Navbar from "./components/Navbar";
import Login from './pages/Login';
import Signup from './pages/Signup';
// import ContactUs from './pages/ContactUs';
// import AboutUs from './pages/AboutUs';
import Requests from './pages/Requests';
import Admins from './pages/Admins';
import UserProfile from './pages/UserProfile';
import AptDetail from './pages/AptDetail';
import AdminDetail from './pages/AdminDetail';



function App() {
  const {user} = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>


        <Navbar />
        <div className="pages">
          <Routes>

            <Route path='/' element={<Home />} />

            <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />

            <Route path='/signup' element={!user ? <Signup /> : <Navigate to='/' />} />

            {/* <Route path='/contact_us' element={<ContactUs />} /> */}

            {/* <Route path='/about_us' element={<AboutUs />} /> */}

            <Route path='/apartment_details/:id' element={<AptDetail />} />

            <Route path='/real_estates' element={<Admins />} />

            <Route path='/profile' element={user ? <UserProfile /> : <Navigate to='/' />} />

            <Route path='/admin_details/:id' element={<AdminDetail />} />

            <Route path='/requests' element={user ? <Requests /> : <Navigate to='/' />} />

          </Routes>
        </div>  
      </BrowserRouter>
      
    </div>
  );
}

export default App;
