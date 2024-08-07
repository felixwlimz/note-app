import { ActionIcon, Affix } from "@mantine/core";
import { IoAdd } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export const FloatingBar = () => {
  
  const navigate = useNavigate();
  return (
    <>
      <Affix position={{ bottom: 40, right: 40 }}>
        <ActionIcon
          color="blue"
          radius="xl"
          size={60}
          onClick={() => navigate('/create')}
        >
          <IoAdd size={30} />
        </ActionIcon>
      </Affix>
    </>
  );
};
