import { useState } from "react";
import { Form, Input, Button, Checkbox, Typography, App } from "antd";
import {
  MailOutlined,
  LockOutlined,
  ShopOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { login } from "../services/login.js";
import { useNavigate } from "react-router";

const { Title, Text, Link } = Typography;

export default function AuthPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const res = await login({
        email: values.email,
        password: values.password,
      });

      if (res) {
        message.success("Login successful!");

        // Extract user and role from response
        const user = res.user || res.data || res;
        const role = (user.role || res.role || "cashier").toLowerCase();

        // Save user info and role to localStorage
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userRole", role);

        // Redirect based on role
        if (role === "admin") {
          navigate("/home");
        } else {
          navigate("/products");
        }
      }
    } catch (err) {
      message.error(err.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* ---------- Brand panel ---------- */}
        <div style={styles.brandPanel}>
          <div style={styles.brandMark}>
            <ShopOutlined style={{ fontSize: 22, color: "#fff" }} />
          </div>
          <Title
            level={3}
            style={{ color: "#fff", marginTop: 20, marginBottom: 6 }}
          >
            My<span style={{ color: "#BBF7D0" }}>POS</span>
          </Title>
          <Text
            style={{
              color: "rgba(255,255,255,0.75)",
              maxWidth: 260,
              display: "block",
            }}
          >
            Run your whole store from one place — sales, stock, staff and
            payments, all in sync.
          </Text>

          <div style={styles.brandStats}>
            {[
              ["Products tracked", "in real time"],
              ["Sales & payments", "recorded instantly"],
              ["Staff roles", "kept in check"],
            ].map(([a, b]) => (
              <div key={a} style={styles.brandStatRow}>
                <span style={styles.brandDot} />
                <div>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>
                    {a}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                    {b}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Form panel ---------- */}
        <div style={styles.formPanel}>
          <div style={{ maxWidth: 340, margin: "0 auto", width: "100%" }}>
            <Title level={3} style={{ marginBottom: 4 }}>
              Welcome back
            </Title>
            <Text type="secondary">
              Sign in to your ItemPOS dashboard
            </Text>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              style={{ marginTop: 20 }}
              requiredMark={false}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: "#9CA3AF" }} />}
                  placeholder="you@store.com"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#9CA3AF" }} />}
                  placeholder="••••••••"
                  size="large"
                />
              </Form.Item>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 16,
                  marginTop: -8,
                }}
              >
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Link href="#" style={{ fontSize: 13 }}>
                  Forgot password?
                </Link>
              </div>

              <Form.Item style={{ marginBottom: 12 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  block
                  icon={<ArrowRightOutlined />}
                  style={{
                    background: "#22C55E",
                    borderColor: "#22C55E",
                    fontWeight: 600,
                  }}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>

          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F3F5F9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 880,
    minHeight: 540,
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 12px 32px rgba(17,24,39,0.10), 0 4px 8px rgba(17,24,39,0.04)",
    display: "flex",
    overflow: "hidden",
  },
  brandPanel: {
    flex: "0 0 42%",
    background: "linear-gradient(160deg, #16A34A 0%, #15803D 100%)",
    padding: "40px 36px",
    display: "flex",
    flexDirection: "column",
  },
  brandMark: {
    width: 44,
    height: 44,
    borderRadius: 13,
    background: "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandStats: {
    marginTop: "auto",
    paddingTop: 40,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  brandStatRow: { display: "flex", alignItems: "center", gap: 12 },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#BBF7D0",
    flex: "0 0 8px",
  },
  formPanel: {
    flex: 1,
    padding: "44px 40px",
    display: "flex",
    alignItems: "center",
  },
  switch: {
    marginTop: 18,
    display: "flex",
    background: "#F1F3F7",
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  switchBtn: {
    flex: 1,
    border: "none",
    background: "transparent",
    borderRadius: 8,
    padding: "8px 0",
    fontSize: 13,
    fontWeight: 600,
    color: "#6B7280",
    cursor: "pointer",
  },
  switchBtnActive: {
    background: "#fff",
    color: "#111827",
    boxShadow: "0 1px 2px rgba(17,24,39,.08)",
  },
};