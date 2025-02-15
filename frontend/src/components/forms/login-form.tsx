import { Alert, Button, Checkbox, Form, Input, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import React, { FormEvent } from "react";

import { Paths } from "@/config/site";
import { useLoginMutation } from "@/context/auth-api";
import { ServerKeys } from "@/resources/serverkeys";

export default function LoginForm() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [login, { isLoading, isError, error }] = useLoginMutation();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    login({
      [ServerKeys.EMAIL]: data[ServerKeys.EMAIL],
      [ServerKeys.PASSWORD]: data[ServerKeys.PASSWORD],
      [ServerKeys.REMEMBER]: ServerKeys.REMEMBER in data,
    });
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <p className="pb-4 text-left text-3xl font-semibold">
          Login fast, ideas won’t wait!
          <span aria-label="emoji" className="ml-2 inline-flex" role="img">
            <img
              alt="Rocket"
              height="30"
              src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png"
              width="30"
            />
          </span>
        </p>
        <Form
          className="flex flex-col gap-4"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <Input
            isRequired
            label="Email"
            labelPlacement="outside"
            name={ServerKeys.EMAIL}
            placeholder="Enter your email"
            type="email"
            variant="bordered"
          />
          <Input
            isRequired
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
            errorMessage={"formik.errors[ServerKeys.PASSWORD]"}
            label="Password"
            labelPlacement="outside"
            name={ServerKeys.PASSWORD}
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
          />
          <div className="flex w-full items-center justify-between px-1 py-2">
            <Checkbox defaultSelected name={ServerKeys.REMEMBER} size="sm">
              Remember me
            </Checkbox>
            <Link className="text-default-500" href="#" size="sm">
              Forgot password?
            </Link>
          </div>
          {isError && (
            <Alert
              color="danger"
              description={
                <ul className="text-xs list-disc list-inside">
                  {error?.data?.error?.messages.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              }
              title={error?.data?.message}
            />
          )}
          <Button
            className="w-full"
            color="primary"
            isLoading={isLoading}
            type="submit"
            variant="shadow"
          >
            Log In
          </Button>
        </Form>
        <p className="text-center text-small">
          <Link href={Paths.SIGNUP} size="sm">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
