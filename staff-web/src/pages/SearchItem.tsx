import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { getAllItems, Item } from "../services/itemService";
import { fetchCategories, Category } from "../services/categoryService";
import NavigateButton from "../components/NavigateButton";
import ToastNotification from "../components/ToastNotification";

const SearchItem: React.FC = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [editedItem, setEditedItem] = useState<Item | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Item;
    direction: string;
  } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [categoriesData, itemsData] = await Promise.all([
        fetchCategories(),
        getAllItems(),
      ]);

      setCategories(categoriesData);

      const updatedItems: Item[] = itemsData.map((item: any) => ({
        ...item,
        category_name:
          categoriesData.find((cat) => cat.category_id === item.category_id)
            ?.category_name || "Unknown",
        picture:
          item.picture instanceof File
            ? URL.createObjectURL(item.picture)
            : item.picture ?? undefined,
      }));

      setItems(updatedItems);
      setFilteredItems(updatedItems);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle search query
  useEffect(() => {
    const message = sessionStorage.getItem("successMessage");
    if (message) {
      setToastMessage(message);
      setShowToast(true);
      sessionStorage.removeItem("successMessage");
    }

    setFilteredItems(
      items.filter(
        (item) =>
          item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.item_description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, items]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEditItem = (item: Item) => {
    setEditedItem(item);
  };

  const handleSaveItem = () => {
    if (editedItem) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.item_id === editedItem.item_id
            ? { ...item, ...editedItem }
            : item
        )
      );
      setFilteredItems((prevItems) =>
        prevItems.map((item) =>
          item.item_id === editedItem.item_id
            ? { ...item, ...editedItem }
            : item
        )
      );
      setEditedItem(null);
    }
  };

  // Sorting logic
  const handleSort = (key: keyof Item) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    const sortedItems = [...filteredItems].sort((a, b) => {
      if (a[key]! < b[key]!) return direction === "asc" ? -1 : 1;
      if (a[key]! > b[key]!) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredItems(sortedItems);
    setSortConfig({ key, direction });
  };

  return (
    <div className="container mt-4">
      <NavigateButton
        navUrl="/stock-management"
        displayName="<- Back to stock management page"
      />
      <h1>Search and Edit Items</h1>

      <div className="mb-4 d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search for items..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button
          className="btn btn-success"
          onClick={() => navigate("/add-item")}
        >
          Add New Item
        </button>
      </div>

      <div>
        {filteredItems.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                {["item_name", "category_name", "stock_quantity", "price"].map(
                  (key) => (
                    <th
                      key={key}
                      onClick={() => handleSort(key as keyof Item)}
                      style={{ cursor: "pointer", minWidth: "150px" }}
                    >
                      {key.replace("_", " ").toUpperCase()}{" "}
                      <span style={{ display: "inline-block", width: "15px" }}>
                        {sortConfig?.key === key
                          ? sortConfig.direction === "asc"
                            ? "↑"
                            : "↓"
                          : " "}
                      </span>
                    </th>
                  )
                )}
                <th style={{ minWidth: "100px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.item_id}>
                  {editedItem?.item_id === item.item_id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={editedItem?.item_name}
                          onChange={(e) =>
                            setEditedItem({
                              ...editedItem!,
                              item_name: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>{item.category_name}</td>
                      <td>{item.stock_quantity}</td>
                      <td>${item.price}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={handleSaveItem}
                        >
                          Save
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{item.item_name}</td>
                      <td>{item.category_name}</td>
                      <td>{item.stock_quantity}</td>
                      <td>${item.price}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEditItem(item)}
                        >
                          Edit
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ToastNotification
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        variant="success"
        delay={5000}
      />
    </div>
  );
};

export default SearchItem;
