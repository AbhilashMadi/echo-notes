import { lazy, Suspense } from "react";
import { Navigate, useParams } from "react-router-dom";

import { Paths } from "@/config/site";
import { AnimatedUseCases } from "@/components/custom/text-loop-custom-variants-transition";

const SignupForm = lazy(() => import("@/components/forms/signup-form"));
const LoginForm = lazy(() => import("@/components/forms/login-form"));
const OtpForm = lazy(() => import("@/components/forms/otp-form"));

export default function Auth() {
  const { form } = useParams();

  const renderForm = () => {
    switch (form) {
      case "signup":
        return <SignupForm />;
      case "login":
        return <LoginForm />;
      case "otp":
        return <OtpForm />;
      default:
        return <Navigate to={Paths.NOT_FOUND} />;
    }
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-primary">
      <div className="flex-center text-white flex flex-col justify-center relativem">
        <div
          className="
        bg-[url(/src/assets/images/pattern-1.png)] 
        dark:bg-[url(/src/assets/images/bg-pattern-black.png)] 
        h-full w-full absolute bg-repeat opacity-30"
        />
        <AnimatedUseCases />
      </div>
      <div className="bg-white dark:bg-foreground flex-center font-primary">
        <Suspense fallback="Loading...">{renderForm()}</Suspense>
      </div>
    </section>
  );
}
