import { useNavigate } from "react-router";
import { Typography, Row, Col, Empty, Button, Tag, Flex } from "antd";
import {
  AppstoreOutlined,
  DownloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import ProductCard from "../components/ProductCard";

const { Title, Paragraph } = Typography;

function PaymentPage({ products }) {
  const navigate = useNavigate();

  return (
    <>
      <header></header>
    </>
  );
}

export default PaymentPage;
