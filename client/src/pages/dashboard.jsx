// Dashboard.js
import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    DashboardOutlined,
    CarOutlined,
    ShoppingCartOutlined,
    FileDoneOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import Users from '../pages/users';
import Delivery from './dilevery/listDilevery';
import deliveryImage from '../assets/images/delivery.png';
import DeliveryPieChart from '../pages/charts';
import Vehicle from './vehicle/listVehicle';
import RunSheet from './runSheet/listRunSheet';
import TrackDelivery from './suiviCommande';
const { Header, Sider, Content } = Layout;

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('1');
    const [currentComponent, setCurrentComponent] = useState();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Configuration des composants pour chaque menu item
    const menuComponents = {
        '1': <DeliveryPieChart />,
        '2': <Users />,
        '3': <Delivery />,
        '4': <Vehicle />,
        '5': <RunSheet />,
        '6': <TrackDelivery />,

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
            icon: <ShoppingCartOutlined />,  // Icône de livraison
            label: 'Delivery'
        },
        {
            key: '4',
            icon: <CarOutlined />,  // Garde l'icône de voiture pour les véhicules
            label: 'Vehicle'
        },
        {
            key: '5',
            icon: <FileDoneOutlined />,  // Icône de document/feuille pour RunSheet
            label: 'RunSheet'
        },
        {
            key: '6',
            icon: <FileDoneOutlined />,  // Icône de document/feuille pour RunSheet
            label: 'SuiviCommande'
        }
    ];

    // Handle menu item click
    const handleMenuClick = ({ key }) => {
        setSelectedKey(key);
        setCurrentComponent(menuComponents[key]);
    };

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
                        position: 'fixed', // Fixe le menu sur le côté gauche
                        height: '100vh', // Assure que le Sider prend toute la hauteur de l'écran
                        left: 0, // Positionne le menu à gauche
                        top: 0, // Positionne en haut
                        zIndex: 1000, // Assure qu'il reste au-dessus des autres éléments
                        background: '#001529', // Couleur de fond du menu (par défaut pour thème sombre)
                    }}
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
                        marginLeft: collapsed ? '80px' : '200px', // Laisse de la place pour le Sider
                        transition: 'margin-left 0.2s', // Ajoute une animation fluide lors de la réduction du Sider
                    }}
                >
                    <Header
                        style={{
                            padding: 0,
                            background: colorBgContainer,
                            position: 'fixed', // Fixe le header en haut
                            width: collapsed ? 'calc(100% - 80px)' : 'calc(100% - 200px)', // Ajuste la largeur selon l'état du Sider
                            zIndex: 900, // Assure qu'il reste au-dessus du contenu mais derrière le Sider
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
                            marginTop: '64px', // Laisse de la place pour le header
                            padding: 24,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            overflow: 'auto', // Permet de scroller le contenu si nécessaire
                            minHeight: '100vh', // S'assure que le contenu prend toute la hauteur
                        }}
                    >
                        {currentComponent}
                    </Content>
                </Layout>

            </Layout>
        </>
    );
};

export default Dashboard;