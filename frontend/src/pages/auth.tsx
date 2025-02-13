import { lazy, Suspense } from "react";
import { Navigate, useParams } from "react-router-dom";

import { Paths } from "@/config/site";
import { AnimatedUseCases } from "@/components/custom/text-loop-custom-variants-transition";

const SignUp = lazy(() => import("@/components/forms/signup-form"));
const Login = lazy(() => import("@/components/forms/login-form"));
const OtpForm = lazy(() => import("@/components/forms/otp-form"));

export default function Auth() {
  const { form } = useParams();

  const renderForm = () => {
    switch (form) {
      case "signup":
        return <SignUp />;
      case "login":
        return <Login />;
      case "otp":
        return <OtpForm />;
      default:
        return <Navigate to={Paths.NOT_FOUND} />;
    }
  };

  return (
    <section className="grid grid-cols-2 min-h-screen bg-foreground">
      <div className="flex-center text-white flex flex-col justify-center relative">
        <div className="bg-[url(/src/assets/images/pattern-1.png)] dark:bg-[url(/src/assets/images/bg-pattern-black.png)] h-full w-full absolute bg-repeat opacity-15" />
        <AnimatedUseCases />
      </div>
      <div className="bg-white dark:bg-foreground flex-center">
        <Suspense fallback="Loading...">{renderForm()}</Suspense>
      </div>
    </section>
  );
}
