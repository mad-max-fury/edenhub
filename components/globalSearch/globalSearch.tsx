"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, ArrowRight, SearchIcon, Layers, Box } from "lucide-react";
import { Modal } from "../modal/modal";
import { Button } from "../buttons";
import { SearchInput } from "../search";
import { MiniEmptyState } from "../miniEmptyState/miniEmptyState";
import { EmptySearchIcon } from "@/assets/svgs/emptyStates";
import Link from "next/link";
import { Typography } from "../typography";
import { Badge } from "../badge/Badge";

interface BaseSearchItem {
  id: string;
  name: string;
  type: "product" | "category";
}

interface ProductSearchItem extends BaseSearchItem {
  type: "product";
  price: number;
  image: string;
  quantity: number;
}

interface CategorySearchItem extends BaseSearchItem {
  type: "category";
  productCount: number;
  image: string;
}

type SearchItem = ProductSearchItem | CategorySearchItem;

export const GlobalSearchDropdown: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([
    "Mens watches",
    "Womens watches",
  ]);
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const performSearch = (term: string) => {
    const mockData: SearchItem[] = [
      // Products
      {
        id: "1",
        name: "Rolex Submariner",
        type: "product",
        price: 8500.0,
        quantity: 3,
        image: "https://www.rolex.com/content/dam/rolex/submariner.jpg",
      },
      {
        id: "2",
        name: "Ray-Ban Aviator Classic",
        type: "product",
        price: 153.0,
        quantity: 25,
        image: "https://www.ray-ban.com/images/aviator-classic.jpg",
      },
      {
        id: "3",
        name: "Omega Speedmaster",
        type: "product",
        price: 5200.0,
        quantity: 7,
        image: "https://www.omegawatches.com/media/speedmaster.jpg",
      },
      {
        id: "4",
        name: "Oakley Holbrook",
        type: "product",
        price: 130.0,
        quantity: 42,
        image: "https://www.oakley.com/media/holbrook.jpg",
      },
      {
        id: "5",
        name: "Tag Heuer Carrera",
        type: "product",
        price: 2800.0,
        quantity: 5,
        image: "https://www.tagheuer.com/media/carrera.jpg",
      },
      // Categories
      {
        id: "c1",
        name: "Luxury Watches",
        type: "category",
        productCount: 56,
        image: "https://www.watches.com/media/luxury-watches.jpg",
      },
      {
        id: "c2",
        name: "Sunglasses",
        type: "category",
        productCount: 128,
        image: "https://www.sunglasses.com/media/sunglasses-collection.jpg",
      },
      {
        id: "c3",
        name: "Sports Watches",
        type: "category",
        productCount: 84,
        image: "https://www.sportswatches.com/media/sports-collection.jpg",
      },
      {
        id: "c4",
        name: "Men's Collection",
        type: "category",
        productCount: 230,
        image: "https://www.menscollection.com/media/mens-watches.jpg",
      },
      {
        id: "c5",
        name: "Women's Collection",
        type: "category",
        productCount: 185,
        image: "https://www.womenscollection.com/media/womens-watches.jpg",
      },
    ];

    if (term === "") return setSearchResults([]);

    const filteredResults = mockData.filter((item) =>
      item.name.toLowerCase().includes(term.toLowerCase())
    );

    return setSearchResults(filteredResults);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    performSearch(value);
  };

  const addToSearchHistory = (term: string) => {
    if (term && !searchHistory.includes(term)) {
      const updatedHistory = [term, ...searchHistory].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      addToSearchHistory(searchTerm);
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  const removeSearchHistoryItem = (item: string) => {
    const updatedHistory = searchHistory.filter((h) => h !== item);
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  const categorizedResults = {
    categories: searchResults.filter(
      (item) => item.type === "category"
    ) as CategorySearchItem[],
    products: searchResults.filter(
      (item) => item.type === "product"
    ) as ProductSearchItem[],
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Button
        shape={"pill"}
        variant={"gold"}
        size={"plain"}
        className={"aspect-square h-[50px]"}
        onClick={() => setIsDropdownOpen(true)}
      >
        <SearchIcon className="text-BR500" />
      </Button>
      <Modal
        mobileLayoutType={"full"}
        isOpen={isDropdownOpen}
        closeModal={() => setIsDropdownOpen(false)}
      >
        <div ref={searchRef} className="relative w-full">
          <div className="top-0 sticky w-full bg-white z-[1]">
            <div className="mb-3 w-full pt-3 max-w-2xl px-4 md:px-0 mx-auto">
              <SearchInput
                placeholder="Search by product name or category"
                value={searchTerm}
                onChange={handleSearchChange}
                name={"productSearch"}
                id={""}
                onSubmit={handleSearchSubmit}
                ariaLabel="Search products"
              />
            </div>
            <hr className="bg-[#808080]" />
          </div>
          <div
            className="font-clashDisplay max-w-2xl mx-auto px-4 md:px-0 min-h-[500px] md:max-h-[600px] overflow-y-auto w-full mt-1 bg-white rounded-md"
            role="menu"
            aria-orientation="vertical"
          >
            {searchHistory.length > 0 && (
              <div className="mx-auto mt-4 ">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Search History
                  </h3>
                  <button
                    onClick={clearSearchHistory}
                    className="text-xs text-Br200 font-medium hover:underline"
                  >
                    Clear Searches
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item) => (
                    <div
                      key={item}
                      className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs"
                    >
                      {item}
                      <button
                        onClick={() => removeSearchHistoryItem(item)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(categorizedResults.categories.length > 0 ||
              categorizedResults.products.length > 0) && (
              <div className="mt-6 w-full">
                {categorizedResults.categories.length > 0 && (
                  <div className="max-w-2xl mx-auto mb-6">
                    <div className="flex items-center text-sm font-medium text-gray-600 mb-2">
                      <Layers size={16} className="mr-2" />
                      Categories
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categorizedResults.categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/category/${category.id}`}
                          className="flex items-center p-3 bg-LB50 hover:bg-LB75 rounded-lg transition-colors"
                        >
                          <div className="bg-gray-200 rounded-lg h-14 w-14 flex items-center justify-center mr-3 overflow-hidden">
                            <img
                              src={category.image}
                              alt={category.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1">
                            <Typography
                              variant={"h-s"}
                              fontWeight="medium"
                              color={"BR300"}
                            >
                              {category.name}
                            </Typography>
                            <Typography variant="p-s" color="N80">
                              {category.productCount} products
                            </Typography>
                          </div>
                          <ArrowRight className="text-BR400" size={18} />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {categorizedResults.products.length > 0 && (
                  <div className="max-w-2xl mx-auto">
                    <div className="flex items-center text-sm font-medium text-gray-600 mb-2">
                      <Box size={16} className="mr-2" />
                      Products
                    </div>
                    {categorizedResults.products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="flex items-center p-4 hover:bg-LB50 transition-colors rounded-lg mb-2"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover mr-4 rounded"
                        />
                        <div className="flex-1 flex flex-col gap-2 sm:flex-row items-start sm:items-center justify-between ">
                          <div>
                            <Typography
                              variant={"h-s"}
                              fontWeight="medium"
                              color={"BR300"}
                            >
                              {product.name}
                            </Typography>

                            <Typography
                              variant="p-s"
                              color="N80"
                              className=" mr-2"
                            >
                              ${product.price.toFixed(2)}
                            </Typography>
                          </div>

                          <Badge
                            variant={"green"}
                            text={`${product.quantity} in stock`}
                          />
                        </div>
                        <ArrowRight className="text-BR400 ml-4" size={20} />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* No Results */}
            {searchTerm.length > 1 && searchResults.length === 0 ? (
              <div className="w-full h-[400px] flex items-center justify-center">
                <MiniEmptyState
                  icon={<EmptySearchIcon className="h-[150px]" />}
                  title="No results found"
                  text={`Try adjusting your search to find what you are looking for`}
                />
              </div>
            ) : (
              searchTerm.length < 1 && (
                <div className="w-full h-full flex items-center justify-center">
                  <MiniEmptyState
                    icon={<EmptySearchIcon className="h-[150px]" />}
                    title="Initial Search Prompt"
                    text={"Start typing to search for products or categories."}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
