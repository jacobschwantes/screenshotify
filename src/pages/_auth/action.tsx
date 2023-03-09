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
        <div className="border border-zinc-900 rounded-2xl p-10 max-w-lg w-full space-y-14">
          <div className="flex justify-between items-center">
            <h1 className="text-zinc-100 text-3xl font-medium">
              screenshotify
            </h1>
            <Tooltip label="logout">
              <Link href="/">
                <XIcon className="h-5 w-5 text-white" />
              </Link>
            </Tooltip>
          </div>
          <div className=" space-y-4">
            <h1 className="text-zinc-100 text-3xl font-bold">Uh oh..</h1>
            <p className="text-zinc-400 font-medium text-sm">{error}</p>
          </div>
          <div className="space-y-3">
            <Link href="/">
              <a className="bg-blue-500 hover:bg-blue-400 w-full border border-blue-900 p-4 rounded-lg font-medium tracking-wide text-zinc-100 flex items-center justify-center">
                Try again
              </a>
            </Link>
            <Link href="mailto:support@screenshotify.io">
              <a className=" hover:bg-zinc-900 hover:bg-opacity-30 w-full border border-zinc-800 p-4 rounded-lg font-medium tracking-wide text-zinc-100 flex items-center justify-center">
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
        <div className="border border-zinc-900 rounded-2xl p-10 max-w-lg w-full space-y-14">
          <h1 className="text-zinc-100 text-3xl font-medium">screenshotify</h1>

          <div className=" space-y-4">
            <h1 className="text-zinc-100 text-3xl font-bold">Email verified</h1>
            <p className="text-zinc-400 font-medium text-sm">
              Your account is now activated and ready to use.
            </p>
          </div>
          <div className="space-y-3">
            <Link href="/">
              <a className="bg-blue-500 hover:bg-blue-400 w-full border border-blue-900 p-4 rounded-lg font-medium tracking-wide text-zinc-100 flex items-center justify-center">
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
        <div className="border border-zinc-900 rounded-2xl p-10 max-w-lg w-full space-y-5">
          <h1 className="text-zinc-100 text-3xl font-medium mb-12">
            screenshotify
          </h1>
          {success ? (
            <div className="flex flex-col space-y-14">
              <div className=" space-y-4">
                <h1 className="text-zinc-100 text-3xl font-bold">
                  Password reset
                </h1>
                <p className="text-zinc-400 font-medium text-sm">
                  Your password has been successfully reset.
                </p>
              </div>
              <Link href="/">
                <a
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-400 w-full border border-blue-900 p-4 rounded-lg font-medium tracking-wide text-zinc-100 flex items-center justify-center"
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
        <h1 className="text-zinc-100 text-3xl font-bold">Reset password</h1>
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="text-zinc-100 font-medium text-sm">
            Password
          </label>
          <div className="w-full relative">
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
                "form-input pr-10 pl-4 py-4 w-full font-medium rounded-lg focus:outline-none bg-black text-zinc-400 border-zinc-800 border " +
                (passwordError ? "border-red-500" : "focus:border-blue-500")
              }
            ></input>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              {showPassword ? (
                <EyeIcon className="h-5 text-zinc-400" />
              ) : (
                <EyeOffIcon className="h-5 text-zinc-400" />
              )}
            </button>
          </div>
          <p className="text-red-500 font-medium text-sm">{passwordError}</p>
        </div>
        <div className="flex flex-col space-y-1 pb-5">
          <label htmlFor="email" className="text-zinc-100 font-medium text-sm">
            Confirm password
          </label>
          <div className="w-full relative">
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
                "form-input pr-10 pl-4 py-4 w-full font-medium rounded-lg focus:outline-none bg-black text-zinc-400 border-zinc-800 border " +
                (passwordCheckError
                  ? "border-red-500"
                  : "focus:border-blue-500")
              }
            ></input>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              {showPassword ? (
                <EyeIcon className="h-5 text-zinc-400" />
              ) : (
                <EyeOffIcon className="h-5 text-zinc-400" />
              )}
            </button>
          </div>
          <p className="text-red-500 font-medium text-sm">
            {passwordCheckError}
          </p>
          <p className="text-red-500 font-medium text-sm">{error}</p>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-400 w-full border border-blue-900 p-4 rounded-lg font-medium tracking-wide text-zinc-900 flex items-center justify-center"
        >
          {loading ? <Spinner className="h-5 w-5" /> : "Continue"}
        </button>
      </form>
      <div className="flex flex-col items-center space-y-3">
        <p className="font-medium text-sm text-blue-600">Privacy policy</p>
      </div>
    </>
  );
};
