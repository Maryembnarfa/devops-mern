import React from 'react';
import { Form, Input, Modal, Button, message } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";

export default function UpdateDelivery({ openUpdate, setOpenUpdate, id }) {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    // Requête pour récupérer les données du produit
    const { data, isLoading } = useQuery({
        queryKey: ["delivry", id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/delivry/${id}`);
            form.setFieldsValue(response.data); // Pré-remplir le formulaire
            return response.data;
        },
        enabled: !!id, // N'exécute la requête que si un ID est défini
    });

    // Mutation pour mettre à jour les données
    const mutation = useMutation({
        mutationFn: async (values) => {
            return await axiosInstance.put(`/delivry/${id}`, values);
        },
        onSuccess: () => {
            message.success("Livraison mis à jour avec succès !");
            queryClient.invalidateQueries(["delivry"]); // Invalider le cache pour recharger les données
            setOpenUpdate(false); // Fermer le modal
        },
        onError: () => {
            message.error("Échec de la mise à jour du livraison !");
        },
    });

    // Soumettre les données mises à jour
    const handleUpdate = async () => {
        try {
            const values = await form.validateFields(); // Valider les champs du formulaire
            mutation.mutate(values); // Appeler la mutation
        } catch (error) {
            console.log("Validation failed:", error);
        }
    };

    return (
        <Modal
            open={openUpdate}
            onCancel={() => {
                setOpenUpdate(false);
                form.resetFields(); // Réinitialiser le formulaire
            }}
            onOk={() => form.submit()} // Soumettre le formulaire lors du clic sur OK
            confirmLoading={isLoading || mutation.isLoading} // Afficher un indicateur de chargement
        >
            <Form
                form={form}
                name="update delivery"
                onFinish={handleUpdate} // Déclencher handleSubmit à la soumission
            >
                <Form.Item label="Client" name="client_name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Adresse" name="delivery_address" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Gouvernement" name="government" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Phone" name="phone1" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Strret" name="street" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Statut" name="status" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>



            </Form>
        </Modal>
    );
}