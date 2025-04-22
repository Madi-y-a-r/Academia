import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandList,
  CommandItem,
} from "@/components/ui/command";

interface SearchInputProps {
  className?: string;
  suggestions: Array<{ courseId: string; title: string }>;
}

export default function SearchInput({ className = "", suggestions }: SearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const t = useTranslations("Navbar");

  const filteredSuggestions = suggestions.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className={`relative flex-1 ${className}`}>
          <Input
            className="w-full border-none focus-visible:ring-0 py-5"
            placeholder={t("searchCourses")}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.length > 0) {
                setIsOpen(true);
              } else {
                setIsOpen(false);
              }
            }}
            onFocus={() => {
              if (query.length > 0) {
                setIsOpen(true);
              }
            }}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[400px] bg-customgreys-secondarybg p-0 shadow-lg rounded-lg border-none"
        align="start"
        sideOffset={5}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <Command className="text-white bg-customgreys-secondarybg border-none">
          <CommandList>
            {filteredSuggestions.length === 0 ? (
              <CommandItem>No results found.</CommandItem>
            ) : (
              filteredSuggestions.map((item, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    router.push(`/search?id=${item.courseId}`, {
                      scroll: false,
                    });
                    setIsOpen(false);
                  }}
                  className="py-3 flex justify-between"
                >
                  {item.title}
                  <ChevronRight />
                </CommandItem>
              ))
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}