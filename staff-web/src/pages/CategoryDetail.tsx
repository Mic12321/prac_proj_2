import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCategoryById, Category } from "../services/categoryService";
import { getItemsByCategoryId, Item } from "../services/itemService";

const CategoryDetail: React.FC = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryAndItems = async () => {
      try {
        setLoading(true);

        const selectedCategory = await getCategoryById(Number(categoryId));
        setCategory(selectedCategory);

        if (!selectedCategory) {
          throw new Error("Category not found");
        }

        setCategory(selectedCategory);

        const categoryItems = await getItemsByCategoryId(Number(categoryId));
        setItems(categoryItems);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndItems();
  }, [categoryId]);

  if (loading) return <p>Loading category details...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!category) return <p>Category not found.</p>;

  return (
    <div className="container mt-4">
      <h2>Category: {category.category_name}</h2>
      <p>
        <strong>Description:</strong>{" "}
        {category.category_description || "No description provided."}
      </p>
      <p>
        <strong>Linked Items Quantity:</strong> {items.length}
      </p>

      <h4 className="mt-4">Items in this Category:</h4>
      {items.length > 0 ? (
        <ul className="list-group mt-2">
          {items.map((item) => (
            <li key={item.item_id} className="list-group-item">
              <strong>{item.item_name}</strong> - {item.item_description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No items found for this category.</p>
      )}
    </div>
  );
};

export default CategoryDetail;
