import { Menu, UnstyledButton } from "@mantine/core";

type ItemProps = {
  leadingIcon : React.ReactNode,
  label : string, 
  onClick? : () => void 
}

type MenuDropdownProps = {
  icon : React.ReactNode,
  items : ItemProps[],
  onChange : (isOpen : boolean) => void,
  isOpen : boolean
}

export const MenuDropdown = (menuProps : MenuDropdownProps) => {

  

  return (
    <Menu
      position="bottom"
      width={200}
      opened={menuProps.isOpen}
      onChange={menuProps.onChange}
      withArrow
    >
      <Menu.Target>
        <UnstyledButton>{menuProps.icon}</UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        {menuProps.items.map((item, id) => (
          <Menu.Item
            leftSection={item.leadingIcon}
            onClick={() => {
              item.onClick?.();
            }}
            key={id}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
