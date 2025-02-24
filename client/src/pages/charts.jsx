import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pie } from '@ant-design/plots';
import { axiosInstance } from '../lib/axios';

// Fonction pour récupérer les livraisons
const fetchDeliveries = async () => {
    const response = await axiosInstance.get('/delivry');
    return response.data;
};

// Fonction pour formater les données pour le graphique
const formatDataForPieChart = (deliveries) => {
    if (!deliveries) return [];

    const statusCounts = {
        enattente: 0,
        endepot: 0,
        encours: 0,
    };

    deliveries.forEach((delivery) => {
        if (delivery.status === 'EnAttente') statusCounts.enattente++;
        else if (delivery.status === 'EnDepot') statusCounts.endepot++;
        else if (delivery.status === 'EnCours') statusCounts.encours++;
    });

    return [
        { type: 'EnAttente', value: statusCounts.enattente },
        { type: 'EnDepot', value: statusCounts.endepot }, // Correction d'affichage
        { type: 'EnRetour', value: statusCounts.encours },
    ];
};

const DeliveryPieChart = () => {
    // Utilisation correcte de useQuery (React Query v5)
    const { data: deliveries, isLoading, isError } = useQuery({
        queryKey: ['deliveries'],
        queryFn: fetchDeliveries,
    });

    if (isLoading) return <div>Chargement des données...</div>;
    if (isError) return <div>Erreur lors de la récupération des données</div>;

    // Formater les données pour le graphique
    const chartData = formatDataForPieChart(deliveries);

    // Configuration du graphique
    const config = {
        data: chartData,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            text: (d) => `${d.type}\n ${d.value}`,
            position: 'spider',
        },
        legend: {
            color: {
                title: false,
                position: 'right',
                rowPadding: 5,
            },
        },

    };
    return (
        <div>
            <h2 style={{ textAlign: 'center', fontSize: 18, fontWeight: 500 }}>
                Statistiques des livraisons
            </h2>
            <Pie {...config} />
        </div>
    );
};

export default DeliveryPieChart;
