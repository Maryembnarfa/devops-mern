import React, { useState } from 'react';
import { Button, Form, Input, Typography, message, Layout, Menu } from "antd";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import photo from '../assets/images/photo.webp';
import delivery from '../assets/images/delivery.png';
import TrackDelivery from './suiviCommande'; // Chemin relatif vers votre composant TrackDelivery
const { Link } = Typography;
const { Header } = Layout;

function Login() {
    const [form] = Form.useForm();
    const [showTrackDelivery, setShowTrackDelivery] = useState(false); // État pour basculer entre les vues
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: async (values) => {
            const response = await axiosInstance.post("/login", values);
            return response.data;
        },
        onSuccess: (data) => {
            const decodedToken = jwtDecode(data.token);
            console.log(decodedToken);

            localStorage.setItem("jwt", data.token);
            localStorage.setItem("userRole", decodedToken.role);

            const storedToken = localStorage.getItem("jwt");
            if (storedToken === data.token) {
                message.success("Token stored successfully. Redirecting...", 3);

                setTimeout(() => {
                    navigate("/dashboard");
                }, 1000);
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

    const handleMenuClick = (e) => {
        if (e.key === 'login') {
            setShowTrackDelivery(false); // Afficher le formulaire de login
        } else if (e.key === 'Tracking Ordres') {
            setShowTrackDelivery(true); // Afficher le suivi des commandes
        }
    };

    const menuItems = [
        { key: 'Tracking Ordres', label: 'Tracking Ordres' },
        { key: 'login', label: 'Login' },
    ];

    return (
        <div style={styles.container}>
            <div style={styles.leftColumn}>
                <img
                    src={photo}
                    alt="Delivery"
                    style={styles.image}
                />
            </div>

            <div style={styles.rightColumn}>
                <Header style={styles.header}>
                    <Menu
                        mode="horizontal"
                        onClick={handleMenuClick}
                        style={styles.navMenu}
                        items={menuItems}
                        overflowedIndicator={null}
                    />
                </Header>
                <div style={styles.formWrapper}>
                    {/* Ajoutez l'image ici */}
                    <img
                        src={delivery} // Chemin de l'image importée
                        alt="Company Logo" // Texte alternatif pour l'accessibilité
                        style={styles.logo} // Style pour l'image
                    />
                    {showTrackDelivery ? (
                        // Afficher le composant TrackDelivery
                        <TrackDelivery />
                    ) : (
                        // Afficher le formulaire de login
                        <>
                            <h1 style={styles.title}>Log in</h1>
                            <Form form={form} name="login" layout="vertical" onFinish={handleSubmit}
                                preserve={false}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Email or Phone"
                                    name={"username"}
                                    rules={[
                                        { required: true, message: "Please enter your email or phone number" },
                                        {
                                            pattern: /^([^\s@]+@[^\s@]+\.[^\s@]+|\d{8})$/,
                                            message: "Please enter a valid email or an 8-digit phone number"
                                        }
                                    ]}
                                    hasFeedback

                                >
                                    <Input className="custom-input" autoComplete="off" />
                                </Form.Item>
                                <Form.Item
                                    label="Password"
                                    name={"password"}
                                    rules={[{ required: true, message: "Please enter your password" }]}
                                    hasFeedback
                                >
                                    <Input.Password className="custom-input" autoComplete="new-password" />
                                </Form.Item>
                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    size="large"
                                    loading={isPending}
                                    style={styles.button}
                                >
                                    Log in
                                </Button>
                            </Form>
                        </>
                    )}
                </div>
            </div>
            <style>
                {`
                    .ant-input:focus,
                    .ant-input-focused,
                    .ant-input-affix-wrapper-focused {
                        border-color:rgb(189, 37, 27) !important;
                        box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2) !important;
                    }

                    .ant-input:hover,
                    .ant-input-affix-wrapper:hover {
                        border-color:rgb(189, 37, 27) !important;
                    }
                         .custom-input {
                            width: 100%;
                            padding: 8px;
                            font-size: 16px;
                             height: '80px';

                    }
          /* Style pour les éléments du menu */
                    .ant-menu-item {
                        color: #000000 !important;  /* Couleur par défaut */
                    }

                    /* Couleur au survol */
                    .ant-menu-item:hover {
                        color: rgb(189, 37, 27) !important;
                    }

                    /* Ligne rouge au survol */
                    .ant-menu-item:hover::after {
                        border-bottom: 2px solid rgb(189, 37, 27) !important;
                    }

                    /* Couleur rouge lorsque l'élément est sélectionné */
                    .ant-menu-item-selected {
                        color: rgb(189, 37, 27) !important;
                    }

                    /* Ligne rouge sous l'élément sélectionné */
                    .ant-menu-item-selected::after {
                        border-bottom: 2px solid rgb(189, 37, 27) !important;
                    }
                `}
            </style>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        height: '100vh',
    },
    leftColumn: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightColumn: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    formWrapper: {
        width: '600px',
        textAlign: 'center',
    },
    title: {
        fontSize: '19px',
        marginBottom: '20px',
    },
    button: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        marginTop: '20px',
        backgroundColor: "rgb(189, 37, 27)",
        borderColor: "rgb(189, 37, 27)"
    },
    signUpLink: {
        color: "rgb(189, 37, 27)",
    },
    input: {
        borderRadius: '4px',
    },
    signUpText: {
        marginTop: '20px',
        textAlign: 'center',
    },
    navMenu: {
        backgroundColor: 'transparent',
        borderBottom: 'none',
        lineHeight: '64px',
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
    },
    header: {
        backgroundColor: '#F7FAFC',
        padding: '0px 50px',
        width: '85%',
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        width: '200px', // Ajustez la largeur selon vos besoins
        height: 'auto', // Maintient le ratio de l'image
        marginBottom: '30px', // Espacement entre l'image et le titre
    },
};

export default Login;