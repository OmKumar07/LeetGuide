import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeContextProvider } from "./theme/ThemeContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Compare from "./pages/Compare";
import Box from "@mui/material/Box";

function App() {
  return (
    <ThemeContextProvider>
      <Router>
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "background.default",
          }}
        >
          <Navbar />
          <Box component="main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/compare" element={<Compare />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeContextProvider>
  );
}

export default App;
