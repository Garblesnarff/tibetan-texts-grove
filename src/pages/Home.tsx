import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/index/Header";
import { SearchInput } from "@/components/search/SearchInput";

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <div className="container mx-auto">
      <Header />
      <div className="mt-8">
        <SearchInput
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value);
            handleSearch(value);
          }}
          onClear={handleClear}
        />
      </div>
    </div>
  );
}