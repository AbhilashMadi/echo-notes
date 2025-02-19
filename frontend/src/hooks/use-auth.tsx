import { useAppSelector } from "./redux-hooks";

const useAuth = () => {
  const user = useAppSelector((s) => s.auth.user);

  return {
    isAuthenticated: !!user,
    user,
  };
};

export default useAuth;
