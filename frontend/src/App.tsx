import { BrowserRouter as Router, Route, Routes, useNavigate, redirect } from 'react-router-dom';
import './App.css';
import { Header } from './components/header';
import { MainPage } from './pages/main';
import { BodyPage } from './pages/body';
import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '.';
import { AuthPage } from './pages/auth';
import { OverviewPage } from './pages/overview';
import { OtherPage } from './pages/other';
import OperationListPage from './pages/list';
import { ChakraProvider } from '@chakra-ui/react';

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

  return (
    <div className='appWrapper'>
      <Router>
        <Header username={store.username}/>
        <BodyPage>
          {store.isLoading && (
            'Загрузка'
          )}

          {!store.isAuth && (
            <AuthPage/>
          )}

          {store.isAuth && (
            <MainPage>
              <Routes>
                  <Route path="/overview" Component={OverviewPage}/>
                  <Route path="/list" Component={OperationListPage}/>
                  <Route path="/*" Component={OtherPage}/>
                {/* <Route path="/login" Component={LoginPage}/>
                <Route path="/registration" Component={RegistrationPage}/> */}
              </Routes>  
            </MainPage>          
          )}
        </BodyPage>          
      </Router>
    
    </div>

  )
}

export default observer(App);
