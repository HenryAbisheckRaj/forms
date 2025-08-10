// src/pages/CreateForm.tsx
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import { useFormData } from "../data/FormContext";
import { FormField } from "../../interface/types";
import { v4 as uuidv4 } from "uuid";

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "textarea", label: "Textarea" },
  { value: "select", label: "Select" },
  { value: "radio", label: "Radio" },
  { value: "checkbox", label: "Checkbox" },
  { value: "date", label: "Date" },
];

const VALIDATION_TYPES = [
  { value: "none", label: "None" },
  { value: "email", label: "Email" },
  { value: "password", label: "Password" },
];

export default function CreateForm() {
  const { currentFields, setCurrentFields, addTemplate, resetCurrent } = useFormData();

  // Track form title for saving
  const [formTitle, setFormTitle] = useState("");
  const [openSave, setOpenSave] = useState(false);

  // Track options string per field id, to allow editing options separately
  const [optionsMap, setOptionsMap] = useState<Record<string, string>>({});

  // Add new field with default props
  const addField = () => {
    const f: FormField = {
      id: uuidv4(),
      name: `field_${Date.now()}`,
      label: "Untitled",
      type: "text",
      placeholder: "",
      options: [],
      validation: "none",
      required: false,
      defaultValue: "",
    };
    setCurrentFields((prev) => [...prev, f]);
  };

  // Update field by index and key
  const updateField = <K extends keyof FormField>(index: number, key: K, value: FormField[K]) => {
    const updated = [...currentFields];
    updated[index] = { ...updated[index], [key]: value };
    setCurrentFields(updated);

    // If options updated, update optionsMap too for textarea sync
    if (key === "options") {
      setOptionsMap((prev) => ({
        ...prev,
        [updated[index].id]: Array.isArray(value) ? value.join(", ") : "",
      }));
    }
  };

  // Remove a field by index
  const removeField = (index: number) => {
    const fieldId = currentFields[index].id;
    setCurrentFields((prev) => prev.filter((_, i) => i !== index));
    setOptionsMap((prev) => {
      const newMap = { ...prev };
      delete newMap[fieldId];
      return newMap;
    });
  };

  // Handle drag end - reorder fields
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const reordered = Array.from(currentFields);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setCurrentFields(reordered);
  };

  // When user edits options textarea per field
  const onOptionsChange = (fieldId: string, value: string, index: number) => {
    setOptionsMap((prev) => ({ ...prev, [fieldId]: value }));
    // Parse options on blur or after debounce if needed
    const arr = value.split(",").map((s) => s.trim()).filter(Boolean);
    updateField(index, "options", arr);
  };

  // Save form handler
  const handleSave = () => {
    if (!formTitle.trim()) {
      alert("Please enter a form name");
      return;
    }
    addTemplate(formTitle.trim());
    setOpenSave(false);
    setFormTitle("");
    resetCurrent();
    setOptionsMap({});
  };

  // Sync optionsMap with currentFields on mount and on currentFields change
  useEffect(() => {
    const newOptionsMap: Record<string, string> = {};
    currentFields.forEach((f) => {
      newOptionsMap[f.id] = Array.isArray(f.options) ? f.options.join(", ") : "";
    });
    setOptionsMap(newOptionsMap);
  }, [currentFields]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Create New Form
      </Typography>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="fields">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Stack spacing={2}>
                {currentFields.map((field, idx) => (
                  <Draggable key={field.id} draggableId={field.id} index={idx}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{ userSelect: "none" }}
                      >
                        <CardContent>
                          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                            <TextField
                              label="Label"
                              value={field.label}
                              onChange={(e) => updateField(idx, "label", e.target.value)}
                              sx={{ minWidth: 120 }}
                            />
                            <TextField
                              label="Name"
                              value={field.name}
                              onChange={(e) => updateField(idx, "name", e.target.value)}
                              sx={{ minWidth: 120 }}
                            />
                            <TextField
                              select
                              label="Type"
                              value={field.type}
                              onChange={(e) => updateField(idx, "type", e.target.value as FormField["type"])}
                              sx={{ minWidth: 140 }}
                            >
                              {FIELD_TYPES.map((t) => (
                                <MenuItem key={t.value} value={t.value}>
                                  {t.label}
                                </MenuItem>
                              ))}
                            </TextField>

                            {/* Show min/max only if number type */}
                            {field.type === "number" ? (
                              <>
                                <TextField
                                  label="Min Value"
                                  type="number"
                                  value={field.minLength ?? ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateField(idx, "minLength", val === "" ? undefined : Number(val));
                                  }}
                                  sx={{ minWidth: 120 }}
                                  inputProps={{ min: Number.MIN_SAFE_INTEGER, step: 1 }}
                                />
                                <TextField
                                  label="Max Value"
                                  type="number"
                                  value={field.maxLength?? ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateField(idx, "maxLength", val === "" ? undefined : Number(val));
                                  }}
                                  sx={{ minWidth: 120 }}
                                  inputProps={{ max: Number.MAX_SAFE_INTEGER, step: 1 }}
                                />
                              </>
                            ) : (
                              <TextField
                                select
                                label="Validation"
                                value={field.validation || "none"}
                                onChange={(e) => updateField(idx, "validation", e.target.value as FormField["validation"])}
                                sx={{ minWidth: 180 }}
                              >
                                {VALIDATION_TYPES.map((v) => (
                                  <MenuItem key={v.value} value={v.value}>
                                    {v.label}
                                  </MenuItem>
                                ))}
                              </TextField>
                            )}

                            <TextField
                              select
                              label="Required"
                              value={field.required ? "true" : "false"}   // convert boolean to string
                              onChange={(e) => updateField(idx, "required", e.target.value === "true")} // convert string back to boolean
                              sx={{ minWidth: 100 }}
                            >
                              <MenuItem value="false">No</MenuItem>
                              <MenuItem value="true">Yes</MenuItem>
                            </TextField>
                              <IconButton color="error" onClick={() => removeField(idx)}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>

                          <Box mt={2} display="flex" gap={2} flexWrap="wrap" alignItems="center">
                            <TextField
                              label="Placeholder"
                              value={field.placeholder || ""}
                              onChange={(e) => updateField(idx, "placeholder", e.target.value)}
                              sx={{ minWidth: 220 }}
                            />
                            <TextField
                              label="Default value"
                              value={field.defaultValue || ""}
                              onChange={(e) => updateField(idx, "defaultValue", e.target.value)}
                              sx={{ minWidth: 220 }}
                            />
                          </Box>

                          {/* Show options textarea only for select, radio, checkbox */}
                          {["select", "radio", "checkbox"].includes(field.type) && (
                            <Box mt={2}>
                              <TextField
                                fullWidth
                                label="Options (comma separated)"
                                value={optionsMap[field.id] || ""}
                                onChange={(e) => onOptionsChange(field.id, e.target.value, idx)}
                                helperText="if comma is not printed enter next option then back to set comma"
                                multiline
                              />
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </Stack>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Box display="flex" gap={2} mt={2}>
        <Button startIcon={<AddIcon />} variant="contained" onClick={addField}>
          Add Field
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setOpenSave(true)}
          disabled={!currentFields.length}
        >
          Save Form
        </Button>
        <Button variant="text" color="inherit" onClick={() => setCurrentFields([])}>
          Clear
        </Button>
      </Box>

      <Dialog open={openSave} onClose={() => setOpenSave(false)}>
        <DialogTitle>Save Form Template</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Form Name"
            fullWidth
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSave(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
