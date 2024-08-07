import {
  Button,
  Container,
  Flex,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import useNoteApi, { NoteInput } from "../hooks/useNoteApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const CreateNotePage = () => {
  const token = sessionStorage.getItem("TOKEN");

  const { createNote } = useNoteApi(token!);
  const navigate = useNavigate();

  const createNoteForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      body: "",
    },
    validate: {
      title: (value: string) => (!value ? "Title must not be empty" : null),
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (note: NoteInput) => await createNote(note),
    onSuccess: () => {
      navigate("/notes");
    },
    onError: (err) => {
      toast.error("An error occured")
      console.log(err);
    },
  });

  const handleCreateNoteForm = (value: NoteInput) => {
    createNoteForm.validate();
    mutate(value);
  };

  if (!token) return <Title>There was an error fetching Token</Title>;

  return (
    <Container>
      <form
        onSubmit={createNoteForm.onSubmit((value) =>
          handleCreateNoteForm(value)
        )}
      >
        <Flex direction="column" p={20} align="center" gap={20}>
          <Title>Create New Note</Title>
          <TextInput
            my={10}
            radius="xl"
            label="Title"
            placeholder="Title"
            height={40}
            style={{ width: 700 }}
            key={createNoteForm.key("title")}
            {...createNoteForm.getInputProps("title")}
          />

          <Textarea
            my={10}
            radius="md"
            label="Body"
            style={{ width: 700 }}
            placeholder="Body"
            rows={10}
            key={createNoteForm.key("body")}
            {...createNoteForm.getInputProps("body")}
          />

          <Button style={{ width: 700 }} my={10} type="submit" radius="xl">
            Create New Note
          </Button>
        </Flex>
      </form>
    </Container>
  );
};
