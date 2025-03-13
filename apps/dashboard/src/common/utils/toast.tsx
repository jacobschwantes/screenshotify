import { toast } from "react-toastify";
import { CheckCircleIcon } from "@heroicons/react/outline";
interface ToastProps {
  options: {
    type: string;
    heading?: string;
    message?: string;
    icon: JSX.Element;
  };
}
export const dispatchToast = ({
  options: { type = "info", heading = "Heading", message = "Message" },
}: ToastProps) => {
  toast(
    <div className="flex items-center space-x-3">
      <CheckCircleIcon className="h-6 w-6 text-blue-500" />
      <span>
        <h1 className=" font-medium">{heading}</h1>
        <p className="text-sm font-extralight">{message}</p>
      </span>
    </div>,
    {
      theme: "dark",
      progressClassName: "toastProgressBlue",
    }
  );
};
