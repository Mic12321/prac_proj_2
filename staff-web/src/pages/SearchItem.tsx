import React, { useState } from "react";

// Sample data for items
const initialItems = [
  { id: 1, name: "Apple", description: "A red fruit" },
  { id: 2, name: "Banana", description: "A yellow fruit" },
  { id: 3, name: "Carrot", description: "An orange vegetable" },
  { id: 4, name: "Date", description: "A sweet brown fruit" },
  { id: 5, name: "Eggplant", description: "A purple vegetable" },
];

const SearchItem: React.FC = () => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  // State for items (filtered or all)
  const [items, setItems] = useState(initialItems);

  // State for editing item details
  const [editedItem, setEditedItem] = useState<{
    id: number;
    name: string;
    description: string;
  } | null>(null);

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter items based on search query
    if (query === "") {
      setItems(initialItems); // Reset to initial items when search is empty
    } else {
      const filteredItems = initialItems.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      );
      setItems(filteredItems);
    }
  };

  // Handle editing an item
  const handleEditItem = (item: {
    id: number;
    name: string;
    description: string;
  }) => {
    setEditedItem(item);
  };

  // Handle saving edited item
  const handleSaveItem = () => {
    if (editedItem) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editedItem.id
            ? {
                ...item,
                name: editedItem.name,
                description: editedItem.description,
              }
            : item
        )
      );
      setEditedItem(null); // Reset editing state
    }
  };

  // Handle change in item details (name or description)
  const handleItemChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    field: "name" | "description"
  ) => {
    if (editedItem) {
      setEditedItem({ ...editedItem, [field]: e.target.value });
    }
  };

  return (
    <div className="container mt-4">
      <h1>Search and Edit Items</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search for items..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Item List */}
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
                      onChange={(e) => handleItemChange(e, "name")}
                    />
                    <textarea
                      className="form-control mb-2"
                      value={editedItem.description}
                      onChange={(e) => handleItemChange(e, "description")}
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
