import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import { Note } from "../models/note";
import { MdDelete, MdUnarchive } from "react-icons/md";
import { IoMdArchive } from "react-icons/io";

type NoteCardProps = {
  note: Note;
  onClick: () => void;
  onDelete: () => void;
  onArchive?: () => void;
  onUnarchive?: () => void;
};

export const NoteCard = ({
  note,
  onClick,
  onDelete,
  onArchive,
  onUnarchive,
}: NoteCardProps) => {
  return (
    <Card shadow="sm" padding="lg" radius="lg" withBorder>
      <Stack gap={10}>
        <Group justify="space-between" mt="md" mb="xs">
          <Text
            fw={700}
            size="xl"
            onClick={onClick}
            style={{ cursor: "pointer" }}
          >
            {note.title}
          </Text>
          <Group>
            <MdDelete onClick={onDelete} style={{ cursor: "pointer" }} />
            {note.archived ? (
              <MdUnarchive
                onClick={onUnarchive}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <IoMdArchive onClick={onArchive} style={{ cursor: "pointer" }} />
            )}
          </Group>
        </Group>
        <Badge color="red">{note.createdAt.toUTCString()}</Badge>
        <Text size="md">{note.body}</Text>
      </Stack>
    </Card>
  );
};
