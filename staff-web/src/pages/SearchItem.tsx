import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { getAllItems, Item } from "../services/itemService";
import { fetchCategories, Category } from "../services/categoryService";
import NavigateButton from "../components/NavigateButton";

const SearchItem: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [editedItem, setEditedItem] = useState<Item | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

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
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter(
          (item) =>
            item.item_name.toLowerCase().includes(query) ||
            item.item_description?.toLowerCase().includes(query) ||
            item.category_name?.toLowerCase().includes(query)
        )
      );
    }
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
          <ul className="list-group">
            {filteredItems.map((item) => (
              <li key={item.item_id} className="list-group-item">
                {editedItem?.item_id === item.item_id ? (
                  <div>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={editedItem?.item_name}
                      onChange={(e) =>
                        setEditedItem({
                          ...editedItem!,
                          item_name: e.target.value,
                        })
                      }
                    />
                    <textarea
                      className="form-control mb-2"
                      value={editedItem?.item_description}
                      onChange={(e) =>
                        setEditedItem({
                          ...editedItem!,
                          item_description: e.target.value,
                        })
                      }
                    />
                    <button
                      className="btn btn-success"
                      onClick={handleSaveItem}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <h5>{item.item_name}</h5>
                    <p>{item.item_description}</p>
                    <p>
                      <strong>Category:</strong> {item.category_name}
                    </p>
                    <p>
                      <strong>Stock:</strong> {item.stock_quantity}
                    </p>
                    <p>
                      <strong>Price:</strong> ${item.price}
                    </p>
                    {/* {item.picture && (
                      <img
                        src={item.picture}
                        alt={item.item_name}
                        className="img-fluid"
                        style={{ maxWidth: "100px" }}
                      />
                    )} */}
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEditItem(item)}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchItem;
