import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, Form, Input, message, Select } from "antd";
import React from "react";
import { axiosInstance } from "../../lib/axios";

export default function AddRunSheet({ open, setOpen, vehicles, livreurs, livraisons }) {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async (values) => {
            const response = await axiosInstance.post("/runSheet", values)
            return response.data
        },
        onSuccess: (data) => {
            message.success("success")
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ["runSheet"] })
        },
        onError: (err) => {
            console.log(err)
        }
    })

    const handleSubmit = (values) => {
        mutate(values);
    };

    return (
        <Modal
            open={open}
            loading={isPending}
            onCancel={() => {
                setOpen(false)
                form.resetFields()
            }}
            onOk={() => form.validateFields().then((values) => handleSubmit(values)).catch(() => console.log("error"))}
        >
            <Form form={form} name="add runSheet">
                <Form.Item label="Serie" name="serie" rules={[{ required: true }]}>
                    <Select placeholder="Sélectionnez une série">
                        {vehicles?.map(vehicle => (
                            <Select.Option key={vehicle._id} value={vehicle.serie}>
                                {vehicle.serie}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Livreur" name="name_livreur" rules={[{ required: true }]}>
                    <Select
                        placeholder="Sélectionnez un livreur"
                        loading={!livreurs}
                    >
                        {livreurs?.map(livreur => (
                            <Select.Option key={livreur._id} value={livreur.name}>
                                {livreur.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Livraisons" name="livraisons" rules={[{ required: true }]}>
                    <Select
                        mode="multiple" // Permet la sélection multiple
                        placeholder="Sélectionnez les livraisons"
                        loading={!livraisons}
                    >
                        {livraisons?.map(livraison => (
                            <Select.Option key={livraison._id} value={livraison.code}>
                                {livraison.code}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>



            </Form>
        </Modal>
    );
}
