const VehicleModel = require('../models/vehicle.models');
const { validateVehicleSerie } = require('../validation/vehicle.validation');

const AddVehicle = async (req, res) => {
    try {
        const { error } = validateVehicleSerie(req.body);
        if (error) {
            return res.status(400).json(error.message)

        } else {
            req.body.user = req.user.id
            await VehicleModel.create(req.body)
            res.status(200).json({ message: 'success' })
        }

    } catch (error) {
        res.status(404).json(error.message)
    }
}

const FindAllVehicle = async (req, res) => {
    try {
        const data = await VehicleModel.find().populate('user')
        res.status(200).json(data)

    } catch (error) {
        res.status(400).json(error.message)

    }
}
const FindVehicleById = async (req, res) => {
    try {

        const data = await VehicleModel.findOne({ _id: req.params.id }).populate('user')
        res.status(200).json(data)

    } catch (error) {
        res.status(400).json(error.message)

    }

}
const UpdateVehicle = async (req, res) => {
    try {
        const { error } = validateVehicleSerie(req.body);
        if (error) {
            return res.status(400).json(error.message);
        }


        const data = await VehicleModel.findOneAndUpdate(

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
const DeleteVehicle = async (req, res) => {
    try {
        //_id:req.param.id//elli bch tab3thou enti bl url houwa elli bch nafs5ou
        await VehicleModel.findOneAndDelete({ _id: req.params.id })
        res.status(200).json({ message: 'delete' })

    } catch (error) {
        res.status(400).json(error.message)

    }

}
module.exports = {
    AddVehicle,
    FindAllVehicle,
    UpdateVehicle,
    DeleteVehicle,
    FindVehicleById
}

