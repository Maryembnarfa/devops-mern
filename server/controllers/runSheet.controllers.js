const RunSheetModel = require('../models/runSheet.models');
const { validateRunSheet } = require('../validation/runSheet.validation');

const AddRunSheet = async (req, res) => {

    try {
        // Valider les données de la requête
        const { error } = validateRunSheet(req.body);
        if (error) {
            return res.status(400).json(error.message);
        } else {
            //houni 9bal mnb3th lbody bch nzid champ user bch 
            // ye5ou id elli teb3ath ml passwort
            req.body.user = req.user.id
            await RunSheetModel.create(req.body)
            res.status(200).json({ message: 'success' })
        }


    } catch (error) {
        res.status(404).json(error.message)
    }

}


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

module.exports = {
    AddRunSheet,
    FindAllRunSheet,
    FindRunSheetById,
    DeleteRunSheet

}