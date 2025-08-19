
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Users, Lightbulb, Github } from 'lucide-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Navbar = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/compare', label: 'Compare', icon: Users },
    { path: '/recommendations', label: 'Recommendations', icon: Lightbulb },
  ]

  return (
    <AppBar position="static" color="inherit" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }} component={Link} to="/">
          <BarChart3 style={{ height: 32, width: 32, color: '#1976d2', marginRight: 8 }} />
          <Typography variant="h6" color="textPrimary" fontWeight={700}>
            LeetGuide
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {navItems.map(({ path, label, icon: Icon }) => (
            <Button
              key={path}
              component={Link}
              to={path}
              startIcon={<Icon style={{ height: 20, width: 20 }} />}
              color={location.pathname === path ? 'primary' : 'inherit'}
              variant={location.pathname === path ? 'contained' : 'text'}
              sx={{ fontWeight: 500, textTransform: 'none' }}
            >
              {label}
            </Button>
          ))}
        </Box>

        {/* GitHub Link */}
        <IconButton
          href="https://github.com/OmKumar07/LeetGuide"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
        >
          <Github style={{ height: 24, width: 24 }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar
