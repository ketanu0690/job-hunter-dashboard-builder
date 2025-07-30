import { X } from "lucide-react";
import SnakeGame from "./SnakeGame";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export const GameDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Play Snake Game
        </button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-black/50 fixed inset-0" />
        <DialogContent className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-semibold">
              Snake Game
            </DialogTitle>
            <DialogClose asChild>
              <button className="text-gray-400 hover:text-gray-700">
                <X />
              </button>
            </DialogClose>
          </div>
          <SnakeGame />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
