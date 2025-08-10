// src/components/Navbar.tsx
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dynamic Form Builder
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">Home</Button>
          <Button color="inherit" component={RouterLink} to="/create">Create</Button>
          <Button color="inherit" component={RouterLink} to="/preview">Preview</Button>
          <Button color="inherit" component={RouterLink} to="/myforms">My Forms</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
