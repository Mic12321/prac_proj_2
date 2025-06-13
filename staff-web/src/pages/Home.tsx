import React from "react";
import DashboardButton from "../components/DashboardButton";
import stockManagementImg from "../assets/stock.png";
import orderImg from "../assets/order.png";
import pendingImg from "../assets/pending.png";
import analysisImg from "../assets/analysis.png";
import accountMangementImg from "../assets/account_management.png";
import tempImg from "../assets/temp_picture.png";

interface HomeProps {
  isAdmin: boolean;
}

const Home: React.FC<HomeProps> = ({ isAdmin }) => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center">
      <h2 className="mb-4 text-center">Welcome to Dashboard</h2>

      <div className="row g-3 w-100 text-center">
        <DashboardButton
          image={stockManagementImg}
          label="Stock Management Button"
          displayName="Manage Stock"
          route="/stock-management"
        />
        <DashboardButton
          image={orderImg}
          label="Order Button"
          displayName="Start Ordering"
          route="/order"
        />

        <DashboardButton
          image={pendingImg}
          label="Pending Orders Button"
          displayName="View Pending Orders"
          route="/pending-orders"
        />

        <DashboardButton
          image={tempImg}
          label="Order History Button"
          displayName="View Order History"
          route="/order-history"
        />

        {isAdmin && (
          <DashboardButton
            image={analysisImg}
            label="Data Analysis Button"
            displayName="View Data Analysis"
            route="/analysis"
          />
        )}
        {isAdmin && (
          <DashboardButton
            image={accountMangementImg}
            label="Account Management Button"
            displayName="Manage Account"
            route="/account-management"
          />
        )}
      </div>
    </div>
  );
};

export default Home;
