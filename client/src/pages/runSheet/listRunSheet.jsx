import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Table, message, Button, Modal } from 'antd';
import { axiosInstance } from "../../lib/axios";
import AddRunSheet from "./addRunSheet";



const RunSheet = () => {
    const [open, setOpen] = useState(false);
    const [openView, setOpenView] = useState(false);

    const [id, setId] = useState();
    const [selectedRunSheet, setSelectedRunSheet] = useState(null);
    const queryClient = useQueryClient();

    // Récupérer les données des vehicles
    const { data, isLoading } = useQuery({
        queryKey: ["runSheet"],
        queryFn: async () => {
            const response = await axiosInstance.get("/runSheet");
            return response.data;
        },
        onError: (error) => {
            message.error('`Erreur lors du chargement des runSheet: ${error.message}`')
        },
    });
    // Mutation pour supprimer une vehicule
    const { mutate: deleteRunSheet } = useMutation({
        mutationFn: async (id) => {
            console.log("Attempting to delete runSheet with ID:", id);
            const response = await axiosInstance.delete(`/runSheet/${id}`);
            return response.data;
        },
        onSuccess: () => {
            message.success("runSheet supprimée avec succès");
            queryClient.invalidateQueries(["runSheet"]); // Rafraîchir les données
        },
        onError: (error) => {
            message.error(`Erreur lors de la suppression: ${error.message}`);
        },
    });
    // Fonction pour confirmer la suppression
    const showDeleteConfirm = (id) => {
        Modal.confirm({
            title: "Êtes-vous sûr de vouloir supprimer cette runsheet ?",
            okText: "Oui",
            okType: "danger",
            cancelText: "Non",
            onOk() {
                deleteRunSheet(id); // Appeler la mutation de suppression
            },
        });
    };
    // Fonction pour afficher les détails d'une livraison
    const handleViewRunSheet = (record) => {
        setSelectedRunSheet(record); // Stocker les données de la livraison sélectionnée
        setOpenView(true); // Ouvrir la modal
    };
    // Récupérer les données des véhicules

    const { data: vehicles, isLoading: isVehiclesLoading } = useQuery({
        queryKey: ["vehicle"],
        queryFn: async () => {
            const response = await axiosInstance.get("/vehicle");
            console.log('Vehicles loaded:', response.data); // Add this line to debug
            return response.data;
        },
        onError: (error) => {
            message.error(`Erreur lors du chargement des véhicules: ${error.message}`);
        },
    });
    // Récupérer les données des livraisons
    const { data: livraisons, isLoading: isLivraisonsLoading } = useQuery({
        queryKey: ["livraisons"],
        queryFn: async () => {
            const response = await axiosInstance.get("/delivry");
            return response.data;
        },
        onError: (error) => {
            message.error(`Erreur lors du chargement des livraisons: ${error.message}`);
        },
    });
    // Filtrer les livraisons avec le statut "EnAttente"
    const livraisonsEnAttente = livraisons?.filter(livraison => livraison.status === "EnDepot") || [];
    // Récupérer les données des users
    const { data: users, isLoading: isUsersLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await axiosInstance.get("/users");
            console.log('Users loaded:', response.data); // Pour débugger
            return response.data;
        },
        onError: (error) => {
            message.error(`Erreur lors du chargement des utilisateurs: ${error.message}`);
        },
    });

    // Filtrer les utilisateurs pour n'avoir que les livreurs
    const livreurs = users?.filter(user => user.role === "LIVREUR") || [];


    const columns = [
        {
            title: 'Serie',
            dataIndex: 'serie',
            key: 'serie',
        },
        {
            title: 'Livreur',
            dataIndex: 'name_livreur',
            key: 'name_livreur',
        },
        {
            title: 'Livraisons',
            dataIndex: 'livraisons',
            key: 'Livraisons',
            render: (livraisons) => Array.isArray(livraisons) ? livraisons.join(', ') : livraisons

        },

        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <EyeOutlined
                        style={{ fontSize: '18px', cursor: 'pointer' }}
                        onClick={() => handleViewRunSheet(record)} // Fonction d'affichage
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
                    Add RunSheet
                </Button>
            </div>


            <Table
                dataSource={data}
                columns={columns}
                rowKey="_id"
                loading={isLoading}
            />

            <AddRunSheet open={open} setOpen={setOpen} vehicles={vehicles} livreurs={livreurs} livraisons={livraisonsEnAttente} />

            <Modal
                open={openView}
                onCancel={() => setOpenView(false)}
                footer={null} // Pas de boutons dans le footer
            >
                {selectedRunSheet && (
                    <div>
                        <p><strong>Serie:</strong> {selectedRunSheet.serie}</p>
                        <p><strong>Livreur:</strong> {selectedRunSheet.name_livreur}</p>
                        <p><strong>Livraisons:</strong> {selectedRunSheet.livraisons.join(", ")}</p>



                    </div>

                )}
            </Modal>
        </div>
    );



};
export default RunSheet;



