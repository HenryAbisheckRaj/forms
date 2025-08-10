import { Container, Typography, Paper, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Home() {
  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Welcome</Typography>
        <Typography sx={{ mb: 3 }}>Create and manage dynamic form templates.</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" component={RouterLink} to="/create">Create New Form</Button>
          <Button variant="outlined" component={RouterLink} to="/myforms">View Saved Forms</Button>
        </Box>
      </Paper>
    </Container>
  );
}
