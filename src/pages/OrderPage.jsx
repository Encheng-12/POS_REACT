import { Checkbox, Form, Input, Calendar, Pagination } from 'antd';

function NewPage(){


    const onFinish = values => {
    console.log('Success:', values);
    };
    const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
    };
    const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
    };
    return (
        <>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
                >
                <Input.Password />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" label={null}>
                <Checkbox>Remember me</Checkbox>
                </Form.Item>    
            </Form>      
            <Calendar onPanelChange={onPanelChange} />

            <Pagination align="center" defaultCurrent={1} total={50} />

            <button type="button" class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Default</button>
        </>
    );
}

export default NewPage