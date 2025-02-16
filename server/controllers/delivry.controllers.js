const DelivryModel=require('../models/delivry.models');
const { validateDelivry } = require('../validation/delivry.validation');

const AddDelivry=async(req,res)=>{

    try {
           // Valider les données de la requête
    const { error } = validateDelivry(req.body);
    if (error) {
      return res.status(400).json(error.message);
    }else{
        //houni 9bal mnb3th lbody bch nzid champ user bch 
        // ye5ou id elli teb3ath ml passwort
        req.body.user=req.user.id
       await DelivryModel.create(req.body)
        res.status(200).json({message:'success'})
    }

        
    } catch (error) {
        res.status(404).json(error.message)
    }

}


const FindAllDelivry=async(req,res)=>{
   try {
    const data= await DelivryModel.find().populate('user')
    res.status(200).json(data)

   } catch (error) {
    res.status(400).json(error.message)

   }
}


const FindDelivryById=async(req,res)=>{
    try {
       
        const data= await DelivryModel.findOne({_id: req.params.id }).populate('user')
        res.status(200).json(data)
    
       } catch (error) {
        res.status(400).json(error.message)
    
       }

}
const FindMyDelivry=async(req,res)=>{
    try {
       
        const data= await DelivryModel.findOne({user:req.user.id}).populate('user')
        res.status(200).json(data)
    
       } catch (error) {
        res.status(400).json(error.message)
    
       }

}
const UpdateDelivryStatus=async(req,res)=>{
    try {
       
        const data= await DelivryModel.findOneAndUpdate(
            { _id: req.params.id },
            { status: req.body.status },//mis a jour de status
                { new: true }
        
        )
        res.status(200).json(data)
    
       } catch (error) {
        res.status(400).json(error.message)
    
       }

}

const UpdateDelivry=async(req,res)=>{
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


const DeleteDelivry=async(req,res)=>{
    try {
        //_id:req.param.id//elli bch tab3thou enti bl url houwa elli bch nafs5ou
        await DelivryModel.findOneAndDelete({_id:req.params.id})
        res.status(200).json({message:'delete'})
    
       } catch (error) {
        res.status(400).json(error.message)
    
       }

}

module.exports={
    AddDelivry,
    FindAllDelivry,
    FindMyDelivry,
    FindDelivryById,
    UpdateDelivryStatus,
    UpdateDelivry,
    DeleteDelivry
}