import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import { starterProducts } from './data/products.js'
import HomePage from './pages/HomePage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import AddProductPage from './pages/AddProductPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import TeamOnePage from './pages/TeamOnePage.jsx'
import TeamTwoPage from './pages/TeamTwoPage.jsx'
import TeamLayout from './pages/TeamLayout.jsx'
import UserPage from './pages/UserPage.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import ShopLayout from './layouts/ShopLayout.jsx'
import OrderPage from './pages/OrderPage.jsx'
import CategoryPage from './pages/CategoryPage.jsx'

function App() {
  // State is data that can change while the app is open.
  const [products, setProducts] = useState(starterProducts)

  // useEffect runs after React updates the page.
  useEffect(() => {
    document.title = `${products.length} products | Stock Starter`;
  }, [products.length]);

  function addProduct(newProduct) {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  }

  function addOrder(newOrder) {
    setOrders((prevOrders) => [...prevOrders, newOrder])
  }

  return (
    <Routes>
      {/* Main / Admin Layout with Sidebar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage products={products} />} />
        <Route
          path="/products"
          element={<ProductsPage products={products} />}
        />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/add-product" element={<AddProductPage onAddProduct={addProduct} />} />
        <Route path="/order" element={<OrderPage/>}/>
        <Route path="/users" element={<UserPage />} />
        <Route path="/team" element={<TeamLayout />}>
          <Route
            index
            element={<p>Select Team 1 or Team 2 from the sidebar.</p>}
          />
          <Route path="team-1" element={<TeamOnePage />} />
          <Route path="team-2" element={<TeamTwoPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* New /shop Layout */}
      <Route path="/shop" element={<ShopLayout />}>
        <Route index element={<UserPage />} />
      </Route>
      <Route path="/stock-movement" element={<StockMovementPage />} />
      <Route path="/payment" element={<PaymentPage products={products} />} />
    </Routes>
  );
}

export default App;
