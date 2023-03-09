import { XIcon } from "@heroicons/react/solid";
import { firebaseApp } from "@modules/auth/firebase/client";
import {
  getAuth,
  verifyPasswordResetCode,
  applyActionCode,
  confirmPasswordReset,
} from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState, useRef, SetStateAction, Dispatch } from "react";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { Spinner } from "@components/index";
import { NextComponentType, NextPageContext } from "next";
import { Tooltip } from "@components/index";
import Image from "next/image";
import Link from "next/link";
const errorDictionary = {
  "auth/expired-action-code": {
    devCode: "Thrown if the password reset code has expired.",
    userCode: "Expired action token.",
  },
  "auth/invalid-action-code": {
    devCode:
      "Thrown if the password reset code is invalid. This can happen if the code is malformed or has already been used.",
    userCode: "Invalid or expired action token.",
  },
  "auth/user-disabled": {
    devCode:
      "Uuser corresponding to the given password reset code has been disabled.",
    userCode: "This account has been disabled.",
  },
  "auth/user-not-found": {
    devCode:
      "No user corresponding to the password reset code. This may have happened if the user was deleted between when the code was issued and when this method was called.",
    userCode: "This user does not exist.",
  },
  "auth/weak-password": {
    devCode: "Thrown if the new password is not strong enough.",
    userCode: "Password is too weak.",
  },
};
const handleError = (error: string) => {
  const foundError = errorDictionary[error as keyof typeof errorDictionary];
  if (!error || !foundError) return "An unexpected error occured.";
  return foundError.userCode;
};

