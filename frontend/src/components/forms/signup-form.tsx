import React, { FormEvent } from "react";
import { Button, Input, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Alert } from "@heroui/alert";

import { Paths } from "@/config/site";
import { useSignupMutation } from "@/context/auth-api";
import useGlobalContext from "@/hooks/context-hooks";

export default function SignupForm() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
  const [register, { isLoading, isError, error }] = useSignupMutation();
  const { navigate } = useGlobalContext();

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = await register(
      Object.fromEntries(new FormData(e.currentTarget)),
    );

    if (data?.success) navigate(Paths.OTP);
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <p className="pb-4 text-left text-3xl font-semibold">
          Your ideas deserve better than napkins!
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            isRequired
            disabled={isLoading}
            label="Username"
            labelPlacement="outside"
            name="username"
            placeholder="Enter your username"
            type="text"
            variant="bordered"
          />
          <Input
            isRequired
            disabled={isLoading}
            label="Email"
            labelPlacement="outside"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
          />
          <Input
            isRequired
            disabled={isLoading}
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Password"
            labelPlacement="outside"
            name="password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
          />
          <Input
            isRequired
            disabled={isLoading}
            endContent={
              <button type="button" onClick={toggleConfirmVisibility}>
                {isConfirmVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Confirm Password"
            labelPlacement="outside"
            name="confirmPassword"
            placeholder="Confirm your password"
            type={isConfirmVisible ? "text" : "password"}
            variant="bordered"
          />
          {isError && (
            <Alert
              color="danger"
              description={
                <ul className="text-xs list-disc list-inside">
                  {error?.data?.error?.messages?.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              }
              title={error?.data?.message}
            />
          )}
          <Button color="primary" isLoading={isLoading} type="submit">
            Sign Up
          </Button>
        </form>
        <p className="text-center text-small">
          <Link href={Paths.LOGIN} size="sm">
            Already have an account? Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
