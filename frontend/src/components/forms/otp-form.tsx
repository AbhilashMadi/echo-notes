import { Button, Form, InputOtp, Link } from "@heroui/react";

export default function OtpForm() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <p className="pb-4 text-left text-3xl font-semibold">
          Fast fingers win, slow ones retry!
          <span aria-label="emoji" className="ml-2 inline-flex" role="img">
            <img
              alt="Face with Peeking Eye"
              height="30"
              src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Peeking%20Eye.png"
              width="30"
            />
          </span>
        </p>
        <Form className="" validationBehavior="native">
          <InputOtp
            isRequired
            aria-label="OTP input field"
            length={6}
            name="otp"
            placeholder="Enter code"
            size="lg"
            validationBehavior="native"
          />
          <Button
            className="w-full"
            color="primary"
            type="submit"
            variant="shadow"
          >
            Submit It
          </Button>
        </Form>
        <p className="text-center text-small">
          <Link href="#" size="sm">
            Magic numbers coming your way… again! after 1min{" "}
          </Link>
        </p>
      </div>
    </div>
  );
}