export default function Page() {
  const auth = getAuth(firebaseApp);
  const firstRenderRef = useRef(true);
  const router = useRouter();
  const { oobCode, mode } = router.query;
  const [loading, setLoading] = useState(true);
  const [submitPasswordLoading, setSubmitPasswordLoading] = useState(false);
  const [submitPasswordError, setSubmitPasswordError] = useState("");
  const [passwordCodeVerified, setPasswordCodeVerified] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const submitPassword = (password: string) => {
    confirmPasswordReset(auth, oobCode as string, password)
      .then(() => {
        setSubmitPasswordLoading(false);
        setSuccess(true);
      })
      .catch((e) => {
        setError(handleError(e.code));
        setSubmitPasswordError(handleError(e.code));
      });
  };

  useEffect(() => {
    if (firstRenderRef.current && router.isReady) {
      switch (mode) {
        case "resetPassword":
          verifyPasswordResetCode(auth, oobCode as string)
            .then(() => {
              setLoading(false);
              setPasswordCodeVerified(true);
            })
            .catch((e) => {
              setLoading(false);
              setError(handleError(e.code));
            });
          break;
        case "verifyEmail":
          applyActionCode(auth, oobCode as string)
            .then(() => {
              setLoading(false);
              setEmailVerified(true);
            })
            .catch((e) => {
              setLoading(false);
              setError(handleError(e.code));
            });
          break;
        default:
          router.replace("/");
          break;
      }
      firstRenderRef.current = false;
      return;
    }
    console.log("running use effect");
  }, [router.isReady, auth, mode, oobCode, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center dark:bg-black  ">
        <Image
          height={100}
          width={100}
          alt="loading animation"
          src="/loading.svg"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center dark:bg-black  ">
        <div className="w-full max-w-lg space-y-14 rounded-2xl border border-zinc-900 p-10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-medium text-zinc-100">
              screenshotify
            </h1>
            <Tooltip label="logout">
              <Link href="/">
                <XIcon className="h-5 w-5 text-white" />
              </Link>
            </Tooltip>
          </div>
          <div className=" space-y-4">
            <h1 className="text-3xl font-bold text-zinc-100">Uh oh..</h1>
            <p className="text-sm font-medium text-zinc-400">{error}</p>
          </div>
          <div className="space-y-3">
            <Link href="/">
              <a className="flex w-full items-center justify-center rounded-lg border border-blue-900 bg-blue-500 p-4 font-medium tracking-wide text-zinc-100 hover:bg-blue-400">
                Try again
              </a>
            </Link>
            <Link href="mailto:support@screenshotify.io">
              <a className=" flex w-full items-center justify-center rounded-lg border border-zinc-800 p-4 font-medium tracking-wide text-zinc-100 hover:bg-zinc-900 hover:bg-opacity-30">
                Contact Support
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  if (emailVerified) {
    return (
      <div className="flex h-screen w-screen items-center justify-center dark:bg-black  ">
        <div className="w-full max-w-lg space-y-14 rounded-2xl border border-zinc-900 p-10">
          <h1 className="text-3xl font-medium text-zinc-100">screenshotify</h1>

          <div className=" space-y-4">
            <h1 className="text-3xl font-bold text-zinc-100">Email verified</h1>
            <p className="text-sm font-medium text-zinc-400">
              Your account is now activated and ready to use.
            </p>
          </div>
          <div className="space-y-3">
            <Link href="/">
              <a className="flex w-full items-center justify-center rounded-lg border border-blue-900 bg-blue-500 p-4 font-medium tracking-wide text-zinc-100 hover:bg-blue-400">
                Log in
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  if (passwordCodeVerified) {
    return (
      <div className="flex h-screen w-screen items-center justify-center dark:bg-black  ">
        <div className="w-full max-w-lg space-y-5 rounded-2xl border border-zinc-900 p-10">
          <h1 className="mb-12 text-3xl font-medium text-zinc-100">
            screenshotify
          </h1>
          {success ? (
            <div className="flex flex-col space-y-14">
              <div className=" space-y-4">
                <h1 className="text-3xl font-bold text-zinc-100">
                  Password reset
                </h1>
                <p className="text-sm font-medium text-zinc-400">
                  Your password has been successfully reset.
                </p>
              </div>
              <Link href="/">
                <a
                  type="submit"
                  className="flex w-full items-center justify-center rounded-lg border border-blue-900 bg-blue-500 p-4 font-medium tracking-wide text-zinc-100 hover:bg-blue-400"
                >
                  Sign in
                </a>
              </Link>
            </div>
          ) : (
            <PasswordPage
              submitPassword={submitPassword}
              loading={submitPasswordLoading}
              setLoading={setSubmitPasswordLoading}
              error={submitPasswordError}
            />
          )}
        </div>
      </div>
    );
  }
}

interface PasswordPageProps {
  submitPassword: Function;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  error: string;
}
const PasswordPage: NextComponentType<
  NextPageContext,
  {},
  PasswordPageProps
> = ({ submitPassword, loading, setLoading, error }) => {
  const [passwordError, setPasswordError] = useState("");
  const [passwordCheckError, setPasswordCheckError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const validatePassword = (password: string) => {
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(
      password
    );
  };

  const checkMatch = (p1: string, p2: string) => {
    return p1 === p2;
  };
  return (
    <>
      <form
        action="#"
        onSubmit={(e) => {
          e.preventDefault();
          if (passwordError || !checkMatch(password, passwordConfirm)) {
            return;
          } else {
            setLoading(true);
            submitPassword(password);
          }
        }}
        className="flex flex-col space-y-4"
      >
        <h1 className="text-3xl font-bold text-zinc-100">Reset password</h1>
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-zinc-100">
            Password
          </label>
          <div className="relative w-full">
            <input
              value={password}
              onChange={(e) => {
                setPasswordError("");
                setPassword(e.target.value);
              }}
              onBlur={() => {
                if (!validatePassword(password) && password !== "") {
                  setPasswordError("Please enter a valid password");
                }
              }}
              placeholder="Your password"
              name="password"
              spellCheck={false}
              type={showPassword ? "text" : "password"}
              className={
                "form-input w-full rounded-lg border border-zinc-800 bg-black py-4 pr-10 pl-4 font-medium text-zinc-400 focus:outline-none " +
                (passwordError ? "border-red-500" : "focus:border-blue-500")
              }
            ></input>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4"
            >
              {showPassword ? (
                <EyeIcon className="h-5 text-zinc-400" />
              ) : (
                <EyeOffIcon className="h-5 text-zinc-400" />
              )}
            </button>
          </div>
          <p className="text-sm font-medium text-red-500">{passwordError}</p>
        </div>
        <div className="flex flex-col space-y-1 pb-5">
          <label htmlFor="email" className="text-sm font-medium text-zinc-100">
            Confirm password
          </label>
          <div className="relative w-full">
            <input
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordCheckError("");
                setPasswordConfirm(e.target.value);
              }}
              onBlur={() => {
                if (
                  !checkMatch(password, passwordConfirm) &&
                  passwordConfirm !== ""
                ) {
                  setPasswordCheckError("Passwords do not match");
                }
              }}
              placeholder="Your password"
              name="password"
              spellCheck={false}
              type={showPassword ? "text" : "password"}
              className={
                "form-input w-full rounded-lg border border-zinc-800 bg-black py-4 pr-10 pl-4 font-medium text-zinc-400 focus:outline-none " +
                (passwordCheckError
                  ? "border-red-500"
                  : "focus:border-blue-500")
              }
            ></input>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4"
            >
              {showPassword ? (
                <EyeIcon className="h-5 text-zinc-400" />
              ) : (
                <EyeOffIcon className="h-5 text-zinc-400" />
              )}
            </button>
          </div>
          <p className="text-sm font-medium text-red-500">
            {passwordCheckError}
          </p>
          <p className="text-sm font-medium text-red-500">{error}</p>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-lg border border-blue-900 bg-blue-500 p-4 font-medium tracking-wide text-zinc-900 hover:bg-blue-400"
        >
          {loading ? <Spinner className="h-5 w-5" /> : "Continue"}
        </button>
      </form>
      <div className="flex flex-col items-center space-y-3">
        <p className="text-sm font-medium text-blue-600">Privacy policy</p>
      </div>
    </>
  );
};
