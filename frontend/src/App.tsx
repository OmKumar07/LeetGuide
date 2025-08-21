import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { ThemeContextProvider } from "./theme/ThemeContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Compare from "./pages/Compare";
import SEOHead from "./components/SEO/SEOHead";
import { generateStructuredData } from "./utils/seo";
import Box from "@mui/material/Box";

function App() {
  useEffect(() => {
    // SEO component will handle title updates
    // Remove the direct document.title setting as SEOHead will manage it
  }, []);

  return (
    <ThemeContextProvider>
      <Router>
        <SEOHead
          structuredData={generateStructuredData.website()}
          url="https://leetguide.com"
        />
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "background.default",
          }}
        >
          <Navbar />
          <Box component="main" id="main-content">
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
