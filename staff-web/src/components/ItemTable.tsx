import React from "react";
import { Item } from "../services/itemService";

interface ItemTableProps {
  items: Item[];
  editedItem: Item | null;
  sortConfig: { key: keyof Item; direction: string } | null;
  onEditItem: (item: Item) => void;
  onSaveItem: () => void;
  onCancelEdit: () => void;
  onSort: (key: keyof Item) => void;
  setEditedItem: React.Dispatch<React.SetStateAction<Item | null>>;
  navigateToDetail: (id: number) => void;
}

const ItemTable: React.FC<ItemTableProps> = ({
  items,
  editedItem,
  sortConfig,
  onEditItem,
  onSaveItem,
  onCancelEdit,
  onSort,
  setEditedItem,
  navigateToDetail,
}) => {
  if (items.length === 0) return <p>No items found.</p>;

  return (
    <table className="table table-striped table-bordered">
      <thead>
        <tr>
          {[
            "item_name",
            "category_name",
            "stock_quantity",
            "unit_name",
            "price",
          ].map((key) => (
            <th
              key={key}
              onClick={() => onSort(key as keyof Item)}
              style={{ cursor: "pointer", minWidth: "150px" }}
            >
              {key.replace("_", " ").toUpperCase()}{" "}
              <span style={{ display: "inline-block", width: "15px" }}>
                {sortConfig?.key === key
                  ? sortConfig.direction === "asc"
                    ? "↑"
                    : "↓"
                  : " "}
              </span>
            </th>
          ))}
          <th style={{ minWidth: "100px" }}>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.item_id}>
            {editedItem?.item_id === item.item_id ? (
              <>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={editedItem!.item_name}
                    onChange={(e) =>
                      setEditedItem((prev) =>
                        prev ? { ...prev, item_name: e.target.value } : prev
                      )
                    }
                  />
                </td>
                <td>{item.category_name}</td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={editedItem!.stock_quantity ?? ""}
                    onChange={(e) =>
                      setEditedItem((prev) =>
                        prev
                          ? {
                              ...prev,
                              stock_quantity: parseInt(e.target.value) || 0,
                            }
                          : prev
                      )
                    }
                  />
                </td>
                <td>{item.unit_name}</td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={editedItem!.price ?? ""}
                    onChange={(e) =>
                      setEditedItem((prev) =>
                        prev
                          ? {
                              ...prev,
                              price: parseFloat(e.target.value) || 0,
                            }
                          : prev
                      )
                    }
                  />
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={onSaveItem}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={onCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </>
            ) : (
              <>
                <td>{item.item_name}</td>
                <td>{item.category_name}</td>
                <td>{item.stock_quantity}</td>
                <td>{item.unit_name}</td>
                <td>${item.price}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onEditItem(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigateToDetail(item.item_id!)}
                    >
                      View Details
                    </button>
                  </div>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ItemTable;
