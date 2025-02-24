import React, { useState } from 'react';
import { Button, Input, message, Card, Typography, Row, Col, Tag, Form } from 'antd';
import { axiosInstance } from '../lib/axios';

const { Title, Text } = Typography;

const TrackDelivery = () => {
    const [delivery, setDelivery] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm(); // Utilisation de Form d'Ant Design

    const handleTrack = async (values) => {
        const { code } = values; // Récupérer la valeur du champ "code" depuis les valeurs du formulaire

        setLoading(true);
        try {
            const response = await axiosInstance.get(`/delivry/track/${code}`);
            setDelivery(response.data.delivery);
            message.success("Commande trouvée !");
        } catch (error) {
            message.error("Commande non trouvée ou erreur serveur.");
            setDelivery(null);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour afficher le statut avec un style personnalisé
    const renderStatus = (status) => {
        let color = 'default';
        switch (status) {
            case 'EnAttente':
                color = 'orange';
                break;
            case 'EnDepot':
                color = 'blue';
                break;
            case 'EnCours':
                color = 'green';
                break;
            case 'Livree':
                color = 'purple';
                break;
            default:
                color = 'gray';
        }
        return <Tag color={color}>{status}</Tag>;
    };

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            {/* Ajoutez la balise <style> ici */}
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
                        border-color: rgb(189, 37, 27) !important;
                    }
                `}
            </style>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
                Suivez votre commande
            </Title>

            <Row justify="center" style={{ marginBottom: '30px' }}>
                <Col span={24} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Formulaire avec Form et Form.Item */}
                    <Form
                        form={form}
                        onFinish={handleTrack} // Soumission du formulaire
                        style={{ width: '100%', maxWidth: '500px' }}
                    >

                        {/* Champ de saisie */}
                        <Form.Item
                            name="code"
                            label="Numéro de suivi de votre commande"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Veuillez entrer un code de commande.',
                                },
                            ]}
                            style={{ display: 'block', marginBottom: '24px', textAlign: 'left' }}
                        >
                            <Input
                                placeholder="Exemple : 123456789"
                                style={{ width: '100%', height: '40px' }}
                            />
                        </Form.Item>

                        {/* Bouton Confirmer */}
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit" // Soumission du formulaire
                                loading={loading}
                                style={{
                                    width: '100%', height: '40px', backgroundColor: "rgb(189, 37, 27)",
                                    borderColor: "rgb(189, 37, 27)"
                                }}
                            >
                                Confirmer
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

            {delivery && (
                <Card
                    title="Détails de la commande"
                    style={{ marginTop: '20px', width: '100%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                >
                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <Text strong>Code:</Text>
                        </Col>
                        <Col span={16}>
                            <Text>{delivery.code}</Text>
                        </Col>

                        <Col span={8}>
                            <Text strong>Client:</Text>
                        </Col>
                        <Col span={16}>
                            <Text>{delivery.client_name}</Text>
                        </Col>

                        <Col span={8}>
                            <Text strong>Statut:</Text>
                        </Col>
                        <Col span={16}>
                            {renderStatus(delivery.status)}
                        </Col>
                    </Row>
                </Card>
            )}
        </div>
    );
};

export default TrackDelivery;