import React, { useEffect, useState } from "react";
import ItemDisplay from "../components/ItemDisplay";
import { getItemsForSale, Item } from "../services/itemService";
import tempImg from "../assets/temp_picture.png";

const Order: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItemsForSale();

        setItems(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center">
      <h2 className="mb-4 text-center">Orders</h2>
      <div className="row g-3 w-100 text-center">
        {items.map((item) => (
          <ItemDisplay key={item.item_id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Order;
