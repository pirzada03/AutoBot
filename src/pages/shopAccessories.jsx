import Sidebar from "../components/Sidebar";
import Accessories from "../components/shop-accessories/shopAccessories";
import { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Footer from "../components/market-place/footer";

const PriceRangeSlider = ({ min, max, value, onChange }) => {
  return (
    <div className="mt-4 w-96">
      <div className="flex items-center justify-between">
        <p className="font-medium">Price Range</p>
        <p>{`Rs. ${value[0]} - Rs. ${value[1]}`}</p>
      </div>
      <Slider
        range
        min={min}
        max={max}
        defaultValue={value}
        onChange={onChange}
      />
    </div>
  );
};

const ShopAccessories = () => {
  const [sortingOrder, setSortingOrder] = useState(""); // Initialize with an empty string for default order

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMake, setSelectedMake] = useState("All");
  const [selectedModel, setSelectedModel] = useState("All");

  const handleSortingChange = (order) => {
    setSortingOrder(order);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  const handleMakeChange = (e) => {
    setSelectedMake(e.target.value);
  };
  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const [priceRange, setPriceRange] = useState([0, 100000]); // Initial values, adjust as needed

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
  };

  const [accessories, setAccessories] = useState([]);

  //Getting the accessories data
  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const response = await fetch("http://localhost:3000/getaccessories/"); // Replace with your actual endpoint
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await response.json();
        if (
          data &&
          data.message === "Accessories found" &&
          data.data &&
          data.data.accessoriesdata &&
          data.data.accessoriesdata.length > 0
        ) {
          setAccessories(data.data.accessoriesdata); // Limiting to three items
        }
      } catch (error) {
        console.error("Error fetching accessories:", error);
      }
    };

    fetchAccessories();
  }, []);

  const sortAccessories = (order) => {
    const sortedAccessories = [...accessories]; // Create a copy of the accessories array

    if (order === "lowToHigh") {
      sortedAccessories.sort((a, b) => a.price - b.price); // Sort low to high based on price
    } else if (order === "highToLow") {
      sortedAccessories.sort((a, b) => b.price - a.price); // Sort high to low based on price
    }

    setAccessories(sortedAccessories); // Update the state with sorted accessories
  };

  useEffect(() => {
    // Whenever the sortingOrder changes, trigger sorting
    if (sortingOrder !== "") {
      sortAccessories(sortingOrder);
    }
  }, [sortingOrder]);

  console.log(accessories);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedMake("All");
    setSelectedModel("All");
    setPriceRange([0, 100000]); // Reset price range
    setSearchTerm(""); // Reset search term
  };

  var filteredAccessories = [];

  if (accessories) {
    const searchTerms = searchTerm.toLowerCase().split(" ");

    filteredAccessories = accessories.filter((val) => {
      const nameTenWords = val.name
        .split(" ")
        .slice(0, 20)
        .join(" ")
        .toLowerCase();

      return (
        (selectedCategory.toLowerCase() === "all" ||
          val.subcategory.toLowerCase() === selectedCategory.toLowerCase()) &&
        (selectedMake.toLowerCase() === "all" ||
          val.brand.toLowerCase() === selectedMake.toLowerCase()) &&
        (selectedModel.toLowerCase() === "all" ||
          val.compatibility.some(
            (item) => item.toLowerCase() === selectedModel.toLowerCase()
          )) &&
        val.price >= priceRange[0] &&
        val.price <= priceRange[1] &&
        searchTerms.every(
          (term) =>
            val.brand.toLowerCase().includes(term) ||
            val.compatibility.some((compatibilityItem) =>
              compatibilityItem.toLowerCase().includes(term)
            ) ||
            nameTenWords.includes(term) // Check if description's first ten words include search term
        )
      );
    });

    console.log(filteredAccessories);
  }

  return (
    <>
      <div className="flex">
        <div className="flex flex-col flex-grow ml-16">
          <Sidebar />
          {/* ...................image with dropdowns............. */}
          <div className="relative">
            <div className="relative w-full h-[550px] lg:h-[430px]">
              <img
                src="src/assets/images/marketplace/carbon-fiber-background.jpg"
                alt="Your Image"
                className="object-cover w-full h-full bg-[#ffffff19] "
              />
              <div className="absolute inset-0 ">
                <div className="flex items-center justify-center mt-20">
                  <div className="w-full p-5 bg-white rounded-lg shadow md:w-2/3">
                    <div className="relative">
                      <div className="absolute flex items-center h-full ml-2">
                        <svg
                          className="w-4 h-4 fill-current text-primary-gray-dark"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M15.8898 15.0493L11.8588 11.0182C11.7869 10.9463 11.6932 10.9088 11.5932 10.9088H11.2713C12.3431 9.74952 12.9994 8.20272 12.9994 6.49968C12.9994 2.90923 10.0901 0 6.49968 0C2.90923 0 0 2.90923 0 6.49968C0 10.0901 2.90923 12.9994 6.49968 12.9994C8.20272 12.9994 9.74952 12.3431 10.9088 11.2744V11.5932C10.9088 11.6932 10.9495 11.7869 11.0182 11.8588L15.0493 15.8898C15.1961 16.0367 15.4336 16.0367 15.5805 15.8898L15.8898 15.5805C16.0367 15.4336 16.0367 15.1961 15.8898 15.0493ZM6.49968 11.9994C3.45921 11.9994 0.999951 9.54016 0.999951 6.49968C0.999951 3.45921 3.45921 0.999951 6.49968 0.999951C9.54016 0.999951 11.9994 3.45921 11.9994 6.49968C11.9994 9.54016 9.54016 11.9994 6.49968 11.9994Z"></path>
                        </svg>
                      </div>

                      <input
                        type="text"
                        placeholder="Search by name, type, or brand..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full px-8 py-3 text-sm bg-gray-100 border-transparent rounded-md focus:border-gray-500 focus:bg-white focus:ring-0"
                      />
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <p className="font-medium">Filters</p>
                      <div>
                        <button
                          onClick={resetFilters}
                          className="px-4 py-2 text-sm font-medium text-white rounded-md bg-[#1a79ff] hover:bg-[#1352a9] ml-2"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 xl:grid-cols-3">
                        <select
                          className="w-full px-4 py-3 text-sm bg-gray-100 border-transparent rounded-md focus:border-gray-500 focus:bg-white focus:ring-0"
                          value={selectedCategory}
                          onChange={handleCategoryChange}
                        >
                          <option value="All">Select a Category</option>
                          {accessories.map((part) => {
                            // Convert all categories to lowercase for comparison
                            const categoryLowerCase =
                              part.subcategory.toLowerCase();

                            // Check if any lowercase version of the category already exists in the rendered options
                            const isDuplicate =
                              accessories
                                .map((p) => p.subcategory.toLowerCase())
                                .indexOf(categoryLowerCase) !==
                              accessories.indexOf(part);

                            // Render the option only if it's not a duplicate
                            if (!isDuplicate) {
                              return (
                                <option key={part.id} value={part.subcategory}>
                                  {part.subcategory}
                                </option>
                              );
                            }

                            return null; // Return null for duplicates to skip rendering
                          })}
                        </select>

                        <select
                          className="w-full px-4 py-3 text-sm bg-gray-100 border-transparent rounded-md focus:border-gray-500 focus:bg-white focus:ring-0"
                          value={selectedMake}
                          onChange={handleMakeChange}
                        >
                          <option value="All">Select Make</option>
                          {accessories.map((part) => {
                            // Convert all categories to lowercase for comparison
                            const categoryLowerCase = part.brand.toLowerCase();

                            // Check if any lowercase version of the category already exists in the rendered options
                            const isDuplicate =
                              accessories
                                .map((p) => p.brand.toLowerCase())
                                .indexOf(categoryLowerCase) !==
                              accessories.indexOf(part);

                            // Render the option only if it's not a duplicate
                            if (!isDuplicate) {
                              return (
                                <option key={part.id} value={part.brand}>
                                  {part.brand}
                                </option>
                              );
                            }

                            return null; // Return null for duplicates to skip rendering
                          })}
                        </select>

                        <select
                          className="w-full px-4 py-3 text-sm bg-gray-100 border-transparent rounded-md focus:border-gray-500 focus:bg-white focus:ring-0"
                          value={selectedModel}
                          onChange={handleModelChange}
                        >
                          <option value="All">Select Model</option>
                          {Array.from(
                            new Set(
                              accessories
                                .flatMap((part) => part.compatibility) // Flatten compatibility arrays
                                .map((compatibilityItem) =>
                                  compatibilityItem.toLowerCase()
                                ) // Convert to lowercase for consistent comparison
                            )
                          ).map((uniqueCompatibilityItem, index) => (
                            <option key={index} value={uniqueCompatibilityItem}>
                              {uniqueCompatibilityItem.toUpperCase()}
                            </option>
                          ))}
                        </select>

                        <PriceRangeSlider
                          min={0}
                          max={100000}
                          value={priceRange}
                          onChange={handlePriceRangeChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute z-10 ml-16 right-28">
        <div className="flex items-center mt-4">
          <p className="mr-1 font-medium">Sort By :</p>
          <div className="flex">
            <button
              onClick={() => handleSortingChange("lowToHigh")}
              className={`${
                sortingOrder === "lowToHigh" ? "bg-blue-500 text-white" : ""
              } px-4 py-2 mr-1 text-sm font-medium rounded-md hover:bg-gray-200`}
            >
              Low to High
            </button>
            <button
              onClick={() => handleSortingChange("highToLow")}
              className={`${
                sortingOrder === "highToLow" ? "bg-blue-500 text-white" : ""
              } px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-200`}
            >
              High to Low
            </button>
          </div>
        </div>
      </div>

      <div className="relative ml-16"></div>

      <div className="relative ml-16">
        <Accessories accessories={filteredAccessories} />
      </div>

      <div className="relative ml-16">
        <Footer />
      </div>
    </>
  );
};

export default ShopAccessories;
