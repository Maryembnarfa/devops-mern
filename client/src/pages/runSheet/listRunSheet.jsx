import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Select, Table, message, Button, Modal } from 'antd';
import { axiosInstance } from "../../lib/axios";
import AddRunSheet from "./addRunSheet";
const { Option } = Select;


const RunSheet = () => {
    const [open, setOpen] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openRetourD, setOpenRetourD] = useState(false); // État pour la modal RetourD
    const [openLivré, setOpenLivré] = useState(false); // État pour la modal Valider
    const [id, setId] = useState();
    const [selectedRunSheet, setSelectedRunSheet] = useState(null);
    const [selectedLivraisons, setSelectedLivraisons] = useState([]);
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
    // Filtrer les livraisons avec le statut "EnDepot"
    const livraisonsEnDepot = livraisons?.filter(livraison => livraison.status === "EnDepot") || [];
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



    // Fonction pour afficher la modal RetourD
    const handleRetourD = (record) => {
        setSelectedRunSheet(record); // Stocker les données de la RunSheet sélectionnée
        setOpenRetourD(true); // Ouvrir la modal RetourD
    };

    const handleValider = (record) => {
        setSelectedRunSheet(record); // Stocker les données de la RunSheet sélectionnée
        setOpenLivré(true); // Ouvrir la modal Valider
    };

    // Fonction pour mettre à jour le statut des livraisons sélectionnées
    const handleUpdateStatus = async (status) => {
        try {
            // Envoyer une requête pour mettre à jour le statut des livraisons sélectionnées
            await axiosInstance.put(`/runSheet/${selectedRunSheet._id}/updateStatus`, {
                livraisons: selectedLivraisons, // Les livraisons sélectionnées
                status: status // Nouveau statut (RetourE ou RetourD)
            });

            message.success(`Statut des livraisons mis à jour avec succès (${status})`);

            setOpenRetourD(false); // Fermer la modal RetourD
            setOpenLivré(false);// // Fermer la modal Valider
            queryClient.invalidateQueries(["runSheet"]); // Rafraîchir les données
        } catch (error) {
            message.error(`Erreur lors de la mise à jour du statut: ${error.message}`);
        }
    };

    const columns = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
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
                    <Button style={{ backgroundColor: '#ffbb96', borderColor: '#ffbb96', color: 'black' }}
                        onClick={() => handleRetourD(record)}>
                        RetourD
                    </Button>
                    <Button style={{ backgroundColor: '#d3adf7', borderColor: '#d3adf7', color: 'black' }}
                        onClick={() => handleValider(record)}>
                        Valider
                    </Button>
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
                pagination={{ pageSize: 5 }}
            />

            <AddRunSheet open={open} setOpen={setOpen} vehicles={vehicles} livreurs={livreurs} livraisons={livraisonsEnDepot} />

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
            {/* Modal pour RetourD */}
            <Modal
                open={openRetourD}
                onCancel={() => setOpenRetourD(false)}
                footer={[
                    <Button key="back" onClick={() => setOpenRetourD(false)}>
                        Annuler
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => handleUpdateStatus("RetourD")}>
                        Confirmer
                    </Button>
                ]}
            >
                {selectedRunSheet && (
                    <div>
                        <h3>Changer le statut des livraisons pour {selectedRunSheet.code}</h3>
                        <Select
                            mode="multiple" // Permettre la sélection multiple
                            placeholder="Sélectionnez les livraisons"
                            style={{ width: '100%' }}
                            onChange={(values) => setSelectedLivraisons(values)} // Stocker les livraisons sélectionnées
                        >
                            {selectedRunSheet.livraisons.map((livraison, index) => (
                                <Option key={index} value={livraison}>
                                    {livraison}
                                </Option>
                            ))}
                        </Select>
                    </div>
                )}
            </Modal>
            {/* Modal pour Valider */}
            <Modal
                open={openLivré}
                onCancel={() => setOpenLivré(false)}
                footer={[
                    <Button key="back" onClick={() => setOpenLivré(false)}>
                        Annuler
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => handleUpdateStatus("Livré")}>
                        Confirmer
                    </Button>
                ]}
            >
                {selectedRunSheet && (
                    <div>
                        <h3>Changer le statut des livraisons pour {selectedRunSheet.code}</h3>
                        <Select
                            mode="multiple" // Permettre la sélection multiple
                            placeholder="Sélectionnez les livraisons"
                            style={{ width: '100%' }}
                            onChange={(values) => setSelectedLivraisons(values)} // Stocker les livraisons sélectionnées
                        >
                            {selectedRunSheet.livraisons.map((livraison, index) => (
                                <Option key={index} value={livraison}>
                                    {livraison}
                                </Option>
                            ))}
                        </Select>
                    </div>
                )}
            </Modal>
        </div>
    );



};
export default RunSheet;



