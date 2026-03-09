
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import { AuthProvider } from './components/auth/AuthContext.tsx';
import LoginForm from "./components/LoginForm.tsx";
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';
import Dashboard from './components/DashBoard.tsx';
import BlogList from './components/blog/BlogList.tsx';
import MessengerWidget from './components/message/Message.tsx';

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
                              <Route path="/blogs" element={
                                   <ProtectedRoute>
                                        <BlogList />
                                   </ProtectedRoute>
                              } />
                         
                         </Routes>
                              <MessengerWidget />
                    </BrowserRouter>
               </AuthProvider>
          </>
     )
}

export default App
