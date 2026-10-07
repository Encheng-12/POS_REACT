import { useState } from 'react'
import { Form, Input, Button, Checkbox, Typography, App, Divider } from 'antd'
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  ShopOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import {login} from '../services/login.js'

const { Title, Text, Link } = Typography
// const apiurl = import.meta.env.VITE_API_URL

/**
 * ItemPOS — Login / Sign up
 *
 * Single component, two modes ('login' | 'signup') toggled with the
 * tab-like switch under the heading. Left panel carries the brand;
 * right panel holds the form. Collapses to a single column on mobile.
 */
export default function AuthPage() {
  const { message } = App.useApp()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const switchMode = (next) => {
    setMode(next)
    form.resetFields()
  }

  const handleSubmit = async (values) => {

    let data

    if (mode === 'login') {
      data = await login({
        email: values.email,
        password: values.password,
      })
    } else {
      const res = await fetch(`${apiurl}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      })

      if (!res.ok) throw new Error('Signup failed')
      data = await res.json()
}
    // setLoading(true)
    // try {
    //   const endpoint = mode === 'login' ? '/login' : '/signup'
    //   const payload =
    //     mode === 'login'
    //       ? { email: values.email, password: values.password }
    //       : {
    //           name: values.name,
    //           email: values.email,
    //           password: values.password,
    //         }

    //   const res = await fetch(apiurl + endpoint, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(payload),
    //   })

    //   if (!res.ok) throw new Error('Request failed')
    //   const data = await res.json()

    //   if (data?.token) localStorage.setItem('token', data.token)
    //   message.success(mode === 'login' ? 'Welcome back!' : 'Account created — you\'re in!')

    //   window.location.href = '/home'
    // } catch (error) {
    //   console.error('Auth failed:', error)
    //   message.error(
    //     mode === 'login'
    //       ? 'Invalid email or password.'
    //       : 'Could not create your account. That email may already be in use.'
    //   )
    // } finally {
    //   setLoading(false)
    // }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* ---------- Brand panel ---------- */}
        <div style={styles.brandPanel}>
          <div style={styles.brandMark}>
            <ShopOutlined style={{ fontSize: 22, color: '#fff' }} />
          </div>
          <Title level={3} style={{ color: '#fff', marginTop: 20, marginBottom: 6 }}>
            My<span style={{ color: '#BBF7D0' }}>POS</span>
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 260, display: 'block' }}>
            Run your whole store from one place — sales, stock, staff and payments, all in sync.
          </Text>

          <div style={styles.brandStats}>
            {[
              ['Products tracked', 'in real time'],
              ['Sales & payments', 'recorded instantly'],
              ['Staff roles', 'kept in check'],
            ].map(([a, b]) => (
              <div key={a} style={styles.brandStatRow}>
                <span style={styles.brandDot} />
                <div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{a}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{b}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Form panel ---------- */}
        <div style={styles.formPanel}>
          <div style={{ maxWidth: 340, margin: '0 auto', width: '100%' }}>
            <Title level={3} style={{ marginBottom: 4 }}>
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </Title>
            <Text type="secondary">
              {mode === 'login'
                ? 'Sign in to your ItemPOS dashboard'
                : 'Set up ItemPOS for your store in a minute'}
            </Text>

            {/* mode switch */}
            <div style={styles.switch}>
              <button
                type="button"
                onClick={() => switchMode('login')}
                style={{ ...styles.switchBtn, ...(mode === 'login' ? styles.switchBtnActive : {}) }}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                style={{ ...styles.switchBtn, ...(mode === 'signup' ? styles.switchBtnActive : {}) }}
              >
                Sign up
              </button>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              style={{ marginTop: 20 }}
              requiredMark={false}
            >
              {mode === 'signup' && (
                <Form.Item
                  name="name"
                  label="Full name"
                  rules={[{ required: true, message: 'Please enter your name' }]}
                >
                  <Input prefix={<UserOutlined style={{ color: '#9CA3AF' }} />} placeholder="Sokha Ry" size="large" />
                </Form.Item>
              )}

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Enter a valid email' },
                ]}
              >
                <Input prefix={<MailOutlined style={{ color: '#9CA3AF' }} />} placeholder="you@store.com" size="large" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please enter your password' },
                  ...(mode === 'signup'
                    ? [{ min: 8, message: 'Use at least 8 characters' }]
                    : []),
                ]}
              >
                <Input.Password prefix={<LockOutlined style={{ color: '#9CA3AF' }} />} placeholder="••••••••" size="large" />
              </Form.Item>

              {mode === 'signup' && (
                <Form.Item
                  name="confirmPassword"
                  label="Confirm password"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Please confirm your password' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) return Promise.resolve()
                        return Promise.reject(new Error('Passwords do not match'))
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<LockOutlined style={{ color: '#9CA3AF' }} />} placeholder="••••••••" size="large" />
                </Form.Item>
              )}

              {mode === 'login' ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, marginTop: -8 }}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <Link href="#" style={{ fontSize: 13 }}>Forgot password?</Link>
                </div>
              ) : (
                <Form.Item
                  name="agree"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, checked) =>
                        checked ? Promise.resolve() : Promise.reject(new Error('Please accept the terms to continue')),
                    },
                  ]}
                >
                  <Checkbox>
                    I agree to the <Link href="#">Terms</Link> and <Link href="#">Privacy Policy</Link>
                  </Checkbox>
                </Form.Item>
              )}

              <Form.Item style={{ marginBottom: 12 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  block
                  icon={<ArrowRightOutlined />}
                  iconPosition="end"
                  style={{ background: '#22C55E', borderColor: '#22C55E', fontWeight: 600 }}
                >
                  {mode === 'login' ? 'Log in' : 'Create account'}
                </Button>
              </Form.Item>
            </Form>

            <Divider plain style={{ fontSize: 12, color: '#9CA3AF' }}>or</Divider>

            <Text style={{ display: 'block', textAlign: 'center', fontSize: 13 }}>
              {mode === 'login' ? (
                <>No account yet?{' '}
                  <Link onClick={() => switchMode('signup')}>Create one</Link>
                </>
              ) : (
                <>Already have an account?{' '}
                  <Link onClick={() => switchMode('login')}>Log in</Link>
                </>
              )}
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F3F5F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 880,
    minHeight: 540,
    background: '#fff',
    borderRadius: 20,
    boxShadow: '0 12px 32px rgba(17,24,39,0.10), 0 4px 8px rgba(17,24,39,0.04)',
    display: 'flex',
    overflow: 'hidden',
  },
  brandPanel: {
    flex: '0 0 42%',
    background: 'linear-gradient(160deg, #16A34A 0%, #15803D 100%)',
    padding: '40px 36px',
    display: 'flex',
    flexDirection: 'column',
  },
  brandMark: {
    width: 44,
    height: 44,
    borderRadius: 13,
    background: 'rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandStats: {
    marginTop: 'auto',
    paddingTop: 40,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  brandStatRow: { display: 'flex', alignItems: 'center', gap: 12 },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#BBF7D0',
    flex: '0 0 8px',
  },
  formPanel: {
    flex: 1,
    padding: '44px 40px',
    display: 'flex',
    alignItems: 'center',
  },
  switch: {
    marginTop: 18,
    display: 'flex',
    background: '#F1F3F7',
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  switchBtn: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    borderRadius: 8,
    padding: '8px 0',
    fontSize: 13,
    fontWeight: 600,
    color: '#6B7280',
    cursor: 'pointer',
  },
  switchBtnActive: {
    background: '#fff',
    color: '#111827',
    boxShadow: '0 1px 2px rgba(17,24,39,.08)',
  },
}