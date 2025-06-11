import React, { useEffect, useState } from "react";
import {
  Trash,
  ShoppingCart,
  ArrowRightCircle,
  Plus,
  Minus,
} from "lucide-react";
import tempImg from "../assets/temp_picture.png";
import { Item } from "../services/itemService";

interface ShoppingCartPanelProps {
  cart: { [key: number]: number };
  onAdd: (itemId: number) => void;
  onRemove: (itemId: number, removeAll: boolean) => void;
  onCheckout: () => void;
  onClearCart: () => void;
  items: Item[];

  totalItems: number;
  subtotal: number;
}

const ShoppingCartPanel: React.FC<ShoppingCartPanelProps> = ({
  cart,
  onAdd,
  onRemove,
  onCheckout,
  onClearCart,
  items,
  totalItems,
  subtotal,
}) => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const cartPanelWidth = "350";

  const handleClearCart = () => {
    onClearCart();
  };

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
          <div className="d-flex justify-content-between align-items-center pb-2 mb-3">
            <h5 className="mb-0">Shopping Cart</h5>
            <button
              className="btn btn-sm btn-success"
              onClick={() => onCheckout()}
            >
              Checkout
            </button>
          </div>
          <p className=""> Total Items: {totalItems}</p>
          <div className="d-flex justify-content-between align-items-center border-bottom">
            <p className="">Subtotal: ${subtotal}</p>
            <button
              className="btn btn-sm btn-danger mb-3"
              onClick={handleClearCart}
            >
              Clear Cart
            </button>
          </div>

          {Object.keys(cart).length === 0 ? (
            <p className="">Your cart is empty</p>
          ) : (
            <ul
              className="list-unstyled"
              style={{
                minHeight: "70vh",
                overflowY: "auto",
                paddingBottom: "40px",
              }}
            >
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
                      <div style={{ maxWidth: "110px", overflow: "hidden" }}>
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
                        <p className="small text-muted mb-0">
                          Price: ${item?.price}
                        </p>
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
