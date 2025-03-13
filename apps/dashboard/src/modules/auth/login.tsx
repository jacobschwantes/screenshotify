import { NextComponentType, NextPage, NextPageContext } from "next";
import { Spinner } from "@components/index";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { EyeIcon, EyeOffIcon, UserIcon } from "@heroicons/react/solid";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./firebase/client";
import { handleAuthError } from "./utils/errors";
import { toast } from "react-toastify";
import { CheckCircleIcon } from "@heroicons/react/outline";
import Image from "next/future/image";
import logo from "../../../public/logo.png";
import logo_light from "../../../public/logo_light.png";
const auth = getAuth(firebaseApp);
type Tab = {
  heading: string;
};

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const validatePassword = (password: string) => {
  return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(
    password
  );
};
const functions = getFunctions();
const resetPassword = httpsCallable(functions, "resetPassword");
const Login: NextPage = () => {
  const [login, setLogin] = useState(true);
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      {login ? (
        <LoginCard setLogin={setLogin} />
      ) : (
        <SignUpCard setLogin={setLogin} />
      )}
    </div>
  );
};
interface PasswordPageProps {
  setPassword: Dispatch<SetStateAction<string>>;
  setEmailValidated: Dispatch<SetStateAction<boolean>>;
  email: string;
  password: string;
}
const PasswordPage: NextComponentType<
  NextPageContext,
  {},
  PasswordPageProps
> = ({ password, email, setPassword, setEmailValidated }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submitLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      console.log(JSON.stringify(e));
      setError(handleAuthError(e));
    }
    setLoading(false);
  };
  const handleResetPassword = () => {
    setPasswordResetLoading(true);
    resetPassword(email)
      .then((result) => {
        console.log(result);

        toast(
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-6 w-6 text-blue-500" />
            <span>
              <p className="text-sm font-extralight">
                Password reset email sent to {email}.
              </p>
            </span>
          </div>,
          {
            theme: "dark",
            progressClassName: "toastProgressBlue",
          }
        );
      })
      .catch((e: any) =>
        toast(
          <div className="flex items-center space-x-3">
            <span>
              <h1 className=" font-medium">{e.error}</h1>
              <p className="text-sm font-extralight">{e.message}</p>
            </span>
          </div>,
          {
            type: "error",
          }
        )
      );
    setPasswordResetLoading(false);
  };
  return (
    <form
      action="#"
      onSubmit={(e) => {
        e.preventDefault();
        if (!validatePassword(password)) {
          setError("Please enter a valid password");
        } else {
          submitLogin(email, password);
        }
      }}
      className="flex flex-col space-y-6"
    >
      <h1 className="text-3xl font-bold text-zinc-100">Enter password</h1>
      <button
        type="button"
        onClick={() => setEmailValidated(false)}
        className="flex items-center space-x-3 rounded-lg  border border-zinc-800 p-4  font-bold text-white hover:brightness-150 focus:outline-none active:scale-[.98] active:bg-zinc-900 "
      >
        <UserIcon className="h-7 rounded-full border-2 p-0.5 text-zinc-400" />
        <p className="truncate">{email}</p>
      </button>
      <div className="flex flex-col space-y-1 pb-5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-100">
          Password
        </label>
        <div className="relative w-full">
          <input
            value={password}
            onChange={(e) => {
              setError("");
              setPassword(e.target.value);
            }}
            placeholder="Your password"
            name="password"
            id="password"
            spellCheck={false}
            type={showPassword ? "text" : "password"}
            className={
              "form-input w-full rounded-lg border border-zinc-800 bg-black py-4 pr-10 pl-4 font-medium text-zinc-400 focus:outline-none " +
              (error ? "border-red-500" : "focus:border-blue-500")
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
        <p className="text-sm font-medium text-red-500">{error}</p>
      </div>
      <button
        type="button"
        disabled={passwordResetLoading}
        onClick={handleResetPassword}
        className="self-start font-medium text-blue-600"
      >
        Forgot password?
      </button>
      <button
        type="submit"
        className="flex w-full items-center justify-center rounded-lg border border-blue-900 bg-blue-500 p-4 font-medium tracking-wide text-zinc-900 hover:bg-blue-400"
      >
        {loading ? <Spinner className="h-5 w-5" /> : "Continue"}
      </button>
    </form>
  );
};
interface EmailPageProps {
  setEmail: Dispatch<SetStateAction<string>>;
  setEmailValidated: Dispatch<SetStateAction<boolean>>;
  setLogin: Dispatch<SetStateAction<boolean>>;
  email: string;
}
const EmailPage: NextComponentType<NextPageContext, {}, EmailPageProps> = ({
  email,
  setEmailValidated,
  setEmail,
  setLogin,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  return (
    <>
      <form
        action="#"
        onSubmit={(e) => {
          e.preventDefault();
          if (!validateEmail(email)) {
            setError("Please enter a valid email address");
          } else {
            setEmailValidated(true);
          }
        }}
        className="flex flex-col space-y-4"
      >
        <h1 className="text-3xl font-bold text-zinc-100">Sign in</h1>
        <div className="flex flex-col space-y-1 pb-5">
          <label htmlFor="email" className="text-sm font-medium text-zinc-100">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => {
              setError("");
              setEmail(e.target.value);
            }}
            placeholder="Your email address"
            type="email"
            name="email"
            id="email"
            className={
              "form-input rounded-lg border border-zinc-800 bg-black p-4 font-medium text-zinc-400 focus:outline-none " +
              (error ? "border-red-500" : "focus:border-blue-500")
            }
          ></input>
          <p className="text-sm font-medium text-red-500">{error}</p>
        </div>
        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-lg border border-blue-900 bg-blue-500 p-4 font-medium tracking-wide text-zinc-900 hover:bg-blue-400"
        >
          {loading ? <Spinner className="h-5 w-5" /> : "Continue"}
        </button>
        <button
          onClick={() => setLogin(false)}
          type="button"
          className=" w-full rounded-lg border border-zinc-800 p-4 font-medium tracking-wide text-zinc-100 hover:bg-zinc-900 hover:bg-opacity-30"
        >
          Create account
        </button>
      </form>
      {/* <div className="flex flex-col items-center space-y-3">
        <p className="font-medium text-sm text-blue-600">
          Sign into a business account
        </p>
        <p className="font-medium text-sm text-blue-600">Privacy policy</p>
      </div> */}
    </>
  );
};
interface LoginCardProps {
  setLogin: Dispatch<SetStateAction<boolean>>;
}
const LoginCard: NextComponentType<NextPageContext, {}, LoginCardProps> = ({
  setLogin,
}) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailValidated, setEmailValidated] = useState(false);

  return (
    <div className="w-full max-w-lg space-y-4 rounded-2xl border-zinc-900 p-5 sm:border sm:p-10">
      <div className="pb-10">
        <Image
          className="h-8 w-auto "
          src={logo}
          alt="Company name"
        />

      
      </div>
      {emailValidated ? (
        <PasswordPage
          email={email}
          password={password}
          setPassword={setPassword}
          setEmailValidated={setEmailValidated}
        />
      ) : (
        <EmailPage
          setLogin={setLogin}
          setEmail={setEmail}
          setEmailValidated={setEmailValidated}
          email={email}
        />
      )}
    </div>
  );
};

