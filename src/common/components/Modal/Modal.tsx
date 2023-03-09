import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
interface ModalProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  content: { message: string };
  dark: boolean;
}
export default function Modal({ setOpen, open, content, dark }: ModalProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className={clsx("relative z-10", dark ? "dark" : "")}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-800 bg-opacity-30 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl border border-zinc-300 bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all dark:border-zinc-900 dark:bg-black sm:my-8 sm:w-full sm:max-w-5xl sm:p-6">
                <div className="space-y-4">
                  <h1 className="text-lg font-medium dark:text-white">
                    Error logs
                  </h1>
                  <div>
                    <code className="break-words text-sm dark:text-zinc-200">
                      {content.message}
                    </code>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-zinc-900 bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-900"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
