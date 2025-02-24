import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Table, message, Button, Modal } from 'antd';
import { axiosInstance } from "../../lib/axios";
import AddVehicle from "./addVehicle";
import UpdateVehicle from './updateVehicle';


const Vehicle = () => {
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [id, setId] = useState();
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const queryClient = useQueryClient();

    // Récupérer les données des vehicles
    const { data, isLoading } = useQuery({
        queryKey: ["vehicle"],
        queryFn: async () => {
            const response = await axiosInstance.get("/vehicle");
            return response.data;
        },
        onError: (error) => {
            message.error('`Erreur lors du chargement des vehicules: ${error.message}`')
        },
    });
    // Mutation pour supprimer une vehicule
    const { mutate: deleteVehicle } = useMutation({
        mutationFn: async (id) => {
            const response = await axiosInstance.delete(`/vehicle/${id}`);
            return response.data;
        },
        onSuccess: () => {
            message.success("Vehicle supprimée avec succès");
            queryClient.invalidateQueries(["vehicle"]); // Rafraîchir les données
        },
        onError: (error) => {
            message.error(`Erreur lors de la suppression: ${error.message}`);
        },
    });
    // Fonction pour confirmer la suppression
    const showDeleteConfirm = (id) => {
        Modal.confirm({
            title: "Êtes-vous sûr de vouloir supprimer cette vehicule ?",
            okText: "Oui",
            okType: "danger",
            cancelText: "Non",
            onOk() {
                deleteVehicle(id); // Appeler la mutation de suppression
            },
        });
    };
    // Fonction pour afficher les détails d'une livraison
    const handleViewVehicle = (record) => {
        setSelectedVehicle(record); // Stocker les données de la livraison sélectionnée
        setOpenView(true); // Ouvrir la modal
    };
    const columns = [
        {
            title: 'Serie',
            dataIndex: 'serie',
            key: 'serie',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <EyeOutlined
                        style={{ fontSize: '18px', cursor: 'pointer' }}
                        onClick={() => handleViewVehicle(record)} // Fonction d'affichage
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
                    Add Vehicle
                </Button>
            </div>


            <Table
                dataSource={data}
                columns={columns}
                rowKey="_id"
                loading={isLoading}
            />

            <AddVehicle open={open} setOpen={setOpen} />
            <UpdateVehicle openUpdate={openUpdate} setOpenUpdate={setOpenUpdate} id={id} />

            <Modal
                open={openView}
                onCancel={() => setOpenView(false)}
                footer={null} // Pas de boutons dans le footer
            >
                {selectedVehicle && (
                    <div>
                        <p><strong>Serie:</strong> {selectedVehicle.serie}</p>
                    </div>
                )}
            </Modal>
        </div>
    );



};
export default Vehicle;