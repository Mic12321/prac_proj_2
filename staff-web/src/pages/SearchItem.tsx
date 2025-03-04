import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// Define the structure of an item
interface Item {
  id: number;
  name: string;
  description: string;
  menu_category_id: number;
  category_name?: string; // New field for displaying category name
}

// Define the structure of a category
interface Category {
  id: number;
  name: string;
}

// Sample initial items
const initialItems: Item[] = [
  { id: 1, name: "Apple", description: "A red fruit", menu_category_id: 1 },
  { id: 2, name: "Banana", description: "A yellow fruit", menu_category_id: 2 },
];

// Sample category data (this would come from an API in a real application)
const categories: Category[] = [
  { id: 1, name: "Fruits" },
  { id: 2, name: "Vegetables" },
];

const SearchItem: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);
  const [editedItem, setEditedItem] = useState<Item | null>(null);

  // Assign category names to items
  useEffect(() => {
    const updatedItems = initialItems.map((item) => ({
      ...item,
      category_name:
        categories.find((cat) => cat.id === item.menu_category_id)?.name ||
        "Unknown",
    }));
    setItems(updatedItems);
  }, []);

  // Handle search query
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setItems(initialItems);
    } else {
      setItems(
        initialItems
          .map((item) => ({
            ...item,
            category_name:
              categories.find((cat) => cat.id === item.menu_category_id)
                ?.name || "Unknown",
          }))
          .filter(
            (item) =>
              item.name.toLowerCase().includes(query) ||
              item.description.toLowerCase().includes(query) ||
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
          item.id === editedItem.id ? { ...item, ...editedItem } : item
        )
      );
      setEditedItem(null);
    }
  };

  return (
    <div className="container mt-4">
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
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <ul className="list-group">
            {items.map((item) => (
              <li key={item.id} className="list-group-item">
                {editedItem?.id === item.id ? (
                  <div>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={editedItem.name}
                      onChange={(e) =>
                        setEditedItem({ ...editedItem, name: e.target.value })
                      }
                    />
                    <textarea
                      className="form-control mb-2"
                      value={editedItem.description}
                      onChange={(e) =>
                        setEditedItem({
                          ...editedItem,
                          description: e.target.value,
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
                  <div>
                    <h5>{item.name}</h5>
                    <p>{item.description}</p>
                    <p>
                      <strong>Category:</strong> {item.category_name}
                    </p>
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
