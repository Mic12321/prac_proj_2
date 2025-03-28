import React, { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import tempImg from "../assets/temp_picture.png";

interface ShoppingCartPanelProps {
  cart: { [key: number]: number };
  onAdd: (itemId: number) => void;
  onRemove: (itemId: number, removeAll: boolean) => void;
}

const ShoppingCartPanel: React.FC<ShoppingCartPanelProps> = ({
  cart,
  onAdd,
  onRemove,
}) => {
  const [navbarHeight, setNavbarHeight] = useState(0);

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
    <div
      className="position-fixed end-0 vh-100 bg-white shadow-lg border-start p-3 overflow-auto"
      style={{
        width: "300px",
        top: `${navbarHeight}px`,
      }}
    >
      <h5 className="border-bottom pb-2 mb-3">Shopping Cart</h5>
      {Object.keys(cart).length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul className="list-unstyled">
          {Object.entries(cart).map(([itemId, quantity]) => (
            <li
              key={itemId}
              className="d-flex justify-content-between align-items-center border-bottom py-2"
            >
              <div className="d-flex align-items-center">
                <img
                  src={tempImg}
                  alt="item"
                  className="rounded me-2"
                  style={{ width: "50px", height: "50px" }}
                />
                <div>
                  <p className="mb-1">Item name</p>
                  <p className="small text-muted">Qty: {quantity}</p>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-sm btn-outline-secondary me-1"
                  onClick={() => onRemove(Number(itemId), false)}
                >
                  -
                </button>

                <span
                  className="d-flex align-items-center justify-content-center px-2 "
                  style={{
                    width: "30px",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {quantity}
                </span>

                <button
                  className="btn btn-sm btn-outline-secondary ms-1"
                  onClick={() => onAdd(Number(itemId))}
                >
                  +
                </button>

                <Trash
                  className="text-danger ms-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => onRemove(Number(itemId), true)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShoppingCartPanel;
