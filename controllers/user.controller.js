const { response } = require('express');
const User = require('../models/Users.model');
const encriptarPassword = require('../helpers/encriptarPassword');
const generateJWT = require('../helpers/jwt');
const bcryptjs = require('bcryptjs');

//Controllers: createUser, getUsers, updateUser, deleteUser, loginUserByEmail, loginByGoogle, renewJWT
const getUser = async( req, res=response ) => {

    const {  userId } = req.params;

    try {

        const userData = await User.find( { _id:userId } );

        res.status(201).json({
            ok:true,
            userData
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'No pudo mostrarse la información del usuario. Inténtelo más tarde'
        });
        
    }

};


const getUsers = async(req, res=response) => {

    //Solo el administrador debe poder acceder al listado de usuarios
    //A través del JWT, podemos acceder al ID del usuario que está logueado

    try {
        
        const [ users, totalUsers ] = await Promise.all([
            await User.find( {status:true }),
            await User.countDocuments( { status:true } )
        ])
    
        return res.json({
            ok:true,
            'Total usuarios': totalUsers,
            'Usuarios': users
        });

    } catch (error) {
        console.log(error);
        throw new Error('No pudo llevarse a acabo la consulta. Inténtelo más tarde');
    }

}


const updateUserProfile = async(req, res=response) => {

    const {  userId } = req.params;

    try {
        
        const userUpdated = await User.findByIdAndUpdate( userId, req.body );

        return res.status(201).json({
            ok:true,
            msg:'user updated',
            userUpdated
        });

    } catch (error) {
        console.log(error);
        
        return res.status(400).json({
            ok:false,
            msg:'No pudo actualizarse el usuario'
        })
    }

    
}

const deleteUser = async(req, res=response) => {

    //determinar con el JWT si el usuario logeado es el mismo que quiere darse de baja
    const {  userId } = req.params;
   
    try {
       
        const userDeleted = await User.findByIdAndUpdate( userId, { status:false } );

        return res.json({
            ok:true,
            msg:'user deletd',
            userDeleted
        });

    } catch (error) {
        console.log(error);
        
        return res.status(400).json({
            ok:false,
            msg:'No pudo eliminarse el usuario'
        });
    }

}


const changeUserPassword = async( req, res=response ) => {

    //determinar con el JWT si el usuario logeado es el mismo que quiere cambiar su password    
    const { userId } = req.params;
    const { password } = req.body;


    try {
        // //Determinar si el usuario está activo
        const user = await User.findById(userId);
      
        //encryptar nueva contraseña
        await User.findByIdAndUpdate( userId, { password: encriptarPassword( password ) } );

        
        return res.json({
            ok:true,
            user,
            msg:'Password changed'
            
        })

    } catch (error) {
        console.log(error);
        
        return res.status(400).json({
            ok:false,
            msg:'No pudo actualizarse la contraseña'
        })
    }

   
}

module.exports = {
    getUser,
    getUsers,
    updateUserProfile,
    changeUserPassword,
    deleteUser
}