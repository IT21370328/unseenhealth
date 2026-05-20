import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Articles from './pages/Articles.jsx';
import NewArticle from './pages/NewArticle.jsx';
import Layout from './components/Layout.jsx';

function PrivateRoute({ children }) {
  return localStorage.getItem('admin_token') ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="articles" element={<Articles />} />
          <Route path="articles/new" element={<NewArticle />} />
          <Route path="articles/edit/:id" element={<NewArticle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
