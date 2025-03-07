import React from 'react';
import { Table, Tag, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../lib/axios';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Création des styles pour le PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 30
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center'
    },
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        marginBottom: 10
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#bfbfbf',
        borderBottomStyle: 'solid',
        alignItems: 'center'
    },
    tableHeader: {
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold'
    },
    tableCol: {
        width: '14.28%', // 7 colonnes = 100% / 7
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        padding: 5
    },
    tableCell: {
        margin: 5,
        fontSize: 10
    },
    statusCell: {
        margin: 5,
        fontSize: 10,
        color: 'orange'
    }
});

// Composant PDF pour le manifest
const DeliveryPDF = ({ deliveries }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>Manifest - Toutes les Livraisons</Text>

            <View style={styles.table}>
                {/* En-tête du tableau */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Code</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Client</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Adresse</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Gouvernement</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Téléphone</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Rue</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Status</Text>
                    </View>
                </View>

                {/* Lignes du tableau */}
                {deliveries.map((delivery) => (
                    <View key={delivery._id} style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{delivery.code}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{delivery.client_name}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{delivery.delivery_address}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{delivery.government}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{delivery.phone1}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{delivery.street}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.statusCell}>{delivery.status}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

const Manifest = () => {
    const { data: deliveries = [], isLoading } = useQuery({
        queryKey: ['delivery'],
        queryFn: async () => {
            const response = await axiosInstance.get('/delivry');
            return response.data;
        },
    });

    const renderStatus = (status) => <Tag color="orange">{status}</Tag>;

    const columns = [
        { title: 'Code', dataIndex: 'code', key: 'code' },
        { title: 'Client', dataIndex: 'client_name', key: 'client_name' },
        { title: 'Adresse', dataIndex: 'delivery_address', key: 'delivery_address' },
        { title: 'Gouvernement', dataIndex: 'government', key: 'government' },
        { title: 'Téléphone', dataIndex: 'phone1', key: 'phone1' },
        { title: 'Rue', dataIndex: 'street', key: 'street' },
        { title: 'Status', dataIndex: 'status', key: 'status', render: renderStatus },
    ];

    // Filtrage pour afficher uniquement les livraisons en attente dans le tableau
    const waitingDeliveries = deliveries.filter(d => d.status === 'EnAttente');

    if (isLoading) {
        return <p>Chargement des livraisons...</p>;
    }
    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3>Manifest - Livraisons En Attente</h3>
                <div>
                    <Button
                        type="default"
                        onClick={handlePrint}
                        style={{ marginRight: 16 }}
                    >
                        Imprimer
                    </Button>
                    {/* Bouton pour télécharger toutes les livraisons */}
                    <PDFDownloadLink
                        document={<DeliveryPDF deliveries={waitingDeliveries} />}
                        fileName="manifest-toutes-livraisons.pdf"
                    >
                        {({ blob, url, loading, error }) => (
                            <Button

                                icon={<DownloadOutlined />}
                                loading={loading}
                                disabled={loading || waitingDeliveries.length === 0}
                            >
                                Télécharger
                            </Button>
                        )}
                    </PDFDownloadLink>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={waitingDeliveries}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
};

export default Manifest;