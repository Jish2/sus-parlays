import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { PhoneInput } from "@/components/ui/phone-input";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

async function sendCode(phone: string) {
  try {
    await fetch("/api/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    return true;
  } catch (error) {
    console.error("Error sending code:", error);
    return false;
  }
}

async function verifyCode(phone: string, code: string) {
  try {
    const res = await fetch("/api/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });

    const data = await res.json();
    return data.success;
  } catch (error) {
    console.error("Error verifying code:", error);
    return false;
  }
}

export default function Verification() {
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleSendCode = async () => {
    if (!phone) {
      toast.error("Please enter a phone number");
      return;
    }

    setIsLoading(true);
    setCode("");
    const success = await sendCode(phone);
    setIsLoading(false);

    if (success) {
      setIsCodeSent(true);
      toast.success("Verification code sent!");
    } else {
      toast.error("Failed to send verification code. Please try again.");
    }
  };

  const handleVerifyCode = useCallback(async () => {
    if (!code) {
      toast.error("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    const isValid = await verifyCode(phone, code);
    setIsLoading(false);

    if (isValid) {
      setIsVerified(true);
      toast.success("Phone number verified successfully!");
      // Here you would typically update your global auth state
      // For example: setAuth({ isLoggedIn: true, phone })
    } else {
      toast.error("Invalid verification code. Please try again.");
    }
  }, [code, phone]);

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      if (!isCodeSent && phone) {
        await handleSendCode();
      } else if (isCodeSent && code.length === 6) {
        await handleVerifyCode();
      }
    }
  };

  useEffect(() => {
    if (code.length === 6 && isCodeSent && !isLoading) {
      handleVerifyCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (isVerified) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-green-600 font-semibold">
          ✓ Phone number verified successfully!
        </div>
        <div className="text-sm text-gray-600">You are now logged in.</div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col space-y-6 w-full max-w-md mx-auto p-6"
      onKeyDown={handleKeyPress}
    >
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <PhoneInput
          value={phone}
          onChange={(value) => setPhone(value)}
          defaultCountry="US"
          disabled={isCodeSent || isLoading}
        />
        {!isCodeSent && (
          <button
            onClick={handleSendCode}
            disabled={isLoading || !phone}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Verification Code"}
          </button>
        )}
      </div>

      {isCodeSent && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Enter Verification Code
          </label>
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            disabled={isLoading}
            autoFocus
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <div className="flex flex-col space-y-2">
            <button
              onClick={handleVerifyCode}
              disabled={isLoading || code.length !== 6}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>
            <button
              onClick={handleSendCode}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Resend Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
