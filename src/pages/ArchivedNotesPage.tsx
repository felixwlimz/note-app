import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useNoteApi from "../hooks/useNoteApi";
import { Container, Grid, Title } from "@mantine/core";
import { useMemo } from "react";
import { plainToInstance } from "class-transformer";
import { Note } from "../models/note";
import { NoteCard } from "../components/NoteCard";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export const ArchivedNotesPage = () => {
  const token = sessionStorage.getItem("TOKEN");
  const { getArchivedNotes, deleteNote, unArchiveNote } = useNoteApi(token!);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const key = ["notes", "archived"];

  const { data, isLoading, isError } = useQuery({
    queryKey: key,
    queryFn: () => getArchivedNotes(),
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: key,
      });
    },
  });

  const { mutate: unArchiveMutate } = useMutation({
    mutationFn: (id: string) => unArchiveNote(id),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: key,
      });
    },
  });

  const onDelete = (id: string) => () => {
    deleteMutate(id);
  };

  const onUnarchive = (id: string) => () => {
    unArchiveMutate(id);
  };

  const archivedNotes = useMemo(
    () => plainToInstance(Note, (data as Note[]) ?? []),
    [data]
  );

  if (isLoading) return <h1>Loading...</h1>;

  if (isError || !token) return <h1>Error</h1>;

  if (archivedNotes.length === 0)
    return <h3>There are currently no archived Notes</h3>;

  return (
    <Container>
      <ToastContainer />
      <Title>Archived Notes </Title>
      <Grid mt={20}>
        {archivedNotes.map((note) => (
          <Grid.Col key={note.id} span={4}>
            {" "}
            <NoteCard
              onClick={() => navigate(`/notes/${note.id}`)}
              note={note}
              onDelete={onDelete(note.id)}
              onUnarchive={onUnarchive(note.id)}
            />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};
