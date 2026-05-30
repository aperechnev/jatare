import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"

export default function Layout() {
  return (
    <main className="min-h-screen bg-white mx-64">

      <Header />

      <div>
        <Outlet />
      </div>

      <Footer />

    </main>
  )
}
