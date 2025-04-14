import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import { getAllItems, Item } from "../services/itemService";
import { fetchCategories, Category } from "../services/categoryService";
import NavigateButton from "../components/NavigateButton";
import ToastNotification from "../components/ToastNotification";
import ItemSearchBar from "../components/ItemSearchBar";
import ItemTable from "../components/ItemTable";

const ModifyIngredient: React.FC = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<
    "success" | "danger" | "info"
  >("success");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Item;
    direction: string;
  } | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [categoriesData, itemsData] = await Promise.all([
        fetchCategories(),
        getAllItems(),
      ]);

      setCategories(categoriesData);
      setSelectedCategories(categoriesData.map((c) => c.category_id!));

      const updatedItems: Item[] = itemsData.map((item: any) => ({
        ...item,
        category_name:
          categoriesData.find((cat) => cat.category_id === item.category_id)
            ?.category_name || "",
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
    const filtered = items.filter((item) => {
      const matchesSearch =
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.item_description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.category_name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategories.includes(item.category_id!);

      return matchesSearch && matchesCategory;
    });

    setFilteredItems(filtered);
  }, [searchQuery, items, selectedCategories]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
    setToastVariant("info");
    setToastMessage(`You selected: ${item.item_name}`);
    setShowToast(true);
  };

  const handleSaveSelection = () => {
    if (!selectedItem) {
      setToastVariant("danger");
      setToastMessage("No item selected.");
      setShowToast(true);
      return;
    }

    setToastVariant("success");
    setToastMessage(`Ingredient ${selectedItem.item_name} added successfully.`);
    setShowToast(true);
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

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      items.some((item) => item.category_id === category.category_id)
    );
  }, [categories, items]);

  return (
    <div className="container mt-4">
      <NavigateButton
        navUrl="/stock-management"
        displayName="<- Back to stock management page"
      />
      <h1>Select an Item to Add as Ingredient</h1>

      <ItemSearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddItemClick={() => navigate("/add-item")}
        categories={filteredCategories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />

      {selectedItem && (
        <div className="alert alert-info mt-3">
          <strong>Selected Item: </strong> {selectedItem.item_name}
        </div>
      )}

      <ItemTable
        items={filteredItems}
        editedItem={null}
        sortConfig={sortConfig}
        onEditItem={() => {}}
        onSaveItem={() => {}}
        onCancelEdit={() => {}}
        onSort={handleSort}
        setEditedItem={() => {}}
        navigateToDetail={(id) => navigate(`/item-detail/${id}`)}
        isEditing={false}
        onSelectItem={handleSelectItem}
      />

      <div className="mt-3">
        <button className="btn btn-success" onClick={handleSaveSelection}>
          Save Selection
        </button>
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

export default ModifyIngredient;
