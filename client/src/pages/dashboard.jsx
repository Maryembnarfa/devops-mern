import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    DashboardOutlined,
    CarOutlined,
    ShoppingCartOutlined,
    FileDoneOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Row, Col, Card, Table, Tag } from 'antd';
import Users from '../pages/users';
import Delivery from './dilevery/listDilevery';
import deliveryImage from '../assets/images/delivery.png';
import DeliveryPieChart from '../pages/charts';
import Vehicle from './vehicle/listVehicle';
import RunSheet from './runSheet/listRunSheet';
import TrackDelivery from './suiviCommande';
import Manifest from './dilevery/listManifest';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';

const { Header, Sider, Content } = Layout;

// Composant pour afficher le tableau des livraisons
const DeliveryTable = ({ deliveries, selectedStatus }) => {
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
            case 'RetourE':
                color = 'red';
                break;
            case 'RetourD':
                color = 'cyan';
                break;
            case 'Livré':
                color = 'purple';
                break;
            default:
                color = 'gray';
        }
        return <Tag color={color}>{status}</Tag>;
    };

    const columns = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Client',
            dataIndex: 'client_name',
            key: 'client_name',
        },
        {
            title: 'Adresse',
            dataIndex: 'delivery_address',
            key: 'delivery_address',
        },
        {
            title: 'Gouvernement',
            dataIndex: 'government',
            key: 'government',
        },
        {
            title: 'Téléphone',
            dataIndex: 'phone1',
            key: 'phone1',
        },
        {
            title: 'Rue',
            dataIndex: 'street',
            key: 'street',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text) => renderStatus(text),
        },
    ];

    return (
        <div style={{ marginTop: 20 }}>
            <h3>Livraisons - {selectedStatus}</h3>
            <Table
                columns={columns}
                dataSource={deliveries.filter(d => d.status === selectedStatus)}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
};

// Composant pour les cartes de statut
const DashboardCards = ({ onStatusClick }) => {
    const { data: deliveries = [] } = useQuery({
        queryKey: ["delivery"],
        queryFn: async () => {
            const response = await axiosInstance.get("/delivry");
            return response.data;
        },
    });

    const countByStatus = {
        EnAttente: deliveries.filter(d => d.status === 'EnAttente').length,
        EnDepot: deliveries.filter(d => d.status === 'EnDepot').length,
        EnCours: deliveries.filter(d => d.status === 'EnCours').length,
        RetourE: deliveries.filter(d => d.status === 'RetourE').length,
        RetourD: deliveries.filter(d => d.status === 'RetourD').length,
        Livré: deliveries.filter(d => d.status === 'Livré').length,
    };

    return (
        <Row style={{ marginBottom: 24 }} gutter={[16, 16]}>
            <Col span={8} style={{ marginBottom: 8 }}>
                <Card
                    style={{
                        width: '95%',
                        height: '85px',
                        backgroundColor: '#ffd591',
                        color: '#000',
                        margin: 0,
                        cursor: 'pointer',
                    }}
                    onClick={() => onStatusClick('EnAttente')}
                >
                    <p style={{ margin: 0, fontWeight: 'bold' }}>En Attente</p>
                    <p style={{ margin: 0 }}>{countByStatus.EnAttente}</p>
                </Card>
            </Col>
            <Col span={8} style={{ marginBottom: 8 }}>
                <Card
                    style={{
                        width: '95%',
                        height: '85px',
                        backgroundColor: '#91caff',
                        color: '#000',
                        margin: 0,
                        cursor: 'pointer',
                    }}
                    onClick={() => onStatusClick('EnDepot')}
                >
                    <p style={{ margin: 0, fontWeight: 'bold' }}>En Dépôt</p>
                    <p style={{ margin: 0 }}>{countByStatus.EnDepot}</p>
                </Card>
            </Col>
            <Col span={8} style={{ marginBottom: 8 }}>
                <Card
                    style={{
                        width: '95%',
                        height: '85px',
                        backgroundColor: '#b7eb8f',
                        color: '#000',
                        margin: 0,
                        cursor: 'pointer',
                    }}
                    onClick={() => onStatusClick('EnCours')}
                >
                    <p style={{ margin: 0, fontWeight: 'bold' }}>En Cours</p>
                    <p style={{ margin: 0 }}>{countByStatus.EnCours}</p>
                </Card>
            </Col>
            <Col span={8} style={{ marginBottom: 8 }}>
                <Card
                    style={{
                        width: '95%',
                        height: '85px',
                        backgroundColor: "#ffa39e",
                        color: '#000',
                        margin: 0,
                        cursor: 'pointer',
                    }}
                    onClick={() => onStatusClick('RetourE')}
                >
                    <p style={{ margin: 0, fontWeight: 'bold' }}>RetourE</p>
                    <p style={{ margin: 0 }}>{countByStatus.RetourE}</p>
                </Card>
            </Col>
            <Col span={8} style={{ marginBottom: 8 }}>
                <Card
                    style={{
                        width: '95%',
                        height: '85px',
                        backgroundColor: "#ffbb96",
                        color: '#000',
                        margin: 0,
                        cursor: 'pointer',
                    }}
                    onClick={() => onStatusClick('RetourD')}
                >
                    <p style={{ margin: 0, fontWeight: 'bold' }}>RetourD</p>
                    <p style={{ margin: 0 }}>{countByStatus.RetourD}</p>
                </Card>
            </Col>
            <Col span={8} style={{ marginBottom: 8 }}>
                <Card
                    style={{
                        width: '95%',
                        height: '85px',
                        backgroundColor: "#d3adf7",
                        color: '#000',
                        margin: 0,
                        cursor: 'pointer',
                    }}
                    onClick={() => onStatusClick('Livré')}
                >
                    <p style={{ margin: 0, fontWeight: 'bold' }}>Livré</p>
                    <p style={{ margin: 0 }}>{countByStatus.Livré}</p>
                </Card>
            </Col>
        </Row>
    );
};

