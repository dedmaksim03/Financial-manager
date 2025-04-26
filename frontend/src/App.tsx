import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Header } from './components/header';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { BodyPage } from './pages/body';

function App() {
  return (
    <Router>
      <Header/>
      <BodyPage>
        <Routes>
          <Route path="/" Component={LoginPage}/>
        </Routes>  
      </BodyPage>

    </Router>
  );
}

export default App;
