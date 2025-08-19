import { Link, useLocation } from "react-router-dom";
import { BarChart3, Users, Github, Sun, Moon } from "lucide-react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useTheme } from "../theme/useTheme";

const Navbar = () => {
  const location = useLocation();
  const { mode, toggleTheme } = useTheme();

  const navItems = [
    { path: "/", label: "Dashboard", icon: BarChart3 },
    { path: "/compare", label: "Compare", icon: Users },
  ];

  return (
    <AppBar position="static" color="inherit" elevation={0}>
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
          }}
          component={Link}
          to="/"
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              bgcolor: "primary.main",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
            }}
          >
            <BarChart3 style={{ height: 20, width: 20, color: "white" }} />
          </Box>
          <Typography
            variant="h6"
            color="text.primary"
            fontWeight={700}
            sx={{ fontSize: "1.25rem" }}
          >
            LeetGuide
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          {navItems.map(({ path, label, icon: Icon }) => (
            <Button
              key={path}
              component={Link}
              to={path}
              startIcon={<Icon style={{ height: 18, width: 18 }} />}
              color={location.pathname === path ? "primary" : "inherit"}
              variant={location.pathname === path ? "contained" : "text"}
              sx={{
                fontWeight: 500,
                textTransform: "none",
                px: 2,
                py: 1,
                borderRadius: 1.5,
                minWidth: "auto",
              }}
            >
              {label}
            </Button>
          ))}
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Theme Toggle */}
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            sx={{
              p: 1,
              borderRadius: 1.5,
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            {mode === "dark" ? (
              <Sun style={{ height: 20, width: 20 }} />
            ) : (
              <Moon style={{ height: 20, width: 20 }} />
            )}
          </IconButton>

          {/* GitHub Link */}
          <IconButton
            href="https://github.com/OmKumar07/LeetGuide"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            sx={{
              p: 1,
              borderRadius: 1.5,
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <Github style={{ height: 20, width: 20 }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
