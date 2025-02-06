import LoginForm from "@/components/forms/login-form";
import SignUpForm from "@/components/forms/signup-form";

export default function Home() {
  return (
    <section className="flex items-center justify-center gap-4 py-8 md:py-10 border h-full">
      <LoginForm />
      <SignUpForm />
    </section>
  );
}
