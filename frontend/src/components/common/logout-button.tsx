import { Button } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { FC } from "react";

import { useLogoutMutation } from "@/context/auth-api";

const LogOutButton: FC = () => {
  const [logout, { isLoading }] = useLogoutMutation();

  return (
    <Button
      className="w-full"
      color="danger"
      endContent={<Icon height="24" icon="uit:signout" width="24" />}
      isLoading={isLoading}
      variant="flat"
      onPress={logout}
    >
      Logout
    </Button>
  );
};

export default LogOutButton;
