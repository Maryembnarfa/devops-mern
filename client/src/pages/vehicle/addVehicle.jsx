import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, Form, Input, message } from "antd";
import React from "react";
import { axiosInstance } from "../../lib/axios";

export default function AddVehicle({ open, setOpen }) {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async (values) => {
            const response = await axiosInstance.post("/vehicles", values)
            return response.data
        },
        onSuccess: (data) => {
            message.success("success")
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ["vehicle"] })
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
            <Form form={form} name="add vehicle">
                <Form.Item label="Serie" name="serie" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>


            </Form>
        </Modal>
    );
}
