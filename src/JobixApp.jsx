

import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Header } from './components/Header'
import { Main } from './components/Main'
import AdminPanel from './pages/AdminPanel';
import AddProductForm from './pages/AddProductForm';
import ProductDetail from './pages/ProductDetail';
import { Footer } from './components/Footer';
import { ProductListAdmin } from './components/ProductListAdmin';
import { RegisterForm } from './components/RegisterForm';
import { LoginForm } from './components/LoginForm';
import { useState } from 'react';
import { UserManagementPanel } from './components/UserManagementPanel';
import { FeatureAdmin } from './components/FeatureAdmin';
import { CategoryAdmin } from './components/CategoryAdmin';
import { FavoritesList } from './pages/FavoritesList';
import { FavoriteProvider } from "./components/FavoriteContext";
import { PolicyForm } from './components/PolicyForm';
import { ReservationConfirmationPage } from './pages/ReservationConfirmationPage';
import { ReservationHistory } from './pages/ReservationHistory';
import { MyProfile } from './pages/MyProfile';



const AdminRoute = ({user, children}) =>{

  // Si no hay usuario o no es admin, redirige a "/"
  if(!user || !user.roles.includes("ADMIN")){
    return <Navigate to="/" replace/>
  }
  
  return children;
}

export const JobixApp = () => {

  const [user, setUser] = useState(()=>{
    const storedUser= localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null
  });

  const navigate = useNavigate();  

  
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user",JSON.stringify(userData));
      navigate("/");
  }

  const handleLogout = () =>{
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    
    <>
    <FavoriteProvider>
    <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Main user={user}/>} />
        <Route path='/admin' element={<AdminRoute user={user}><AdminPanel/></AdminRoute>}/>
        <Route path="/register-form" element={<RegisterForm/>}/>
        <Route path="/login" element={<LoginForm onLogin={handleLogin}/>}/>
        <Route path="/profile" element={<MyProfile/>} />
        <Route path="/admin/add-product" element={<AddProductForm/>}/>
        <Route path="/reserve/:productId" element={<ReservationConfirmationPage/>}/> 
        <Route path='/reservation-history' element={<ReservationHistory/>}/>
        <Route path='/favorites' element={<FavoritesList/>}/>
        <Route path="/product/:id" element={<ProductDetail/>}/>
        <Route path="/admin/all-product" element={<ProductListAdmin/>}/>
        <Route path="/admin/manage-categories" element={<CategoryAdmin/>}/>
        <Route path="/admin/manage-features" element={<AdminRoute user={user}><FeatureAdmin /></AdminRoute>}/>
        <Route path="/admin/manage-users" element={<UserManagementPanel/>}/>
        <Route path="/admin/policies" element={<PolicyForm/>}/>
      </Routes>
      <Footer/> 
    </FavoriteProvider>

    </>
  );
};
