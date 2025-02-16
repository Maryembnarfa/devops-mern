import React from 'react';
import { Button, Form, Input, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
function Login() {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: async (values) => {
            const response = await axiosInstance.post("/login", values);
            return response.data;
        },
        onSuccess: (data) => {
            // Décoder le token
            const decodedToken = jwtDecode(data.token);
            console.log(decodedToken); // Afficher le contenu du token pour voir ce qui est dedans

            // Stocker le token dans le localStorage
            localStorage.setItem("jwt", data.token);

            // Stocker aussi les informations du token (comme le rôle) dans localStorage si nécessaire
            localStorage.setItem("userRole", decodedToken.role); // Stocker le rôle

            // Vérifier si le token est bien stocké
            const storedToken = localStorage.getItem("jwt");
            if (storedToken === data.token) {
                message.success("Token stored successfully. Redirecting...", 3);

                // Rediriger vers le dashboard après le succès
                setTimeout(() => {
                    navigate("/dashboard");  // Utiliser navigate pour la redirection
                }, 1000);  // Délai de 5 secondes pour laisser le message
            } else {
                message.error("Failed to store the token.");
            }
        },


        onError: (error) => {
            message.error("invalid credentials");
        },
    });

    const handleSubmit = (values) => {
        mutate(values);
    };

    return (
        <div style={styles.container}>
            <div style={styles.formWrapper}>
                <h2 style={styles.title}>Login</h2>
                <Form form={form} name="login" layout="vertical" onFinish={handleSubmit}
                    preserve={false}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name={"email"}
                        rules={[{ required: true, message: "Please enter your email" }, { type: "email", message: "Invalid email format" }]}
                    >
                        <Input autoComplete="off" />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name={"password"}
                        rules={[{ required: true, message: "Please enter your password" }]}
                    >
                        <Input.Password autoComplete="new-password" />
                    </Form.Item>
                    <Button
                        htmlType="Submit"
                        type="primary"
                        size="large"
                        loading={isPending}
                        style={styles.button}
                    >
                        Login
                    </Button>
                </Form>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f7fa',
    },
    formWrapper: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
        width: '400px',
        textAlign: 'center',
    },
    title: {
        fontSize: '24px',
        marginBottom: '20px',
    },
    button: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
    },
};

export default Login;