interface SignUpPageProps {
  setLogin: Dispatch<SetStateAction<boolean>>;
}
const SignUpPage: NextComponentType<NextPageContext, {}, SignUpPageProps> = ({
  setLogin,
}) => {
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitCreateUser = async (email: string, password: string) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      setError(handleAuthError(e));
    }
    setLoading(false);
  };

  return (
    <>
      <form
        action="#"
        onSubmit={(e) => {
          e.preventDefault();
          if (passwordError || emailError) {
            return;
          } else {
            submitCreateUser(email, password);
          }
        }}
        className="flex flex-col space-y-4"
      >
        <h1 className="text-3xl font-bold text-zinc-100">Sign up</h1>
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-zinc-100">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => {
              setEmailError("");
              setEmail(e.target.value);
            }}
            onBlur={() => {
              if (!validateEmail(email) && email !== "") {
                setEmailError("Please enter a valid email address");
              }
            }}
            type="email"
            placeholder="Your email address"
            name="email"
            id="email"
            className={
              "form-input rounded-lg border border-zinc-800 bg-black p-4 font-medium text-zinc-400 focus:outline-none " +
              (emailError ? "border-red-500" : "focus:border-blue-500")
            }
          ></input>
          <p className="text-sm font-medium text-red-500">{emailError}</p>
        </div>
        <div className="flex flex-col space-y-1 pb-5">
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
              id="password"
              spellCheck={false}
              type={showPassword ? "text" : "password"}
              className={
                "form-input w-full rounded-lg border border-zinc-800 bg-black py-4 pr-10 pl-4 font-medium text-zinc-400 focus:outline-none " +
                (error ? "border-red-500" : "focus:border-blue-500")
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
          <p className="text-sm font-medium text-red-500">{error}</p>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-lg border border-blue-900 bg-blue-500 p-4 font-medium tracking-wide text-zinc-900 hover:bg-blue-400"
        >
          {loading ? <Spinner className="h-5 w-5" /> : "Continue"}
        </button>
        <button
          type="button"
          onClick={() => setLogin(true)}
          className=" w-full rounded-lg border border-zinc-800 p-4 font-medium tracking-wide text-zinc-100 hover:bg-zinc-900 hover:bg-opacity-30"
        >
          Already have an account?
        </button>
      </form>
      <div className="flex flex-col items-center space-y-3">
        <a
          href="https://screenshotify.io/privacy"
          className="text-sm font-medium text-blue-600"
        >
          Privacy policy
        </a>
      </div>
    </>
  );
};

export default Login;
interface SignUpCardProps {
  setLogin: Dispatch<SetStateAction<boolean>>;
}

const SignUpCard: NextComponentType<NextPageContext, {}, SignUpCardProps> = ({
  setLogin,
}) => {
  return (
    <div className="w-full max-w-lg space-y-4 rounded-2xl border-zinc-800 p-5 sm:border sm:p-10">
      <div className="pb-10">
        <Image
          className="hidden h-8 w-auto dark:block"
          src={logo}
          alt="Company name"
        />

        <Image
          className="h-8 w-auto dark:hidden "
          src={logo_light}
          alt="Company name"
        />
      </div>

      <SignUpPage setLogin={setLogin} />
    </div>
  );
};
