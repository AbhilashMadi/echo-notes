import { Alert, Button, Form, InputOtp } from "@heroui/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import {
  useResendOtpMutation,
  useVerifyEmailMutation,
} from "@/context/auth-api";
import useGlobalContext from "@/hooks/context-hooks";
import { Paths } from "@/config/site";

export default function OtpForm() {
  const [otp, setOtp] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const { navigate } = useGlobalContext();

  const [verify, { isLoading: isVerifying, data, isSuccess, isError, error }] =
    useVerifyEmailMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  // Handle OTP input change
  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  // Handle OTP form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (otp.length !== 6) return;

    try {
      const response = await verify({ otp }).unwrap();

      if (response.success) {
        navigate(Paths.DASHBOARD);
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
    }
  };

  // Handle Resend OTP
  const handleResendOTP = async (): Promise<void> => {
    setTimeLeft(60); // Reset timer

    try {
      await resendOtp({}).unwrap();
    } catch (error) {
      console.error("Resend OTP Error:", error);
    }
  };

  // Countdown timer for OTP resend
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

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

        {isSuccess && <Alert color="success" title={data?.message} />}
        {isError && (
          <Alert
            color="danger"
            title={error?.data?.message || "Invalid OTP. Try again!"}
          />
        )}

        <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <InputOtp
            isRequired
            aria-label="OTP input field"
            color={isError ? "danger" : "primary"}
            isDisabled={isVerifying}
            length={6}
            name="otp"
            placeholder="Enter code"
            size="lg"
            validationBehavior="native"
            value={otp}
            onChange={handleOtpChange}
          />
          <Button
            className="w-full"
            color="primary"
            isDisabled={isVerifying || otp.length !== 6}
            type="submit"
            variant="shadow"
          >
            {isVerifying ? "Verifying..." : "Submit"}
          </Button>
        </Form>

        <p className="text-center text-sm">
          {timeLeft > 0 ? (
            <span className="text-gray-500">
              Magic numbers coming your way… again! after{" "}
              <strong className="font-mono">{timeLeft} sec</strong>
            </span>
          ) : (
            <div className="flex gap-2">
              <Button
                className="w-full mt-2"
                color="primary"
                variant="flat"
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
              <Button
                className="w-full mt-2"
                color="primary"
                isDisabled={isResending}
                variant="solid"
                onClick={handleResendOTP}
              >
                {isResending ? "Resending..." : "Resend OTP"}
              </Button>
            </div>
          )}
        </p>
      </div>
    </div>
  );
}
