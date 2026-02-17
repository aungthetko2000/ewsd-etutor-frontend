
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import { AuthProvider } from './components/auth/AuthContext.tsx';
import LoginForm from "./components/LoginForm.tsx";
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';
import Dashboard from './components/DashBoard.tsx';

function App() {
     return (
          <>
               <AuthProvider>
                    <BrowserRouter>
                         <Routes>
                              <Route path="/" element={<LoginForm />} />
                              <Route path="/dashboard" element={
                                   <ProtectedRoute>
                                        <Dashboard />
                                   </ProtectedRoute>
                              } />
                         </Routes>
                    </BrowserRouter>
               </AuthProvider>
          </>
     )
}

export default App
