// src/pages/MyForms.tsx
import React from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormData } from "../data/FormContext";
import { useNavigate } from "react-router-dom";

export default function MyForms() {
  const { templates, deleteTemplate } = useFormData();
  const navigate = useNavigate();

  if (!templates.length) {
    return (
      <Container sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography>No saved forms found. Please create some forms first.</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Forms
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={3}>
        {templates.map((form) => (
          <Paper
            key={form.id}
            sx={{
              p: 3,
              width: "300px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: 3,
              borderRadius: 2,
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.03)" },
            }}
          >
            <Typography variant="h6" gutterBottom>
              {form.title}
            </Typography>

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  navigate("/preview", { state: { formData: form } })
                }
              >
                View
              </Button>

              <IconButton
                color="error"
                onClick={() => deleteTemplate(form.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Box>
    </Container>
  );
}
