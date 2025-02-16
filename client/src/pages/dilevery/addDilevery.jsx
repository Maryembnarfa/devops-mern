import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, Form, Input, message } from "antd";
import React from "react";
import { axiosInstance } from "../../lib/axios";

export default function AddDilevery({ open, setOpen }) {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async (values) => {
            const response = await axiosInstance.post("/delivry", values)
            return response.data
        },
        onSuccess: (data) => {
            message.success("success")
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ["delivery"] })
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
            <Form form={form} name="add delivery">
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
                <Form.Item label="Street" name="street" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Statut" name="status" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>


            </Form>
        </Modal>
    );
}
