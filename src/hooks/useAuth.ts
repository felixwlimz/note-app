import axios from "axios";
import { useCallback } from "react";
import { toast } from "react-toastify";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
} & LoginRequest;

const BASE_URL = "https://notes-api.dicoding.dev/v1";

export default function useAuth() {
  const login = useCallback(async (req: LoginRequest) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, req);
      toast.success("Login successful!");
      return response.data;
    } catch (error) {
      return error;
    }
  }, []);

  const register = useCallback(async (req: RegisterRequest) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, req);
      toast.success("Registration successfull");
      return response.data;
    } catch (error) {
      return error;
    }
  }, []);

  const getUser = useCallback(async (token: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        return response.data;
      }
      if (response.status === 401) {
        return response.statusText;
      }
    } catch (error) {
      return error;
    }
  }, []);

  return { login, register, getUser };
}
