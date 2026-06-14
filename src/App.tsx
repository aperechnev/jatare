import { Routes, Route } from "react-router-dom"

import Layout from "./layout/Layout"

import FrontPage from "./pages/FrontPage"
import Portfolio from "./pages/Portfolio/Portfolio"
import Rebalancing from "./pages/Rebalancing/Rebalancing"

function App() {
  return (
    <Routes>

      <Route element={<Layout />}>

        <Route path="/" element={<FrontPage />} />
        <Route path="/portfolio/:address" element={<Portfolio />} />
        <Route path="/portfolio/:address/rebalancing" element={<Rebalancing />} />

      </Route>

    </Routes>
  )
}

export default App
