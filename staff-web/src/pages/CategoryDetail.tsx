import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCategoryById, Category } from "../services/categoryService";
import { getItemsByCategoryId, Item } from "../services/itemService";
import ItemTable from "../components/ItemTable";

const CategoryDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editedItem, setEditedItem] = useState<Item | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Item;
    direction: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (categoryId) {
        setLoading(true);
        try {
          const fetchedCategory = await getCategoryById(Number(categoryId));
          const fetchedItems = await getItemsByCategoryId(Number(categoryId));
          setCategory(fetchedCategory);
          setItems(fetchedItems || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [categoryId]);

  const handleEditItem = (item: Item) => {
    setEditedItem(item);
    setIsEditing(true);
  };

  const handleSaveItem = () => {
    setEditedItem(null);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedItem(null);
    setIsEditing(false);
  };

  const handleSort = (key: keyof Item) => {
    let direction = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setItems((prevItems) =>
      [...prevItems].sort((a, b) => {
        if (a[key]! < b[key]!) return direction === "asc" ? -1 : 1;
        if (a[key]! > b[key]!) return direction === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  const handleSelectItem = (item: Item) => {
    console.log("Selected item:", item);
  };

  const handleRemoveItem = (item: Item) => {
    setItems((prev) => prev.filter((i) => i.item_id !== item.item_id));
  };

  const navigateToDetail = (id: number) => {
    navigate(`/item-detail/${id}`);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
        <p>Loading category details...</p>
      </div>
    );
  }

  if (!category) {
    return <p>Category not found.</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Category Detail: {category.category_name}</h2>
      <p>{category.category_description}</p>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Items ({items.length})</h4>
      </div>

      <ItemTable
        items={items}
        editedItem={editedItem}
        sortConfig={sortConfig}
        onEditItem={handleEditItem}
        onSaveItem={handleSaveItem}
        onCancelEdit={handleCancelEdit}
        onSort={handleSort}
        setEditedItem={setEditedItem}
        navigateToDetail={navigateToDetail}
        isEditing={isEditing}
        onSelectItem={handleSelectItem}
        showRemoveButton={true}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default CategoryDetail;
