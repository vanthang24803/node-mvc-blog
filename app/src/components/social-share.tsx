import { Facebook, Linkedin, Mail, Twitter } from "lucide-react";
import toast from "react-hot-toast";

export const SocialShare = () => {
  const onCopy = async () => {
    try {
      toast.loading("Waiting 🚀");
      await navigator.clipboard.writeText(window.location.href);
      toast.dismiss();
      toast.success("URL copied to clipboard");
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    }
  };
  return (
    <div className="flex flex-col space-y-2">
      <span className="uppercase text-xs text-neutral-500">
        Share this post
      </span>
      <div
        className="flex items-center space-x-4 text-black hover:cursor-pointer"
        onClick={onCopy}
      >
        <Twitter size={18} className="hover:text-blue-500 dark:text-white" />
        <Linkedin size={18} className="hover:text-blue-500 dark:text-white" />
        <Facebook size={18} className="hover:text-blue-500 dark:text-white" />
        <Mail size={18} className="hover:text-blue-500 dark:text-white" />
      </div>
    </div>
  );
};
