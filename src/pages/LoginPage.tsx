import {
  Anchor,
  Button,
  Flex,
  Text,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import useAuth, { LoginRequest } from "../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import { toast, ToastContainer } from "react-toastify";

export const LoginPage = () => {
  const loginForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value: string) => {
        if (!value.trim()) {
          return "Email must not be empty ";
        }
        if (!/^\S+@\S+\.\S+$/.test(value)) {
          return "Please enter valid email";
        }

        return null;
      },
      password: (value: string) => {
        if (!value.trim()) {
          return "Password must not be empty";
        }
      },
    },
  });

  const { login } = useAuth();

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: async (req: LoginRequest) => await login(req),
    onSuccess: (data) => {
      if (!data) {
        toast.error("Incorrect email or password");
      } else {
        sessionStorage.setItem("TOKEN", data.data.accessToken);
        navigate("/notes", { replace: true });
      }
    },
    onError: (err) => {
      toast.error("An error occurred");
      console.log(err.message);
    },
  });

  const handleLogin = (values: LoginRequest) => {
    loginForm.validate();
    mutate(values);
  };

  return (
    <form onSubmit={loginForm.onSubmit((values) => handleLogin(values))}>
      <ToastContainer />
      <Flex
        direction="column"
        p={20}
        align="center"
        gap={20}
        style={{ width: "100%" }}
      >
        <Title my={4} fw={700}>
          Login
        </Title>
        <TextInput
          my={10}
          radius="xl"
          label="Email"
          placeholder="Enter your email"
          style={{ width: 500, height: 40 }}
          key={loginForm.key("email")}
          {...loginForm.getInputProps("email")}
        />
        <PasswordInput
          my={10}
          radius="xl"
          label="Password"
          placeholder="Enter your password"
          style={{ width: 500, height: 40 }}
          key={loginForm.key("password")}
          {...loginForm.getInputProps("password")}
        />

        <Button
          style={{ width: 500, height: 40 }}
          my={10}
          type="submit"
          radius="xl"
        >
          Login
        </Button>
        <Text>
          Dont have an account?{" "}
          <Anchor onClick={() => navigate("/register")}>
            Create a new account
          </Anchor>
        </Text>
      </Flex>
    </form>
  );
};