// Composant pour le tableau de bord (cartes + graphique)
const DashboardContent = ({ onStatusClick }) => (
    <>
        <DashboardCards onStatusClick={onStatusClick} />
        <DeliveryPieChart />
    </>
);

// Composant principal Dashboard
const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('1');
    const [selectedStatus, setSelectedStatus] = useState(null); // État pour le statut sélectionné
    const [currentComponent, setCurrentComponent] = useState(<DashboardContent onStatusClick={setSelectedStatus} />);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const { data: deliveries = [] } = useQuery({
        queryKey: ["delivery"],
        queryFn: async () => {
            const response = await axiosInstance.get("/delivry");
            return response.data;
        },
    });

    // Configuration des composants pour chaque menu item
    const menuComponents = {
        '1': <DashboardContent onStatusClick={setSelectedStatus} />,
        '2': <Users />,
        '3': <Delivery />,
        '4': <Vehicle />,
        '5': <RunSheet />,
        '6': <TrackDelivery />,
    };

    // Handle menu item click
    const handleMenuClick = ({ key }) => {
        setSelectedKey(key); // Réinitialise le statut sélectionné
        setSelectedStatus(null);

        if (key === '3') {
            // Si "Delivery" est cliqué, afficher la liste des livraisons
            setCurrentComponent(<Delivery />);
        } else if (key === '3-1') {
            // Si "Manifest" est cliqué, afficher le manifest
            setCurrentComponent(<Manifest />);
        } else {
            // Afficher l'autre composant selon le menu sélectionné
            setCurrentComponent(menuComponents[key]);
        }
    };



    // Menu items configuration
    const menuItems = [
        {
            key: '1',
            icon: <DashboardOutlined />,
            label: 'Dashboard'
        },
        {
            key: '2',
            icon: <UserOutlined />,
            label: 'Users'
        },
        {
            key: '3',
            icon: <ShoppingCartOutlined />,
            label: 'Delivery',
            children: [
                {
                    key: '3-1',
                    icon: <AppstoreOutlined />,
                    label: 'Manifest'
                }
            ],
            onTitleClick: () => handleMenuClick({ key: '3' }) // Déclenche un clic manuel
        },
        {
            key: '4',
            icon: <CarOutlined />,
            label: 'Vehicle'
        },
        {
            key: '5',
            icon: <FileDoneOutlined />,
            label: 'RunSheet'
        },
        {
            key: '6',
            icon: <FileDoneOutlined />,
            label: 'SuiviCommande'
        }
    ];

    return (
        <>
            <style>
                {`
          .ant-menu-dark .ant-menu-item {
            color: #ffffff;
          }
          .ant-menu-dark .ant-menu-item:hover {
            color: #ffffff;
          }
          .ant-menu-item-selected {
            background-color: rgb(189, 37, 27) !important;
          }
        `}
            </style>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    style={{
                        position: 'fixed',
                        height: '100vh',
                        left: 0,
                        top: 0,
                        zIndex: 1000,
                        background: '#001529',

                    }}
                    width={250}
                >
                    <div className="logo">
                        <img
                            src={deliveryImage}
                            alt="Delivery"
                            style={{
                                width: '100%',
                                padding: '10px',
                            }}
                        />
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[selectedKey]}
                        onClick={handleMenuClick}
                        items={menuItems}
                    />
                </Sider>
                <Layout
                    style={{
                        marginLeft: collapsed ? '100px' : '250px', // Ajuster en fonction de la largeur du Sider
                        transition: 'margin-left 0.2s',
                    }}
                >
                    <Header
                        style={{
                            padding: 0,
                            background: colorBgContainer,
                            position: 'fixed',
                            width: collapsed ? 'calc(100% - 100px)' : 'calc(100% - 250px)', // Ajuster en fonction de la largeur du Side
                            zIndex: 900,
                        }}
                    >
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                    </Header>
                    <Content
                        style={{
                            marginTop: '64px',
                            padding: 24,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            overflow: 'auto',
                            minHeight: '100vh',
                        }}
                    >
                        {selectedStatus ? (
                            <DeliveryTable deliveries={deliveries} selectedStatus={selectedStatus} />
                        ) : (
                            currentComponent
                        )}
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default Dashboard;