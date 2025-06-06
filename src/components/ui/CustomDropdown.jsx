import { useDispatch, useSelector } from "react-redux";
import { handleToggleDropdown } from "../../features/shop/slices/filterSlice";
import { useEffect, useMemo, useRef, useState } from "react";

function CustomDropdown({
  options,
  selectedValue,
  onValueChange,
  placeholder,
  id,
  allOptionValue,
  isInteracted,
}) {
  const dispatch = useDispatch();
  const openDropdown = useSelector((state) => state.filter.openDropdown);

  const isOpen = openDropdown === id;

  const dropDownRef = useRef(null);
  const listItemRef = useRef(null);
  const [itemHeight, setItemHeight] = useState(0);
  const maxDropdownHeight = 400;

  useEffect(() => {
    if (isOpen && listItemRef.current && itemHeight === 0) {
      setItemHeight(listItemRef.current.offsetHeight);
    }
  }, [isOpen, itemHeight]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && dropDownRef.current && !dropDownRef.current.contains(e.target)) {
        dispatch(handleToggleDropdown(false));
      }
    };
    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen, dispatch]);

  const selectedOption = options.find((option) => option.value === selectedValue);

  let displayText
  if (!isInteracted && selectedValue === allOptionValue) {
    displayText = placeholder;
  } else if (selectedOption) {
    displayText = selectedOption.name;
  }

  const dynamicHeight = useMemo(() => {
    if (itemHeight === 0 || !Array.isArray(options)) {
      return "auto";
    }
    const calculatedHeight = options.length * itemHeight + 7;
    return Math.min(calculatedHeight, maxDropdownHeight);
  }, [options, itemHeight, maxDropdownHeight]);

  const handleSelect = (value) => {
    onValueChange(value);
    dispatch(handleToggleDropdown(false));
  };

  return (
    <div className="relative w-full cursor-pointer" ref={dropDownRef}>
      <div
        onClick={() => dispatch(handleToggleDropdown(id))}
        className={`flex justify-between border w-[144px] border-[#646179] rounded-full px-2 text-sm bg-[#FBD7A6] shadow-[inset_0_0_10px_2px_#eca966] hover:opacity-80 py-0.5`}
      >
        <span>{displayText}</span>
        <svg
          className={`w-4 h-4 transform`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 15"
        >
          <path
            d="M19 9l-7 7-7-7"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {isOpen && (
        <ul
          className="absolute z-10 mt-1 w-full bg-[#FFD8AF] border-3 border-gray-600 rounded-lg shadow-lg
                      cursor-pointer overflow-auto custom-scrollbar"
          style={{
            height: dynamicHeight === "auto" ? dynamicHeight : `${dynamicHeight}px`,
          }}
        >
          {options.map((option) => (
            <li
              key={option.name}
              ref={listItemRef}
              onClick={() => {
                if (option && option.value !== undefined) {
                  handleSelect(option.value);
                } else {
                  console.error("Clicked item had undefined option or value:", option);
                }
              }}
              className={`px-3.5 py-1 hover:bg-[#c49a6e] cursor-pointer text-xs bg-[#FFD8AF]  text-[#4e2c08] select-none`}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomDropdown;
