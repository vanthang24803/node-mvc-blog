import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/hooks/use-modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import { useCallback } from "react";
import { useUser } from "../provider/user-provider";

export const LoginModal = () => {
  const { isOpen, type, onClose, onOpen } = useModal();

  const isModalLoginOpen = isOpen && type === "login";
  const { setUser } = useUser();

    const formSchema = z.object({
      email: z.string().min(1, {
        message: "Email is required.",
      }),
      password: z.string().min(1, {
        message: "Password is required.",
      }),
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onOpenRegister = useCallback(() => {
    if (isModalLoginOpen) {
      onClose();
      onOpen("register");
    }
  }, [isModalLoginOpen, onClose, onOpen]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      toast.loading("Waiting 🚀");
      const response = await axios.post(
        `${import.meta.env.VITE_URL_API}/login`,
        values,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setUser(response.data);
        toast.dismiss();
        onClose();
        toast.success("Success");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong!");
    } finally {
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    }
  };

  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog open={isModalLoginOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-3xl text-center font-bold">
            Login
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            You need login to up load first blog !
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pb-6"
          >
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70 ">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter Email..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p
                className="italic text-slate-400 hover:text-slate-600 cursor-pointer text-sm text-end"
                onClick={onOpenRegister}
              >
                Create an account?
              </p>

              <Button
                className="w-full dark:bg-black dark:text-white"
                disabled={isLoading}
              >
                Login
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
