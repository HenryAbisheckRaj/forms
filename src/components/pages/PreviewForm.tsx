// src/pages/Preview.tsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  IconButton,
  MenuItem,
  RadioGroup,
  FormControl,
  FormLabel,
  Radio,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "../../css/preview.css";
import { FormField } from "../../interface/types";
import { useFormData } from "../data/FormContext";

const PreviewForm: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { deleteTemplate } = useFormData();

  const formData = state?.formData;

  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!formData) {
    return (
      <Box className="preview-container">
        <Typography variant="h6">Form not found/Select a Form to preview</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            navigate("/myforms")
          }
        >
          Go to Forms
        </Button>
      </Box>
    );
  }

  const handleChange = (field: FormField, value: any) => {
    setValues((prev) => ({ ...prev, [field.name]: value }));
    validateField(field, value);
  };

  // ---------------- VALIDATION ----------------
  const validateField = (field: FormField, value: any): string | null => {
    if (field.required) {
      if (field.type === "checkbox" && Array.isArray(value) && value.length === 0) {
        return "Please select at least one option";
      }
      if (!value || value.toString().trim() === "") {
        return "This field is required";
      }
    }

    if (!value) return null;

    // Length or numeric validation
    if (field.type === "number") {
      const numValue = Number(value);
      if (field.minLength !== undefined && numValue < field.minLength) {
        return `Minimum value is ${field.minLength}`;
      }
      if (field.maxLength !== undefined && numValue > field.maxLength) {
        return `Maximum value is ${field.maxLength}`;
      }
    } else {
      if (field.minLength !== undefined && value.length < field.minLength) {
        return `Minimum length is ${field.minLength}`;
      }
      if (field.maxLength !== undefined && value.length > field.maxLength) {
        return `Maximum length is ${field.maxLength}`;
      }
    }

    // Email validation
    if (field.validation === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      console.log("comes in>><<email validation")
      return "Invalid email format";
    }

    // Password validation
    if (field.validation === "password") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(value)
      ) {
        return "Password must be 8-20 chars, include uppercase, lowercase, number & special char";
      }
    }

    return null;
  };
  const handleCheckboxGroupChange = (field: FormField, option: string) => {
    const current = values[field.name] || [];
    if (current.includes(option)) {
      handleChange(field, current.filter((o: string) => o !== option));
    } else {
      handleChange(field, [...current, option]);
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    formData.fields.forEach((field: FormField) => {
      const error = validateField(field, values[field.name]);
      if (error) newErrors[field.name] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      alert("Please fix errors before submitting.");
      return;
    }

    alert(
      `Submitted Data for "${formData.title}":\n` +
      JSON.stringify(values, null, 2)
    );

    setValues({});
  };

  const handleDeleteForm = () => {
    deleteTemplate(formData.id);
    navigate("/myforms");
  };

  return (
    <Box className="preview-container">
      {/* Header */}
      <Box className="preview-header">
        <Typography variant="h5">{formData.title}</Typography>
        <IconButton color="error" onClick={handleDeleteForm}>
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* Dynamic Fields */}
      {formData.fields.map((field: FormField) => {
        const value = values[field.name] ?? "";
        const error = errors[field.name];
        switch (field.type) {
          case "text":
          case "textarea":
          case "number":
          case "date":
          case "select":
            return (
              <TextField
                key={field.name}
                label={field.label}
                type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                multiline={field.type === "textarea"}
                rows={field.type === "textarea" ? 4 : undefined}
                select={field.type === "select"}
                value={value}
                onChange={(e) => handleChange(field, e.target.value)}
                error={!!error}
                helperText={error}
                required={field.required}
                fullWidth
                margin="normal"
                InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
              >
                {field.type === "select" &&
                  field.options?.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
              </TextField>
            );

          case "radio":
            return (
              <FormControl key={field.name} component="fieldset" margin="normal" error={!!error}>
                <FormLabel>{field.label}</FormLabel>
                <RadioGroup
                  value={value}
                  onChange={(e) => handleChange(field, e.target.value)}
                >
                  {field.options?.map((opt) => (
                    <FormControlLabel
                      key={opt}
                      value={opt}
                      control={<Radio />}
                      label={opt}
                    />
                  ))}
                </RadioGroup>
                {error && <p className="error-text">{error}</p>}
              </FormControl>
            );

          case "checkbox":
            if (field.options && field.options.length > 0) {
              return (
                <FormControl key={field.name} component="fieldset" margin="normal" error={!!error}>
                  <FormLabel>{field.label}</FormLabel>
                  {field.options.map((opt) => (
                    <FormControlLabel
                      key={opt}
                      control={
                        <Checkbox
                          checked={(value || []).includes(opt)}
                          onChange={() => handleCheckboxGroupChange(field, opt)}
                        />
                      }
                      label={opt}
                    />
                  ))}
                  {error && <p className="error-text">{error}</p>}
                </FormControl>
              );
            } else {
              return (
                <FormControlLabel
                  key={field.name}
                  control={
                    <Checkbox
                      checked={!!value}
                      onChange={(e) => handleChange(field, e.target.checked)}
                    />
                  }
                  label={field.label}
                />
              );
            }

          default:
            return null;
        }
      })}

      {/* Submit */}
      <Box mt={3} display="flex" justifyContent="flex-start">
        <Button variant="contained" color="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default PreviewForm;
