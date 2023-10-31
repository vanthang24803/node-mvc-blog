import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Blog } from "type";
import { Link } from "react-router-dom";

export const SearchCommand = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Blog[]>([]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (query) {
      axios
        .get(
          `${import.meta.env.VITE_URL_API}/post?query=${encodeURIComponent(
            query
          )}`
        )
        .then((response) => {
          setResults(response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [query]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
      >
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          Search
        </p>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search all blogs and bloggers"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {results.length == 0 ? (
            <CommandEmpty>No Results found</CommandEmpty>
          ) : (
            results.map((result, index) => (
              <Link to={`/post/${result._id}`}>
                <CommandItem key={index}>
                  <span className="px-6 cursor-pointer">{result.title}</span>
                </CommandItem>
              </Link>
            ))
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
