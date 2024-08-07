import { Container } from "@mantine/core";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { NotesListPage } from "./pages/NotesListPage";
import { CreateNotePage } from "./pages/CreateNotePage";
import { NoteDetailPage } from "./pages/NoteDetailPage";
import PrivateRoute from "./providers/PrivateRoute";
import { AuthProvider } from "./providers/AuthProvider";
import { ArchivedNotesPage } from "./pages/ArchivedNotesPage";

function App() {
  return (
    <Container mt={10} p={10}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" index element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/notes" element={<NotesListPage />} />
              <Route path="/create" element={<CreateNotePage />} />
              <Route path="/notes/:id" element={<NoteDetailPage />} />
              <Route path="/notes/archived" element={<ArchivedNotesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Container>
  );
}

export default App;
