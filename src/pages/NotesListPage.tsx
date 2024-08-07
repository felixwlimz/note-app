import {
  Container,
  Grid,
  Group,
  LoadingOverlay,
  TextInput,
  Title,
} from "@mantine/core";
import useNoteApi from "../hooks/useNoteApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { plainToInstance } from "class-transformer";
import { Note } from "../models/note";
import { NoteCard } from "../components/NoteCard";
import { FloatingBar } from "../components/FloatingBar";
import { CiLogout } from "react-icons/ci";
import { MenuDropdown } from "../components/MenuDropdown";
import {
  FaArchive,
  FaRegUserCircle,
  FaSort,
  FaSortAlphaDown,
  FaSortAlphaUp,
} from "react-icons/fa";
import { useMemo, useState } from "react";
import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

enum SortType {
  OldestAdded,
  NewestAdded,
  AtoZ,
  ZtoA,
}

export const NotesListPage = () => {

  const token = sessionStorage.getItem("TOKEN");
  const { getAllNotes, deleteNote, archiveNote } = useNoteApi(token!);
  const [userDropdownOpened, setUserDropdownOpened] = useState(false);
  const [filterDropdownOpened, setFilterDropdownOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState(SortType.AtoZ);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const key = ["notes"];

  const { data, isLoading, isError } = useQuery({
    queryKey: key,
    queryFn: () => getAllNotes(),
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: key,
      });
    },
  });
  const { mutate: archiveMutate } = useMutation({
    mutationFn: (id: string) => archiveNote(id),
    onSuccess: async () => {
      queryClient.refetchQueries({
        queryKey: key,
      });
    },
  });

  const notes = useMemo(
    () => plainToInstance(Note, (data as Note[]) ?? []),
    [data]
  );

  const onDelete = (id: string) => () => {
    deleteMutate(id);
  };

  const onArchive = (id: string) => () => {
    archiveMutate(id);
  };

  const filteredNotes = useMemo(() => {
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.body.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notes, searchQuery]);

  const sortedNotes = useMemo(() => {
    switch (sortType) {
      case SortType.OldestAdded:
        return filteredNotes.sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        );
      case SortType.NewestAdded:
        return filteredNotes.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      case SortType.AtoZ:
        return filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
      case SortType.ZtoA:
        return filteredNotes.sort((a, b) => b.title.localeCompare(a.title));
    }
  }, [filteredNotes, sortType]);


  const filterDropdown = [
    {
      leadingIcon: <HiSortAscending />,
      label: "Sort By Oldest Added",
      onClick: () => setSortType(SortType.OldestAdded),
    },
    {
      leadingIcon: <HiSortDescending />,
      label: "Sort By Newest Added",
      onClick: () => setSortType(SortType.NewestAdded),
    },
    {
      leadingIcon: <FaSortAlphaUp />,
      label: "A to Z",
      onClick: () => setSortType(SortType.AtoZ),
    },
    {
      leadingIcon: <FaSortAlphaDown />,
      label: "Z to A",
      onClick: () => setSortType(SortType.ZtoA),
    },
  ];
  


  const userDropdown = [
    {
      leadingIcon: <CiLogout />,
      label: "Logout",
      onClick: () => {
        sessionStorage.removeItem("TOKEN");
        navigate("/login", { replace: true });
      },
    },
  ];

  if (isLoading) return <LoadingOverlay />;

  if (isError || !token) return <Title>There was an error</Title>;

  return (
    <Container>
      <ToastContainer />
      <Group justify="space-between">
        <Title>Welcome to Notes </Title>
        <Group gap={20}>
          <FaArchive
            onClick={() => navigate("archived")}
            size={25}
            style={{ cursor: "pointer" }}
          />

          <MenuDropdown
            items={userDropdown}
            icon={<FaRegUserCircle size={25} style={{ marginTop: 5 }} />}
            isOpen={userDropdownOpened}
            onChange={(open) => setUserDropdownOpened(open)}
          />
        </Group>
      </Group>

      <Group>
        <TextInput
          my={20}
          radius="xl"
          style={{ width: 800 }}
          placeholder="Search for Notes.."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
        />
        <MenuDropdown
          items={filterDropdown}
          icon={<FaSort size={25} />}
          isOpen={filterDropdownOpened}
          onChange={(open) => setFilterDropdownOpened(open)}
        />
      </Group>

      <Grid>
        {sortedNotes.map((note) => (
          <Grid.Col key={note.id} span={4}>
            {" "}
            <NoteCard
              onClick={() => navigate(`${note.id}`)}
              note={note}
              onDelete={onDelete(note.id)}
              onArchive={onArchive(note.id)}
            />
          </Grid.Col>
        ))}
      </Grid>

      <FloatingBar />
    </Container>
  );
};
