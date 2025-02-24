const DelivryModel = require('../models/delivry.models');
const { validateDelivry } = require('../validation/delivry.validation');

const AddDelivry = async (req, res) => {

    try {
        // Valider les données de la requête
        const { error } = validateDelivry(req.body);
        if (error) {
            return res.status(400).json(error.message);
        } else {
            // Récupérer les deux derniers chiffres de l'année courante
            const year = new Date().getFullYear().toString().slice(-2); // Ex: 2025 => "25"

            // Récupérer le dernier code de livraison
            const lastDelivery = await DelivryModel.findOne().sort({ code: -1 }); // Tri par code décroissant
            let sequenceNumber = 1; // Valeur par défaut si aucune livraison n'existe

            if (lastDelivery && lastDelivery.code) {
                // Extraire le numéro de séquence du dernier code
                const lastSequenceNumber = parseInt(lastDelivery.code.slice(-1), 10);
                sequenceNumber = lastSequenceNumber + 1; // Incrémenter le numéro de séquence
            }

            // Générer le nouveau code de livraison
            const code = `${year}0000${sequenceNumber}`; // Ex: "25000001"

            //houni 9bal mnb3th lbody bch nzid champ user bch 
            // ye5ou id elli teb3ath ml passwort
            req.body.code = code;
            req.body.user = req.user.id,
                req.body.status = "EnAttente"
            await DelivryModel.create(req.body)
            res.status(200).json({ message: 'success' })
        }


    } catch (error) {
        res.status(404).json(error.message)
    }

}


const FindAllDelivry = async (req, res) => {
    try {
        const data = await DelivryModel.find().populate('user')
        res.status(200).json(data)

    } catch (error) {
        res.status(400).json(error.message)

    }
}


const FindDelivryById = async (req, res) => {
    try {

        const data = await DelivryModel.findOne({ _id: req.params.id }).populate('user')
        res.status(200).json(data)

    } catch (error) {
        res.status(400).json(error.message)

    }

}
const FindMyDelivry = async (req, res) => {
    try {

        const data = await DelivryModel.findOne({ user: req.user.id }).populate('user')
        res.status(200).json(data)

    } catch (error) {
        res.status(400).json(error.message)

    }

}
const UpdateDelivryStatus = async (req, res) => {
    try {

        const data = await DelivryModel.findOneAndUpdate(
            { _id: req.params.id },
            { status: req.body.status },//mis a jour de status
            { new: true }

        )
        res.status(200).json(data)

    } catch (error) {
        res.status(400).json(error.message)

    }

}
const UpdateDelivryStatusAttente = async (req, res) => {
    const { _id } = req.body; // Liste des IDs des livraisons sélectionnées

    try {
        // Mettre à jour le statut des livraisons sélectionnées si elles sont en "EnAttente"
        const result = await DelivryModel.updateMany(
            { _id: { $in: _id }, status: "EnAttente" }, // Filtre : IDs et statut "EnAttente"
            { $set: { status: "EnDepot" } } // Mise à jour : statut "EnDepot"
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ success: false, message: "Aucune livraison en statut 'EnAttente' trouvée." });
        }

        res.status(200).json({ success: true, message: "Statut mis à jour avec succès", result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};
const TrackDeliveryByCode = async (req, res) => {
    const { code } = req.params; // Récupérer le code de la commande depuis l'URL

    try {
        // Rechercher la commande par son code
        const delivery = await DelivryModel.findOne({ code }).populate('user');

        if (!delivery) {
            return res.status(404).json({ success: false, message: "Commande non trouvée." });
        }

        // Retourner les détails de la commande
        res.status(200).json({ success: true, delivery });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};

const UpdateDelivry = async (req, res) => {
    try {
        const { error } = validateDelivry(req.body);
        if (error) {
            return res.status(400).json(error.message);
        }


        const data = await DelivryModel.findOneAndUpdate(

            { _id: req.params.id },
            req.body,
            { new: true }
        );
        res.status(201).json(data);

    }
    catch (error) {
        console.log(error.message)

    }


}


const DeleteDelivry = async (req, res) => {
    try {
        //_id:req.param.id//elli bch tab3thou enti bl url houwa elli bch nafs5ou
        await DelivryModel.findOneAndDelete({ _id: req.params.id })
        res.status(200).json({ message: 'delete' })

    } catch (error) {
        res.status(400).json(error.message)

    }

}

module.exports = {
    AddDelivry,
    FindAllDelivry,
    FindMyDelivry,
    FindDelivryById,
    UpdateDelivryStatus,
    UpdateDelivry,
    DeleteDelivry,
    UpdateDelivryStatusAttente,
    TrackDeliveryByCode
}