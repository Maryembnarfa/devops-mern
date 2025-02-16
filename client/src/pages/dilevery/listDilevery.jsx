import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Table, message, Button, Modal, Select, Tag } from 'antd';
import { axiosInstance } from '../../lib/axios';
import AddDilevery from './addDilevery';
import UpdateDelivery from './updateDelivery';
const { Option } = Select;
const Delivery = () => {
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [id, setId] = useState();
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const queryClient = useQueryClient();

    // Récupérer les données des livraisons
    const { data, isLoading } = useQuery({
        queryKey: ["delivery"],
        queryFn: async () => {
            const response = await axiosInstance.get("/delivry");
            return response.data;
        },
        onError: (error) => {
            message.error(`Erreur lors du chargement des livraisons: ${error.message}`);
        },
    });

    // Mutation pour supprimer une livraison
    const { mutate: deleteDelivery } = useMutation({
        mutationFn: async (id) => {
            const response = await axiosInstance.delete(`/delivry/${id}`);
            return response.data;
        },
        onSuccess: () => {
            message.success("Livraison supprimée avec succès");
            queryClient.invalidateQueries(["delivery"]); // Rafraîchir les données
        },
        onError: (error) => {
            message.error(`Erreur lors de la suppression: ${error.message}`);
        },
    });

    // Fonction pour confirmer la suppression
    const showDeleteConfirm = (id) => {
        Modal.confirm({
            title: "Êtes-vous sûr de vouloir supprimer cette livraison ?",
            okText: "Oui",
            okType: "danger",
            cancelText: "Non",
            onOk() {
                deleteDelivery(id); // Appeler la mutation de suppression
            },
        });
    };

    // Fonction pour afficher les détails d'une livraison
    const handleViewDelivery = (record) => {
        setSelectedDelivery(record); // Stocker les données de la livraison sélectionnée
        setOpenView(true); // Ouvrir la modal
    };
    // Mutation pour mettre à jour le statut
    const { mutate: updateStatus } = useMutation({
        mutationFn: async ({ id, status }) => {
            const response = await axiosInstance.patch(`/delivry/${id}/status`, { status });

            return response.data;
        },
        onSuccess: () => {
            message.success("Statut mis à jour avec succès");
            queryClient.invalidateQueries(["delivery"]); // Rafraîchir les données
        },
        onError: (error) => {
            message.error(`Erreur lors de la mise à jour du statut: ${error.message}`);
        },
    });
    // Fonction pour gérer le changement de statut
    const handleStatusChange = (value, record) => {
        updateStatus({ id: record._id, status: value });
    };

    const columns = [
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
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => (
                <Select
                    defaultValue={text}
                    style={{ width: 110 }}
                    onChange={(value) => handleStatusChange(value, record)}
                >
                    <Option value="EnCours">
                        <Tag color="yellow">EnCours</Tag>
                    </Option>
                    <Option value="Livré">
                        <Tag color="green">Livré</Tag>
                    </Option>
                    <Option value="EnRetour">
                        <Tag color="red">EnRetour</Tag>
                    </Option>
                </Select>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <EyeOutlined
                        style={{ fontSize: '18px', cursor: 'pointer' }}
                        onClick={() => handleViewDelivery(record)} // Fonction d'affichage
                    />
                    <EditOutlined
                        style={{ fontSize: '18px', cursor: 'pointer' }}
                        onClick={() => {
                            setOpenUpdate(true); // Ouvrir la modal de mise à jour
                            setId(record._id); // Définir l'ID de l'élément à mettre à jour
                        }}
                    />
                    <DeleteOutlined
                        style={{ fontSize: '18px', cursor: 'pointer' }}
                        onClick={() => showDeleteConfirm(record._id)} // Fonction de suppression
                    />
                </div>
            ),
        },
    ];

    return (
        <div>


            {/* Conteneur du bouton */}
            <div style={{ marginBottom: "20px", textAlign: "right" }}>
                <Button
                    type="primary"
                    onClick={() => setOpen(true)}
                    style={{
                        padding: "10px 20px",
                        fontSize: "15px",
                        height: "40px",
                        width: "160px",
                        backgroundColor: "rgb(189, 37, 27)",
                        borderColor: "rgb(189, 37, 27)"
                    }}
                >
                    Add Delivery
                </Button>
            </div>


            <Table
                dataSource={data}
                columns={columns}
                rowKey="_id"
                loading={isLoading}
            />

            <AddDilevery open={open} setOpen={setOpen} />
            <UpdateDelivery openUpdate={openUpdate} setOpenUpdate={setOpenUpdate} id={id} />

            <Modal
                open={openView}
                onCancel={() => setOpenView(false)}
                footer={null} // Pas de boutons dans le footer
            >
                {selectedDelivery && (
                    <div>
                        <p><strong>Client:</strong> {selectedDelivery.client_name}</p>
                        <p><strong>Adresse:</strong> {selectedDelivery.delivery_address}</p>
                        <p><strong>Gouvernement:</strong> {selectedDelivery.government}</p>
                        <p><strong>Rue:</strong> {selectedDelivery.street}</p>
                        <p><strong>Téléphone:</strong> {selectedDelivery.phone1}</p>
                        <p><strong>Statut:</strong> {selectedDelivery.status}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Delivery;