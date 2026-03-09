
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import { AuthProvider } from './components/auth/AuthContext.tsx';
import LoginForm from "./components/LoginForm.tsx";
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';
import Dashboard from './components/DashBoard.tsx';
import BlogList from './components/blog/BlogList.tsx';
import { ToastContainer } from 'react-toastify';
import BlogDetailPage from './components/blog/BlogDetailPage.tsx';
import MessengerWidget from './components/message/Message.tsx';

function App() {
     return (
          <>
          <ToastContainer position="top-right" autoClose={2000} />
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
                              <Route path="/blogs/:id" element={
                                   <ProtectedRoute>
                                        <BlogDetailPage />
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
