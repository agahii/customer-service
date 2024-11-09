import React, { useState, useEffect } from "react";

const Navbar = ({ onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // State to toggle dropdown visibility
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Track if mobile screen

  // Listen for window resizing and update `isMobile` state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e); // Trigger search on Enter key
    }
  };

  // Handle clicking outside to close the dropdown
  const handleOutsideClick = (e) => {
    if (!e.target.closest(".dropdown-menu") && !e.target.closest(".hamburger")) {
      setIsDropdownOpen(false);
    }
  };

  // Open/close the dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    // Add event listener to close dropdown if clicked outside
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <nav style={styles.navbar}>
      <div style={styles.searchContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress} // Listen for the Enter key press
          style={styles.searchInput}
          placeholder="Search"
        />
      </div>

      {/* Hamburger button (always visible) */}
      <div className="hamburger" style={styles.hamburger} onClick={toggleDropdown}>
        <div className="bar" style={styles.bar}></div>
        <div className="bar" style={styles.bar}></div>
        <div className="bar" style={styles.bar}></div>
      </div>

      {isDropdownOpen && (
        <div className="dropdown-menu" style={styles.dropdownMenu}>
          <button onClick={onLogout} style={styles.logoutButton}>Logout</button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#2f2f2f", // Dark background for the navbar
    color: "#fff",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between", // Align items (search and hamburger) at opposite ends
    alignItems: "center",
    zIndex: 1000,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box", // Ensure padding/margin doesn't cause overflow
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,  // This allows the search input to take up available space and be centered
  },
  searchInput: {
    padding: "10px",
    fontSize: "16px",
    width: "80%", // The search input takes most of the width (but still has some space)
    maxWidth: "600px",  // Optional: set a max width
    borderRadius: "4px",
    border: "1px solid #555",
    backgroundColor: "#444",
    color: "#fff",
    outline: "none",
  },
  hamburger: {
    display: "flex", // Always display the hamburger button
    flexDirection: "column",
    justifyContent: "space-around",
    width: "30px",
    height: "25px",
    cursor: "pointer",
    zIndex: 1001,
    marginLeft: "auto", // Push the hamburger button to the right
    paddingRight: "10px", // Prevent overflow on the right side
  },
  bar: {
    width: "100%",
    height: "4px",
    backgroundColor: "#fff",
  },
  dropdownMenu: {
    position: "absolute",
    top: "50px",
    right: "20px",
    backgroundColor: "#333",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
    padding: "10px 20px",
    zIndex: 1000,
  },
  logoutButton: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
  },
};

export default Navbar;
