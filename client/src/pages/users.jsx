import React, { useState, useEffect } from 'react';
import { Table, message, Button, Modal, Form, Input, Select, Row, Col } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from "../lib/axios";
import { Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const colorPalette = ['#d46b08', '#ad2102', '#a8071a', '#3f6600', '#876800', '#874d00'];

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchRole, setSearchRole] = useState(""); // Pour la recherche par rôle
    const [filteredUsers, setFilteredUsers] = useState([]); // Liste filtrée d'après la recherche
    const [form] = Form.useForm();

    // Mutation pour récupérer les utilisateurs
    const { mutate, isLoading, isError, error } = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.get('/users');
            return response.data;
        },
        onSuccess: (data) => {
            setUsers(data);
            message.success("Users loaded successfully");
        },
        onError: (error) => {
            message.error("Error loading users: " + error.message);
        },
    });

    useEffect(() => {
        mutate();
    }, [mutate]);

    // Fonction de suppression
    const handleDeleteUser = async (userId) => {

        try {
            await axiosInstance.delete(`/users/${userId}`);
            message.success("User deleted successfully");

            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        } catch (error) {
            message.error("Error deleting user: " + error.message);
        }
    };

    const showDeleteConfirm = (userId) => {
        confirm({
            title: 'Are you sure you want to delete this user?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                handleDeleteUser(userId);
            },
            onCancel() {
                message.info("User deletion cancelled");
            },
        });
    };

    // Fonction pour afficher le formulaire de mise à jour
    const handleUpdateUser = (user) => {
        setSelectedUser(user); // Sauvegarder l'utilisateur sélectionné
        form.setFieldsValue(user); // Pré-remplir le formulaire avec les données de l'utilisateur
        setIsUpdateModalOpen(true); // Ouvrir le modal de mise à jour
    };

    // Fonction pour gérer la soumission du formulaire de mise à jour
    const handleUpdateSubmit = async (values) => {


        try {
            await axiosInstance.put(`/users/${selectedUser._id}`, values);
            message.success("User updated successfully");
            mutate(); // Rafraîchir la liste des utilisateurs
            setIsUpdateModalOpen(false); // Fermer le modal de mise à jour
            form.resetFields(); // Réinitialiser les champs du formulaire
        } catch (error) {
            message.error("Error updating user: " + error.message);
        }
    };

    // Fonction pour gérer la soumission du formulaire d'ajout
    const handleAddUser = async (values) => {



        try {
            await axiosInstance.post('/user', values);
            message.success("User added successfully");
            mutate(); // Rafraîchir la liste des utilisateurs
            setIsModalOpen(false); // Fermer le modal d'ajout
            form.resetFields(); // Réinitialiser les champs du formulaire
        } catch (error) {
            message.error("Error adding user: " + error.message);
        }
    };
    // Ajoutez cette fonction dans votre composant Users
    const checkEmailExists = async (username) => {
        const token = localStorage.getItem('jwt');
        try {
            // Vérifier dans la liste des utilisateurs existants
            const existingUser = users.find(user => user.username.toLowerCase() === username.toLowerCase());
            return !!existingUser;
        } catch (error) {
            console.error("Error checking email:", error);
            return false;
        }
    };


    // Fonction pour gérer la recherche et filtrer les utilisateurs
    const handleSearch = (value) => {
        setSearchTerm(value); // Mettre à jour le terme de recherche
        if (!value) {
            setFilteredUsers([]); // Si le champ est vide, afficher tous les utilisateurs
        } else {
            // Filtrer les utilisateurs dont le nom commence par la recherche
            const filtered = users.filter(user => user.name.toLowerCase().startsWith(value.toLowerCase()));
            setFilteredUsers(filtered); // Appliquer le filtrage
        }
    };
    // Fonction pour gérer la recherche et filtrer les utilisateurs par rôle
    const handleSearchByRole = (value) => {
        setSearchRole(value); // Mettre à jour le terme de recherche par rôle
        if (!value) {
            setFilteredUsers([]); // Si le champ est vide, réinitialiser la liste filtrée à vide
        } else {
            // Filtrer les utilisateurs dont le rôle correspond à la recherche
            const filtered = users.filter(user => user.role.toLowerCase().startsWith(value.toLowerCase()));
            setFilteredUsers(filtered); // Appliquer le filtrage
        }
    };

    const handleViewUser = (user) => {
        Modal.info({
            title: 'User Details',
            content: (
                <div>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>UserName:</strong> {user.username}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>
            ),
            onOk() { },
        });
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                const color = colorPalette[index % colorPalette.length];
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar style={{ backgroundColor: color, marginRight: '10px' }}>
                            {text.charAt(0).toUpperCase()}
                        </Avatar>
                        {text}
                    </div>
                );
            },
        },
        {
            title: 'UserName',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Rôle',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <EyeOutlined
                        style={{ fontSize: '18px', cursor: 'pointer' }}
                        onClick={() => handleViewUser(record)} // Fonction d'affichage
                    />
                    <EditOutlined
                        style={{ fontSize: '18px', cursor: 'pointer' }}
                        onClick={() => handleUpdateUser(record)} // Fonction de mise à jour
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
        <>
            <Row justify="space-between" style={{ marginBottom: '20px' }}>
                <Col>

                    <Input.Search
                        placeholder="Search by name"
                        size="large"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)} // Recherche par nom
                        style={{ width: 300 }}
                    />
                </Col>
                <Col>
                    <Input.Search
                        placeholder="Search by role"
                        size="large"
                        value={searchRole}
                        onChange={(e) => handleSearchByRole(e.target.value)} // Recherche par rôle
                        style={{ width: 300 }}
                    />
                </Col>
                <Col>
                    <Button
                        type="primary"
                        onClick={() => setIsModalOpen(true)}
                        style={{ padding: "10px 20px", fontSize: "15px", height: "40px", width: "160px", backgroundColor: "rgb(189, 37, 27)", borderColor: "rgb(189, 37, 27)" }}
                    >
                        Add User
                    </Button>
                </Col>
            </Row>

            <Table
                dataSource={filteredUsers.length > 0 ? filteredUsers : users} // Utiliser filteredUsers si filtré, sinon users
                columns={columns}
                rowKey="_id"
                loading={isLoading}
                error={isError ? error.message : null}
                pagination={{ pageSize: 5 }}
            />

            {/* Modal pour ajouter un utilisateur */}
            <Modal
                title="Add User"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleAddUser} layout="vertical" autoComplete="off">
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the name!' }]}>
                        <Input autoComplete="off" />
                    </Form.Item>

                    <Form.Item
                        label="Email or Phone"
                        name="username"
                        rules={[
                            { required: true, message: "Please enter your email or phone number" },
                            {
                                pattern: /^([^\s@]+@[^\s@]+\.[^\s@]+|\d{8})$/,
                                message: "Please enter a valid email or an 8-digit phone number"
                            },
                            {
                                validator: async (_, value) => {
                                    if (value) {
                                        const exists = await checkEmailExists(value);
                                        if (exists) {
                                            throw new Error('This username is already registered');
                                        }
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input autoComplete="off" />
                    </Form.Item>

                    <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input the password!' }]}>
                        <Input.Password autoComplete="new-password" />
                    </Form.Item>

                    <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please select a role!' }]}>
                        <Select>
                            <Select.Option value="EXPEDITEUR">EXPEDITEUR</Select.Option>
                            <Select.Option value="ADMIN">ADMIN</Select.Option>
                            <Select.Option value="LIVREUR">LIVREUR</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Add User
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal pour mettre à jour un utilisateur */}
            <Modal
                title="Update User"
                open={isUpdateModalOpen}
                onCancel={() => setIsUpdateModalOpen(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleUpdateSubmit} layout="vertical">
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the name!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="UserName" name="username" rules={[
                        { required: true, message: "Please enter your email or phone number" },
                        {
                            pattern: /^([^\s@]+@[^\s@]+\.[^\s@]+|\d{8})$/,
                            message: "Please enter a valid email or an 8-digit phone number"
                        },

                    ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input the password!' }]}>
                        <Input.Password autoComplete="new-password" />
                    </Form.Item>

                    <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please select a role!' }]}>
                        <Select>
                            <Select.Option value="EXPEDITEUR">EXPEDITEUR</Select.Option>
                            <Select.Option value="ADMIN">ADMIN</Select.Option>
                            <Select.Option value="LIVREUR">LIVREUR</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Update User
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default Users;
