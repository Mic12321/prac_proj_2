import React from "react";
import { CreditCard, DollarSign } from "lucide-react";

const Checkout: React.FC = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-3">Checkout</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Order Summary</h5>
          <p>
            Total Items: <strong>3</strong>
          </p>
          <p>
            Subtotal: <strong>$150.00</strong>
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-lg btn-success">
          <CreditCard className="me-3" /> Pay by Card
        </button>

        <button className="btn btn-lg btn-success ">
          <DollarSign className="me-3" /> Pay by Cash
        </button>
      </div>
    </div>
  );
};

export default Checkout;
