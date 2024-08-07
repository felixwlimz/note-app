import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useNoteApi from "../hooks/useNoteApi";
import { Container, Stack, Text, Title } from "@mantine/core";
import { plainToInstance } from "class-transformer";
import { Note } from "../models/note";

export const NoteDetailPage = () => {
  const token = sessionStorage.getItem("TOKEN");

  const { getNote } = useNoteApi(token!);
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", id],
    queryFn: () => getNote(id!),
  });

  const note = plainToInstance(Note, data);

  if (isLoading) {
    return <Title>Loading....</Title>;
  }

  if (isError || !token) {
    return <Text>There was an error</Text>;
  }

  return (
    <Container mt={20}>
      <Stack gap={30}>
        <Title>{note.title}</Title>
        <Text size="xl">{note.body}</Text>
      </Stack>
    </Container>
  );
};
