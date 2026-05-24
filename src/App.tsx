import { Routes, Route } from "react-router-dom"
import FrontPage from "./pages/FrontPage"
import Portfolio from "./pages/Portfolio"

function App() {
  return (
    <Routes>
      <Route path="/" element={<FrontPage />} />
      <Route path="/portfolio/:address" element={<Portfolio />} />
    </Routes>
  )
}

export default App
