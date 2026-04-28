import { Col, Row } from "antd";
import MonthlyChart from "../components/Charts/MonthlyChart";
import Loader from "../components/Loader";
import { useCountProductsQuery } from "../redux/features/management/productApi";
import { useYearlySaleQuery } from "../redux/features/management/saleApi";
import DailyChart from "../components/Charts/DailyChart";

const Dashboard = () => {
  const { data: products, isLoading } = useCountProductsQuery(undefined);
  const { data: yearlyData, isLoading: isLoading1 } =
    useYearlySaleQuery(undefined);

  if (isLoading && isLoading1) return <Loader />;

  const totalSold =
    yearlyData?.data.reduce(
      (acc: number, cur: { totalQuantity: number }) =>
        (acc += cur.totalQuantity),
      0,
    ) || 0;

  const totalRevenue =
    yearlyData?.data.reduce(
      (acc: number, cur: { totalRevenue: number }) => (acc += cur.totalRevenue),
      0,
    ) || 0;

  return (
    <div style={{ padding: "1rem", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          Dashboard
        </h1>
        <p style={{ marginTop: "6px", color: "#64748b" }}>
          Overview of inventory, sales and revenue performance
        </p>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <div className="dashboard-card">
            <p className="dashboard-card-label">Total Stock</p>
            <h2 className="dashboard-card-value">
              {products?.data?.totalQuantity || 0}
            </h2>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="dashboard-card">
            <p className="dashboard-card-label">Total Items Sold</p>
            <h2 className="dashboard-card-value">{totalSold}</h2>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="dashboard-card">
            <p className="dashboard-card-label">Total Revenue</p>
            <h2 className="dashboard-card-value">${totalRevenue}</h2>
          </div>
        </Col>
      </Row>

      <div className="chart-card">
        <div className="chart-header">
          <h2>Daily Sale and Revenue</h2>
          <p>Track daily sales quantity and revenue</p>
        </div>
        <DailyChart />
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h2>Monthly Revenue</h2>
          <p>Monthly revenue performance summary</p>
        </div>
        <MonthlyChart />
      </div>
    </div>
  );
};

export default Dashboard;
