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
    <div className="bg-black h-screen flex justify-center items-center w-screen">
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
      <h1 className="text-zinc-100 text-3xl font-bold">Enter password</h1>
      <button
        type="button"
        onClick={() => setEmailValidated(false)}
        className="p-4 font-bold rounded-lg focus:outline-none  active:scale-[.98] hover:brightness-150 active:bg-zinc-900  border-zinc-800 border flex items-center space-x-3 text-white "
      >
        <UserIcon className="h-7 border-2 rounded-full p-0.5 text-zinc-400" />
        <p className="truncate">{email}</p>
      </button>
      <div className="flex flex-col space-y-1 pb-5">
        <label htmlFor="email" className="text-zinc-100 font-medium text-sm">
          Password
        </label>
        <div className="w-full relative">
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
              "form-input pr-10 pl-4 py-4 w-full font-medium rounded-lg focus:outline-none bg-black text-zinc-400 border-zinc-800 border " +
              (error ? "border-red-500" : "focus:border-blue-500")
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
        <p className="text-red-500 font-medium text-sm">{error}</p>
      </div>
      <button
        type="button"
        disabled={passwordResetLoading}
        onClick={handleResetPassword}
        className="font-medium text-blue-600 self-start"
      >
        Forgot password?
      </button>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-400 w-full border border-blue-900 p-4 rounded-lg font-medium tracking-wide text-zinc-900 flex items-center justify-center"
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
        <h1 className="text-zinc-100 text-3xl font-bold">Sign in</h1>
        <div className="flex flex-col space-y-1 pb-5">
          <label htmlFor="email" className="text-zinc-100 font-medium text-sm">
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
              "form-input p-4 font-medium rounded-lg focus:outline-none bg-black text-zinc-400 border-zinc-800 border " +
              (error ? "border-red-500" : "focus:border-blue-500")
            }
          ></input>
          <p className="text-red-500 font-medium text-sm">{error}</p>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-400 w-full border border-blue-900 p-4 rounded-lg font-medium tracking-wide text-zinc-900 flex items-center justify-center"
        >
          {loading ? <Spinner className="h-5 w-5" /> : "Continue"}
        </button>
        <button
          onClick={() => setLogin(false)}
          type="button"
          className=" hover:bg-zinc-900 hover:bg-opacity-30 w-full border border-zinc-800 p-4 rounded-lg font-medium tracking-wide text-zinc-100"
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
    <div className="sm:border border-zinc-900 rounded-2xl sm:p-10 p-5 max-w-lg w-full space-y-4">
   <div className="pb-10">
        <Image
          className="h-8 hidden dark:block w-auto"
          src={logo}
          alt="Company name"
        />

        <Image
          className="h-8 dark:hidden w-auto "
          src={logo_light}
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
        <h1 className="text-zinc-100 text-3xl font-bold">Sign up</h1>
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="text-zinc-100 font-medium text-sm">
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
              "form-input p-4 font-medium rounded-lg focus:outline-none bg-black text-zinc-400 border-zinc-800 border " +
              (emailError ? "border-red-500" : "focus:border-blue-500")
            }
          ></input>
          <p className="text-red-500 font-medium text-sm">{emailError}</p>
        </div>
        <div className="flex flex-col space-y-1 pb-5">
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
              id="password"
              spellCheck={false}
              type={showPassword ? "text" : "password"}
              className={
                "form-input pr-10 pl-4 py-4 w-full font-medium rounded-lg focus:outline-none bg-black text-zinc-400 border-zinc-800 border " +
                (error ? "border-red-500" : "focus:border-blue-500")
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
          <p className="text-red-500 font-medium text-sm">{error}</p>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-400 w-full border border-blue-900 p-4 rounded-lg font-medium tracking-wide text-zinc-900 flex items-center justify-center"
        >
          {loading ? <Spinner className="h-5 w-5" /> : "Continue"}
        </button>
        <button
          type="button"
          onClick={() => setLogin(true)}
          className=" hover:bg-zinc-900 hover:bg-opacity-30 w-full border border-zinc-800 p-4 rounded-lg font-medium tracking-wide text-zinc-100"
        >
          Already have an account?
        </button>
      </form>
      <div className="flex flex-col items-center space-y-3">
        <a
          href="https://screenshotify.io/privacy"
          className="font-medium text-sm text-blue-600"
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
    <div className="sm:border border-zinc-800 rounded-2xl sm:p-10 p-5 max-w-lg w-full space-y-4">
      <div className="pb-10">
        <Image
          className="h-8 hidden dark:block w-auto"
          src={logo}
          alt="Company name"
        />

        <Image
          className="h-8 dark:hidden w-auto "
          src={logo_light}
          alt="Company name"
        />
      </div>

      <SignUpPage setLogin={setLogin} />
    </div>
  );
};
