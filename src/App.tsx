// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateForm from "./components/pages/CreateForm";
import PreviewForm from "./components/pages/PreviewForm";
import Home from "./components/pages/Home";
import { FormProvider } from "./components/data/FormContext";
import Navbar from "./components/Navbar";
import MyForms from "./components/pages/MyForms";

function App() {
  return (
    <Router>
      <FormProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateForm />} />
          <Route path="/preview" element={<PreviewForm />} />
          <Route path="/myforms" element={<MyForms />} />
        </Routes>
      </FormProvider>
    </Router>
  );
}

export default App;
