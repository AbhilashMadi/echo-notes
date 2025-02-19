import { Button } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { FC } from "react";

import { useLogoutMutation } from "@/context/auth-api";
import { useTheme } from "@/hooks/use-theme";

const LogOutButton: FC = () => {
  const [logout, { isLoading }] = useLogoutMutation();
  const { setLightTheme } = useTheme();

  const handleLogOut = async (): Promise<void> => {
    await logout({});
    setLightTheme();
  };

  return (
    <Button
      className="w-full"
      color="danger"
      endContent={<Icon height="24" icon="uit:signout" width="24" />}
      isLoading={isLoading}
      variant="flat"
      onPress={handleLogOut}
    >
      Logout
    </Button>
  );
};

export default LogOutButton;
