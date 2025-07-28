import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from './pages/Home'
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import Favourite from "./pages/Favourite";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from './components/Footer'
const App = () => {
    const isAdmin = useLocation().pathname.startsWith('/admin')
    return (
        <>
        <Toaster/>
        {!isAdmin && <Navbar/>}
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/movies" element={<Movies/>}></Route>
                <Route path="/movies/:id" element={<MovieDetails/>}></Route>
                <Route path="/movies/:id/:date" element={<SeatLayout/>}></Route>
                <Route path="/my-bookings" element={<MyBookings/>}></Route>
                <Route path="/favourite" element={<Favourite/>}></Route>
            </Routes>
            {!isAdmin && <Footer/>}
        </>
    )

}

export default App