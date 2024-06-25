import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import Profile from './components/profile/Profile';
import Dashboard from './components/dashboard/Dashboard';
import SignIn from './components/signIn/SignIn';
import SignUp from './components/signUp/SignUp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignIn/>} />
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/login' element={<Login/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/profile' element={<Profile/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
