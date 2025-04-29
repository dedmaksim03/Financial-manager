import { BrowserRouter as Router, Route, Routes, useNavigate, redirect } from 'react-router-dom';
import './App.css';
import { Header } from './components/header';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { BodyPage } from './pages/body';
import { RegistrationPage } from './pages/registration';
import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '.';
import { AuthPage } from './pages/auth';

function App() {

  const { store } = useContext(Context)

  // const navigate = useNavigate()

  useEffect(() => {
    store.checkAuth();
    // if (localStorage.getItem('access_token')) {
    //   console.log(localStorage.getItem('access_token'))
    //   store.checkAuth();
    // }
  }, []);

  if (store.isLoading) {
    return <>
    <Header/>
    <BodyPage>
      Загрузка
    </BodyPage>       
  </>
  }

  if (!store.isAuth) {
      console.log(store.isAuth)
      return <>
        <Header/>
        <BodyPage>
          <AuthPage/>
        </BodyPage>       
      </>
  }

  return (
    <Router>
      <Header username={store.username}/>
      <BodyPage>
        <Routes>
          <Route path="/" Component={HomePage}/>
          {/* <Route path="/login" Component={LoginPage}/>
          <Route path="/registration" Component={RegistrationPage}/> */}
        </Routes>  
      </BodyPage>

    </Router>
  );
}

export default observer(App);
