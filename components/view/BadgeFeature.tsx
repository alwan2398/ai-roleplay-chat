"use client";

import { useState, useRef, useEffect, ElementType } from "react";
import {
  Flame,
  User,
  Venus,
  ChevronDown,
  Mars,
  Sparkles,
  Layers,
  Check,
} from "lucide-react";

interface FilterOption {
  label: string;
  icon: ElementType;
}

interface FilterDropdownProps {
  id: string;
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  isOpen: boolean;
  onToggle: (id: string) => void;
}

/**
 * Reusable Dropdown Badge Component
 */
function FilterDropdown({
  id,
  options,
  selectedValue,
  onSelect,
  isOpen,
  onToggle,
}: FilterDropdownProps) {
  const currentOption = options.find((opt) => opt.label === selectedValue) || options[0];
  const CurrentIcon = currentOption.icon;

  return (
    <div className="relative">
      <button
        onClick={() => onToggle(id)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border ${
          isOpen
            ? "bg-zinc-800 border-zinc-600 text-white shadow-md"
            : "bg-[#18181b]/90 hover:bg-zinc-800/80 border-zinc-800/90 text-zinc-200 hover:border-zinc-700"
        }`}
      >
        <CurrentIcon className="w-4 h-4 text-zinc-300" />
        <span>{selectedValue}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-white" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-44 py-1.5 bg-[#18181b] border border-zinc-800 rounded-xl shadow-xl z-50 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedValue === opt.label;
            return (
              <button
                key={opt.label}
                onClick={() => onSelect(opt.label)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors hover:bg-zinc-800/80 cursor-pointer ${
                  isSelected
                    ? "text-purple-400 bg-purple-500/10 font-semibold"
                    : "text-zinc-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Filter Options Configurations
const GENDER_OPTIONS: FilterOption[] = [
  { label: "Female", icon: Venus },
  { label: "Male", icon: Mars },
  { label: "All Genders", icon: User },
];

const STYLE_OPTIONS: FilterOption[] = [
  { label: "Realistic", icon: User },
  { label: "Anime", icon: Sparkles },
  { label: "Fantasy", icon: Layers },
];

const SORT_OPTIONS: FilterOption[] = [
  { label: "Popular", icon: Flame },
  { label: "Trending", icon: Sparkles },
  { label: "Newest", icon: Layers },
];

export default function BadgeFeature() {
  const [genderFilter, setGenderFilter] = useState("Female");
  const [styleFilter, setStyleFilter] = useState("Realistic");
  const [sortFilter, setSortFilter] = useState("Popular");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (id: string) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  return (
    <div ref={containerRef} className="w-full my-6 select-none">
      {/* Header Section */}
      <div className="flex flex-col gap-1 mb-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Featured <span className="text-[#a78bfa]">Companions</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-base font-normal">
          Meet some of our most popular companions
        </p>
      </div>

      {/* Badges & Actions Row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Filter Badges Container */}
        <div className="flex items-center gap-2.5 flex-wrap relative">
          <FilterDropdown
            id="gender"
            options={GENDER_OPTIONS}
            selectedValue={genderFilter}
            onSelect={(val) => {
              setGenderFilter(val);
              setActiveDropdown(null);
            }}
            isOpen={activeDropdown === "gender"}
            onToggle={handleToggle}
          />

          <FilterDropdown
            id="style"
            options={STYLE_OPTIONS}
            selectedValue={styleFilter}
            onSelect={(val) => {
              setStyleFilter(val);
              setActiveDropdown(null);
            }}
            isOpen={activeDropdown === "style"}
            onToggle={handleToggle}
          />

          <FilterDropdown
            id="sort"
            options={SORT_OPTIONS}
            selectedValue={sortFilter}
            onSelect={(val) => {
              setSortFilter(val);
              setActiveDropdown(null);
            }}
            isOpen={activeDropdown === "sort"}
            onToggle={handleToggle}
          />
        </div>

        {/* View All Button */}
        <button className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#27272a]/90 hover:bg-[#3f3f46] border border-zinc-700/60 text-white text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm hover:border-zinc-500">
          View all
        </button>
      </div>
    </div>
  );
}
