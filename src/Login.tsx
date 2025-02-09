import React from 'react';
import {Button, Form, Input, message} from 'antd';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

interface LoginFormValues {
    username: string;
    password: string;
}

const Login: React.FC<{ onLoginSuccess: () => void }> = ({onLoginSuccess}) => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: LoginFormValues) => {
        try {
            // 调用后端API进行登录验证
            const response = await axios.post('/api/login', {
                username: values.username,
                password: values.password,
            });

            // 假设后端返回的响应格式为 { token: 'your_token_here' }
            const token = response.data.data.token;
            if (!token) {
                messageApi.error('登录失败，请检查用户名和密码');
                return;
            }

            // 保存token到localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', values.username);

            // 更新登录状态
            onLoginSuccess();

            // 登录成功后跳转到主页
            navigate('/', {replace: true});
        } catch (error) {
            // 处理登录失败的情况
            messageApi.error('登录失败，请检查用户名和密码');
            console.error('Login failed:', error);
        }
    };

    return (
        <>
            {contextHolder}
            <Form
                name="login"
                initialValues={{remember: true}}
                onFinish={onFinish}
                style={{maxWidth: 300, margin: '0 auto', marginTop: '50px'}}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{required: true, message: 'Please input your username!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default Login;
