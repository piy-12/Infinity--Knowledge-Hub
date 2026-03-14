import Login from "./pages/Login"
import { Routes, Route } from "react-router-dom"
import Signup from "./pages/Signup"
import Home from "./pages/Home"
import ProtectedRoute from "./protected"
import Dictionary from "./pages/Dictionary"
import Calendar from "./pages/calendar"
import Calculator from "./pages/Calculator"
import Profile from "./pages/Profile"
import Analytics from "./pages/Analytics"
import Library from "./pages/Library"
import Notes from "./pages/Notes"
import Quiz from "./pages/Quiz"

function App() {

  return(

     <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element = {<Signup></Signup>} ></Route>
        <Route path="/dictionary" element ={<Dictionary></Dictionary>}></Route>
        <Route path="/calendar" element = {<Calendar></Calendar>}></Route>
        <Route path="/calculator" element = {<Calculator></Calculator>}></Route>
        <Route path="/profile" element = {<Profile></Profile>} ></Route>
        <Route path= '/analytics' element = {<Analytics></Analytics>}></Route>
        <Route path="/notes" element = {<Notes></Notes>}></Route>
        <Route path= '/library' element = {<Library></Library>}></Route>
        <Route path="/" element={ <Home></Home>}></Route> 
        <Route path="/quiz" element = {<Quiz></Quiz>}></Route>
      </Routes>
  )
}

export default App
