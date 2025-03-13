import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { getAllItems, updateItem, Item } from "../services/itemService";
import { fetchCategories, Category } from "../services/categoryService";
import NavigateButton from "../components/NavigateButton";
import ToastNotification from "../components/ToastNotification";

const SearchItem: React.FC = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [editedItem, setEditedItem] = useState<Item | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Item;
    direction: string;
  } | null>(null);
  const [originalItem, setOriginalItem] = useState<Item | null>(null);

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
      setToastVariant("danger");
      setToastMessage("Failed to fetch data. Please try again.");
      setShowToast(true);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const message = sessionStorage.getItem("successMessage");
    if (message) {
      setToastVariant("success");
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
    if (editedItem && editedItem.item_id !== item.item_id) {
      if (
        originalItem &&
        JSON.stringify(editedItem) !== JSON.stringify(originalItem)
      ) {
        const userConfirmed = window.confirm(
          "You have unsaved changes. Do you want to discard them?"
        );

        if (!userConfirmed) {
          return;
        }
      }
    }

    setOriginalItem({ ...item });
    setEditedItem(item);
  };

  const handleSaveItem = async () => {
    if (editedItem) {
      try {
        const updatedItems = items.map((item) =>
          item.item_id === editedItem.item_id
            ? { ...item, ...editedItem }
            : item
        );
        setItems(updatedItems);
        setFilteredItems(updatedItems);

        const updatedItem = await updateItem(editedItem.item_id!, editedItem);

        setEditedItem(null);
        setToastVariant("success");
        setToastMessage("Item updated successfully!");
        setShowToast(true);
      } catch (error: any) {
        setToastVariant("danger");
        setToastMessage(
          error.message || "Failed to update item. Please try again."
        );
        setShowToast(true);
      }
    }
  };

  const handleCacnelEdit = () => {
    if (originalItem) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.item_id === originalItem.item_id ? originalItem : item
        )
      );
    }

    setEditedItem(null);
    setOriginalItem(null);
  };

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
                          value={editedItem?.item_name || ""}
                          onChange={(e) =>
                            setEditedItem((prev) =>
                              prev
                                ? { ...prev, item_name: e.target.value }
                                : prev
                            )
                          }
                        />
                      </td>
                      <td>{item.category_name}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={editedItem?.stock_quantity ?? ""}
                          onChange={(e) =>
                            setEditedItem((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    stock_quantity:
                                      parseInt(e.target.value) || 0,
                                  }
                                : prev
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={editedItem?.price ?? ""}
                          onChange={(e) =>
                            setEditedItem((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    price: parseFloat(e.target.value) || 0,
                                  }
                                : prev
                            )
                          }
                        />
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={handleSaveItem}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={handleCacnelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{item.item_name}</td>
                      <td>{item.category_name}</td>
                      <td>{item.stock_quantity}</td>
                      <td>${item.price}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEditItem(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() =>
                              navigate(`/item-detail/${item.item_id}`)
                            }
                          >
                            View Details
                          </button>
                        </div>
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
        variant={toastVariant}
        delay={5000}
      />
    </div>
  );
};

export default SearchItem;
