const User = require('../model/user.model')

//create user
const createUser = (async(req,res)=>{
    let object = req.body

    if (!object) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }else if (!object.email) {
      res.status(400).send({
        status: 0,
        message: "Email is required.",
      });
    }else if (!req.body.password) {
      res.status(400).send({
        status: 0,
        message: "Password is required.",
      });
    }else{
      const user = await User.find({ email: req.body.email });
      if (user.length >= 1) {
      res.status(400).send({
        status: 0,
        message: "Email already exists!",
      });
      }else{
        var final_id = object.userId
        final_id = final_id === undefined ? 0 : undefined
        // Add auto increment to the user id.
        User.count().then( (count) => {
          return count
        }).then(async(data)=>{
          final_id = data + 1 
    
          //  save the user into db
          let user = {
            userId: final_id,
            name: req.body.name,
            email:req.body.email,
            password:req.body.password,
            age: req.body.age,
            phoneNo:req.body.phoneNo
          };
          // console.log(user)
          await User.create(user)
            .then(async(result)=>{
              await res.status(201).json({ user })
            }).catch(async(err)=>{
              await res.status(400).json({ err })      
            })
        })
      }
  }

})

//get all user
const getUser = (async(req,res) => {
  try{
    const { userId: userId } = req.params
    const user = await User.findOne({ userId: userId })
  if (!user) {
    res.status(404).send({
      status: 0,
      message: `Cannot find User with id=${userId}.`
    });
  }else{
    return res.status(200).json({ user })
  }
  }catch (error) {
    return res.status(404).send(error.message);
  }
  
})

//update user
const updateUser = (async(req,res)=>{
  try {
    const {userId:userId} = req.params

    const updatedUser = {
      userId: req.body.userId ? userId:undefined,
      name: req.body.name,
      email:req.body.email,
      age: req.body.age,
      phoneNo:req.body.phoneNo

    }
    var user = await User.find({ userId: userId });
    if(!user){
      return res.status(400).send({
        status: 0,
        message: "User not found",
      });
    }
    else{
      var user = await User.find({ email: req.body.email });
      if (user.length >= 1) {
      res.status(400).send({
        status: 0,
        message: "Email already exists!",
      });
    }else{
      const edituser = await User.findOneAndUpdate(
        { userId: userId },
        updatedUser,
        { new: true }
      );
      if(updatedUser.userId != undefined){
        return res.status(200).send({
          status: 1,
          message: "You haven't access to assing userid",
          edituser
        });
      }else{
        return res.status(200).send({
          status: 1,
          message: "User Updated",
          edituser
        });
      }

    }
      
  }   
} catch (error) {
    return res.status(404).send(error.message);
  }
})

//delete one user
const deleteUser = (async(req,res)=>{
  try{
    const { userId: userId } = req.params
    const user = await User.findOneAndDelete({ userId: userId })
    if (!user) {
      res.status(404).send({
        status: 0,
        message: `Cannot find User with id=${userId}.`
      });
    }else{
      return res.status(200).json({message:`User with id ${userId} has been deleted!`})

    }
  }catch (error) {
    return res.status(404).send(error.message);
  }
 
})



module.exports = {createUser,getUser,updateUser,deleteUser} 