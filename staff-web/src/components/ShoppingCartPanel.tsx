import React, { useEffect, useState } from "react";
import {
  Trash,
  ShoppingCart,
  ArrowRightCircle,
  Plus,
  Minus,
} from "lucide-react";
import tempImg from "../assets/temp_picture.png";
import { Item } from "../services/itemService"; // Ensure correct import

interface ShoppingCartPanelProps {
  cart: { [key: number]: number };
  onAdd: (itemId: number) => void;
  onRemove: (itemId: number, removeAll: boolean) => void;
  items: Item[];
}

const ShoppingCartPanel: React.FC<ShoppingCartPanelProps> = ({
  cart,
  onAdd,
  onRemove,
  items,
}) => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const cartPanelWidth = "350";

  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.querySelector(".navbar");
      if (navbar) {
        setNavbarHeight(navbar.clientHeight);
      }
    };

    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);

  return (
    <>
      {isOpen && (
        <div
          className="position-fixed end-0 vh-100 bg-white shadow-lg border-start p-3 overflow-auto"
          style={{
            width: `${cartPanelWidth}px`,
            top: `${navbarHeight}px`,
          }}
        >
          <h5 className="border-bottom pb-2 mb-3">Shopping Cart</h5>

          {Object.keys(cart).length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul className="list-unstyled">
              {Object.entries(cart).map(([itemId, quantity]) => {
                const item = items.find(
                  (item) => item.item_id === Number(itemId)
                );

                return (
                  <li
                    key={itemId}
                    className="d-flex justify-content-between align-items-center border-bottom py-2"
                  >
                    <div
                      className="d-flex align-items-center"
                      style={{ flex: 1 }}
                    >
                      <img
                        src={tempImg}
                        alt={item ? item.item_name : "Unknown Item"}
                        className="rounded me-2"
                        style={{ width: "50px", height: "50px", flexShrink: 0 }}
                      />
                      <div style={{ maxWidth: "125px", overflow: "hidden" }}>
                        <p
                          className="mb-1"
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={item ? item.item_name : "Unknown Item"}
                        >
                          {item ? item.item_name : "Unknown Item"}
                        </p>
                        <p className="small text-muted mb-0">Qty: {quantity}</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={() => onRemove(Number(itemId), false)}
                      >
                        <Minus />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-success ms-2"
                        onClick={() => onAdd(Number(itemId))}
                      >
                        <Plus />
                      </button>

                      <Trash
                        className="text-danger ms-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => onRemove(Number(itemId), true)}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {isOpen ? (
        <button
          className="btn btn-sm btn-primary position-fixed"
          style={{
            top: `${navbarHeight + 20}px`,
            right: `${cartPanelWidth}px`,
            zIndex: 1060,
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <ArrowRightCircle size={20} className="me-1" />
        </button>
      ) : (
        <button
          className="btn btn-sm btn-primary position-fixed"
          style={{
            top: `${navbarHeight + 20}px`,
            right: `0px`,
            zIndex: 1060,
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <ShoppingCart size={20} className="me-1" />
        </button>
      )}
    </>
  );
};

export default ShoppingCartPanel;
