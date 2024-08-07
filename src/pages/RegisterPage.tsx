import {
  Button,
  Flex,
  PasswordInput,
  TextInput,
  Text,
  Title,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import useAuth, { RegisterRequest } from "../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";

export const RegisterPage = () => {
  const registerForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate: {
      name: (value: string) => (!value ? "Name must not be empty" : null),
      email: (value: string) => {
        if (!value.trim()) {
          return "Email must not be empty";
        }
        if (!/^\S+@\S+\.\S+$/.test(value)) {
          return "Please enter a valid email";
        }
      },
      password: (value: string) => {
        if (!value.trim()) {
          return "Password must not be empty";
        }
        if (value.length < 8) {
          return "Password must be more than 8 characters";
        }
      },
    },
  });
  const navigate = useNavigate();

  const { register } = useAuth();
  const { mutate } = useMutation({
    mutationFn: async (req: RegisterRequest) => await register(req),
    onSuccess: (data) => {
      console.log(data);
      if (data.response.status === 400) {
        toast.error("User has already taken");
      } else {
        navigate("/login");
      }
    },
    onError: (err) => {
      console.log(err);
      toast.error("An error occured, please try again");
    },
  });

  const handleRegister = (values: RegisterRequest) => {
    registerForm.validate();
    mutate(values);
  };

  return (
    <form onSubmit={registerForm.onSubmit((values) => handleRegister(values))}>
      <Flex
        direction="column"
        p={20}
        align="center"
        gap={20}
        style={{ width: "100%" }}
      >
        <ToastContainer />

        <Title my={4} fw={700}>
          Create an account
        </Title>

        <TextInput
          my={10}
          radius="xl"
          label="Name"
          placeholder="Enter your name"
          style={{ width: 500, height: 40 }}
          key={registerForm.key("name")}
          {...registerForm.getInputProps("name")}
        />
        <TextInput
          my={10}
          radius="xl"
          label="Email"
          placeholder="Enter your email"
          style={{ width: 500, height: 40 }}
          key={registerForm.key("email")}
          {...registerForm.getInputProps("email")}
        />
        <PasswordInput
          my={10}
          width={500}
          radius="xl"
          label="Password"
          placeholder="Enter your password"
          style={{ width: 500, height: 40 }}
          key={registerForm.key("password")}
          {...registerForm.getInputProps("password")}
        />

        <Button
          style={{ width: 500, height: 40 }}
          mt={10}
          type="submit"
          radius="xl"
        >
          Register
        </Button>
        <Text>
          Already registered?{" "}
          <Anchor onClick={() => navigate("/login")}>Login</Anchor>
        </Text>
      </Flex>
    </form>
  );
};
