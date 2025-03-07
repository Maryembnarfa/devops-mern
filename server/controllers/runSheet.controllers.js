const RunSheetModel = require('../models/runSheet.models');
const DelivryModel = require('../models/delivry.models'); // Importer le modèle Delivry

const { validateRunSheet } = require('../validation/runSheet.validation');


// Fonction pour générer le code de la RunSheet
const generateRunSheetCode = async () => {
    // Récupérer la dernière RunSheet créée
    const lastRunSheet = await RunSheetModel.findOne().sort({ _id: -1 }).exec();

    let nextNumber = 1; // Valeur par défaut si aucune RunSheet n'existe

    if (lastRunSheet && lastRunSheet.code) {
        // Extraire le numéro du dernier code (par exemple, "RS0003" => 3)
        const lastNumber = parseInt(lastRunSheet.code.replace('RS', ''), 10);
        if (!isNaN(lastNumber)) {
            nextNumber = lastNumber + 1;
        }
    }

    // Formater le numéro avec des zéros non significatifs (exemple : "0004")
    const formattedNumber = String(nextNumber).padStart(4, '0');

    return `RS${formattedNumber}`;
};
const AddRunSheet = async (req, res) => {
    try {
        // Valider les données de la requête
        const { error } = validateRunSheet(req.body);
        if (error) {
            return res.status(400).json(error.message);
        }


        // Vérifier si les codes de livraison existent
        const { livraisons } = req.body;
        if (livraisons && livraisons.length > 0) {
            const existingDeliveries = await DelivryModel.find({ code: { $in: livraisons } });
            if (existingDeliveries.length !== livraisons.length) {
                return res.status(400).json({ message: "Un ou plusieurs codes de livraison n'existent pas." });
            }

            // Vérifier si toutes les livraisons sont en statut "EnDepot"
            const deliveriesInDepot = await DelivryModel.find({
                code: { $in: livraisons },
                status: "EnDepot"
            });

            if (deliveriesInDepot.length !== livraisons.length) {
                return res.status(400).json({ message: "Une ou plusieurs livraisons ne sont pas en statut 'EnDepot'." });
            }
        }

        // Générer le code de la RunSheet
        const runSheetCode = await generateRunSheetCode();
        // Ajouter l'ID de l'utilisateur au corps de la requête
        req.body.user = req.user.id;
        req.body.code = runSheetCode;


        // Créer le RunSheet
        const runSheet = await RunSheetModel.create(req.body);

        // Mettre à jour le statut des livraisons associées (uniquement celles en statut "EnDepot")
        if (runSheet.livraisons && runSheet.livraisons.length > 0) {
            await DelivryModel.updateMany(
                {
                    code: { $in: runSheet.livraisons },
                    status: "EnDepot" // Filtrer uniquement les livraisons en statut "EnDepot"
                },
                { $set: { status: 'EnCours' } } // Mettre à jour le statut
            );
        }

        res.status(200).json({ message: 'success', data: runSheet });
    } catch (error) {
        res.status(404).json(error.message);
    }
};
const FindAllRunSheet = async (req, res) => {
    try {
        const data = await RunSheetModel.find().populate('user')
        res.status(200).json(data)

    } catch (error) {
        res.status(400).json(error.message)

    }
}
const FindRunSheetById = async (req, res) => {
    try {

        const data = await RunSheetModel.findOne({ _id: req.params.id }).populate('user')
        res.status(200).json(data)

    } catch (error) {
        res.status(400).json(error.message)

    }

}
const DeleteRunSheet = async (req, res) => {
    try {
        //_id:req.param.id//elli bch tab3thou enti bl url houwa elli bch nafs5ou
        await RunSheetModel.findOneAndDelete({ _id: req.params.id })
        res.status(200).json({ message: 'delete' })

    } catch (error) {
        res.status(400).json(error.message)

    }

}
const UpdateRunSheetStatus = async (req, res) => {
    try {
        const { livraisons, status } = req.body;

        // Mettre à jour le statut des livraisons sélectionnées
        await DelivryModel.updateMany(
            { code: { $in: livraisons } }, // Filtrer les livraisons sélectionnées
            { $set: { status: status } } // Mettre à jour le statut
        );

        res.status(200).json({ message: 'Statut des livraisons mis à jour avec succès' });
    } catch (error) {
        res.status(400).json(error.message);
    }
};

module.exports = {
    AddRunSheet,
    FindAllRunSheet,
    FindRunSheetById,
    DeleteRunSheet,
    UpdateRunSheetStatus

}