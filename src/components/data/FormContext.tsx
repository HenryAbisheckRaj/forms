// src/components/FormBuilder/FormContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { FormField, FormTemplate } from "../../interface/types";
import { v4 as uuidv4 } from "uuid";

type FormContextType = {
  templates: FormTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<FormTemplate[]>>;
  addTemplate: (title: string) => void;
  deleteTemplate: (id: string) => void;
  currentFields: FormField[];
  setCurrentFields: React.Dispatch<React.SetStateAction<FormField[]>>;
  resetCurrent: () => void;
};

const STORAGE_KEY = "upliance_forms_v1";

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [currentFields, setCurrentFields] = useState<FormField[]>([]);

  // load templates from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as FormTemplate[];
        setTemplates(parsed);
      }
    } catch (err) {
      console.error("Failed to load templates from localStorage", err);
    }
  }, []);

  // sync templates to localStorage whenever templates change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    } catch (err) {
      console.error("Failed to persist templates to localStorage", err);
    }
  }, [templates]);

  const addTemplate = (title: string) => {
    const newTemplate: FormTemplate = {
      id: uuidv4(),
      title,
      fields: currentFields.map((f) => ({ ...f })), // deep-ish copy
      createdAt: new Date().toISOString(),
    };
    setTemplates((prev) => [...prev, newTemplate]);
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const resetCurrent = () => {
    setCurrentFields([]);
  };

  return (
    <FormContext.Provider
      value={{
        templates,
        setTemplates,
        addTemplate,
        deleteTemplate,
        currentFields,
        setCurrentFields,
        resetCurrent,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormData = () => {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormData must be used within FormProvider");
  return ctx;
};
