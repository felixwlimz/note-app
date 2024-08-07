import axios from "axios";
import { useCallback, useMemo } from "react";
import { toast } from "react-toastify";

const BASE_URL = "https://notes-api.dicoding.dev/v1";

export type NoteInput = {
  title: string;
  body: string;
};

export default function useNoteApi(token: string) {
  const headers = useMemo(() => {
    return {
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  const getAllNotes = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/notes`, {
        headers: headers,
      });
      return response.data.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }, [headers]);

  const createNote = useCallback(
    async (note: NoteInput) => {
      try {
        const response = await axios.post(`${BASE_URL}/notes`, note, {
          headers: headers,
        });
        toast.success("Note added successfully");
        return response.data;
      } catch (error) {
        return error;
      }
    },
    [headers]
  );

  const getArchivedNotes = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/notes/archived`, {
        headers: headers,
      });

      return response.data.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }, [headers]);

  const getNote = useCallback(
    async (noteId: string) => {
      try {
        const response = await axios.get(`${BASE_URL}/notes/${noteId}`, {
          headers: headers,
        });

        return response.data.data;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    [headers]
  );

  const deleteNote = useCallback(
    async (noteId: string) => {
      try {
        const response = await axios.delete(`${BASE_URL}/notes/${noteId}`, {
          headers: headers,
        });
        toast.success("Note Deleted");
        return response.data;
      } catch (error) {
        return error;
      }
    },
    [headers]
  );

  const archiveNote = useCallback(
    async (noteId: string) => {
      try {
        const response = await axios.post(
          `${BASE_URL}/notes/${noteId}/archive`,
          {},
          {
            headers: headers,
          }
        );
        toast.success("Note archived");
        return response.data;
      } catch (error) {
        return error;
      }
    },
    [headers]
  );

  const unArchiveNote = useCallback(
    async (noteId: string) => {
      try {
        const response = await axios.post(
          `${BASE_URL}/notes/${noteId}/unarchive`,
          {},
          {
            headers: headers,
          }
        );
        toast.success("Note Unarchived");
        return response.data;
      } catch (error) {
        return error;
      }
    },
    [headers]
  );

  return {
    getAllNotes,
    createNote,
    getArchivedNotes,
    getNote,
    deleteNote,
    archiveNote,
    unArchiveNote,
  };
}
