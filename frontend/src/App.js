import Header from "./components/Header"
import DeleteModal from "./components/DeleteModal"
import { HashRouter as Router, Routes, Route} from "react-router-dom"
import { useSelector } from "react-redux"
import { Container } from 'react-bootstrap'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import ShippingPage from './pages/ShippingPage'
import PaymentPage from './pages/PaymentPage'
import SummaryPage from './pages/SummaryPage'
import OrderPage from './pages/OrderPage'
import UserListPage from './pages/UserListPage'
import UserEditPage from './pages/UserEditPage'
import ProductListPage from './pages/ProductListPage'
import ProductEditPage from './pages/ProductEditPage'
import OrderListPage from './pages/OrderListPage'

function App() {
  const showModal = useSelector((state) => state.deleteModal.showModal)

  return (
    <Router>
      {showModal && <DeleteModal />}
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" Component={HomePage}/>
            <Route path="/login" Component={LoginPage}/>
            <Route path="/register" Component={RegisterPage}/>
            <Route path="/profile" Component={ProfilePage}/>
            <Route path="/shipping" Component={ShippingPage}/>
            <Route path="/payment" Component={PaymentPage}/>
            <Route path="/summary" Component={SummaryPage}/>
            <Route path="/orders/:id" Component={OrderPage}/>
            <Route path="/products/:id" Component={ProductPage}/>
            <Route path="/cart/:id?" Component={CartPage}/>

            <Route path="/admin/userlist" Component={UserListPage}/>
            <Route path="/admin/user/:id/edit" Component={UserEditPage}/>

            <Route path="/admin/productlist" Component={ProductListPage}/>
            <Route path="/admin/products/:id/edit" Component={ProductEditPage}/>

            <Route path="/admin/orderlist" Component={OrderListPage}/>
          </Routes>
        </Container>
      </main>
    </Router>
  );
}

export default App;
