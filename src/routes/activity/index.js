var express = require('express');
var router = express.Router();
var multer = require("multer");
const isEmpty=require('../../middlewares/objectValidation')
const activitys =require('../../models/Activity')
const User = require("../../models/User");
var services=require('./services')
var bodyParser = require("body-parser");
const fs = require('fs-extra')
router.use(bodyParser.urlencoded({ extended: true }));
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = `../resources/activity`;
    if (!fs.existsSync(dir)) fs.mkdir(dir);
    cb(null, "../resources/activity");
    console.log("resources/activity");
  },
  filename: function(req, file, cb) {
    console.log();
    //cb(null, file.originalname);
    cb(
      null,
      new Date().getMinutes() +
        "" +
        new Date().getMinutes() +
        "_" +
        file.originalname
    );
  }
});

const fileFilter = (req, file, cb) => {
  cb(null, true);
};

const upload = multer({
  storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5
//   },
  fileFilter: fileFilter
});

router.post("/upload", upload.single("image"), function(req, res, next) {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    return res.status(200).json({ success: true, message: req.file.filename });
  } catch (error) {
    console.log(error);
  }
});

// new code 

// ----------- functions 

getAllActivities = async (req, res) => {	
	//TO DO test query (isEmpty  has correct data ...etc )
	// for example if(req && req.body)???
// ----  Empty query  is accepted 
	const query =req.body
	   await services.getAllActivities(query)
	  
		.then(activities => {

			res.json({
			success : true,
			data: activities
		})
	})
	.catch(err =>{
		res.json({
			success:false,
			message:err.message
		})
	})
}
//getAvtivityById
getActivityById= async (req,res) =>{
	const id = req.params.id
	// const details =activitys.find({_id:id}).lean().toJson()
	const details = await services.getAvtivityDetails(id,"EVENT");
	res.json({
    success: true,
    data: details
  });
}
//Add New Activity
addActivity=async (req, res) => {	
	if (!req.body.name) {
		res.json({
		  success: false,
		  message: "insert Data",
		})}
else {
	activitys.findOne({
		name: req.body.name || ''
	  })
		.then(activity => {
		  if (!activity) {
			let  query;
	if(!req.body.type){
		 query=req.body
	}
	else{
	 query = Object.assign(req.body, {type: req.body.type.toUpperCase()});
 }
			activitys.create(query)
			  .then(activity => {
				res.json({
				  success: true,
				  data: activity
				})
			  })
			  .catch(err => {
				res.json({
				  success: false,
				  message: err.message
				})
			  })
		  } else {
			res.json({ success: false, message: 'activity already exists' })
		  }
		})
		.catch(err => {
		  res.json({
			success: false,
			message: err.message
		  })
		})
	}
  }

//delete activity byId
deleteActivityById=async(req,res)=>{
	const id = req.params.id
	activitys.findByIdAndRemove(id)
	.then(data =>{
		res.json({
			success: true,
			Message : 'Activity ' +id +'sucessfully removed .'
		})
	})
	.catch(err => {
		res.json({
			success: true,
			message : err.message
		})	
	})
}

//delete all activities

deleteAllActivities=async(req,res)=>{
	activitys.remove()
	.then(data =>{
		res.json({
			success: true,
			message: ' Activities sucessfully removed .'
		})
	})
	.catch(err => {
		res.json({
			success: false,
			message : err.message
		})
	})
}

//update activity

updateActivity=async(req,res)=>{
	const id = req.params.id
	let  query;	
	if(!req.body.type){
		 query=req.body
	}
	else{
	 query = Object.assign(req.body, {type: req.body.type.toUpperCase()});
 }
	activitys.findByIdAndUpdate(id, query ,{new:true})
	.then(activity => {
		res.json({
		success: true,
		data: activity
		})
	})
	.catch(err => {
		res.json({
			success: false,
			message : err.message
		})	
	})
}

//GET ALL GUESTS
getAllGuests=async(req,res) =>{
	const id = req.params.id
	activitys.findById(id).select('guests')
	.then(guests =>{
		res.json({
		success : true,
		data : guests
		})
	})
	.catch(err =>{
		res.json({	
			success : false,
			message : 'guests  Not Found !'	
		})	
	})
}

//GET ALL  TEAMS 
getAllTeams=async(req,res) =>{
	const id = req.params.id
	activitys.findById(id).select('teams')
	.then(teams =>{
		res.json({
		success : true,
		data : teams
		})
	})
	.catch(err =>{
		res.json({	
			success : false,
			message : 'teams Not Found !'	
		})	
	})
}

//GET ALL MEDIA
getAllMedia=async(req,res) =>{
	const id = req.params.id
	activitys.findById(id).select('media')
	.then(media =>{
		res.json({
		success : true,
		data : media
		})
	})
	.catch(err =>{
		res.json({	
			success : false,
			message : 'media Not Found !'	
		})	
	})
}

//GET ALL SPONSORS
getAllSponsors=async(req,res) =>{
	const id = req.params.id
	activitys.findById(id).select('sponsors')
	.then(sponsors =>{
		res.json({
		success : true,
		data : sponsors
		})
	})
	.catch(err =>{
		res.json({	
			success : false,
			message : 'sponsors Not Found !'	
		})	
	})
}

//GET ALL PARTICIPANTS
getAllParticipants=async(req,res) =>{
	const id = req.params.id
	activitys.findById(id).select('participants')
	.then(participants =>{
		res.json({
		success : true,
		data : participants
		})
	})
	.catch(err =>{
		res.json({
			success : false,	
			message : 'participants Not Found !'	
		})	
	})
}

//GET ALL childActivities
getAllChildActivities=async(req,res) =>{
	const id = req.params.id
	activitys.findById(id).select('childActivities')
	.then(childActivities =>{
		res.json({
		success : true,
		data : childActivities
		})
	})
	.catch(err =>{
		res.json({	
			success : false,
			message : 'childActivities Not Found !'	
		})	
	})
}

//GET ALL processes
getAllProcesses=async(req,res) =>{
	const id = req.params.id
	activitys.findById(id).select('processes')
	.then(processes =>{
		res.json({
		success : true,
		data : processes
		})
	})
	.catch(err =>{
		res.json({	
			success : false,
			message : 'teams Not Found !'	
		})	
	})
}

//CRUD GUESTS//

//Add NEW GUEST IN Activity
addNewGuestToActivity=async(req,res) => {
	const id = req.params.id;
	activitys.findOneAndUpdate( {_id:id},{$push:{'guests': req.body }})
	.then(activity =>{
		res.json({
			success: true,
			message: 'Activity guest ' +id +' sucessfully pushed .',
			data:activity
		})
	})
	.catch(err=>{
		res.json({
			success : false,
			message : err.message
		})
	})
}

//delete guests in Activity
deleteGuestInActivity=async(req,res) => {
	const id = req.params.id;
	const idguest = req.params.idguest;
	activitys.findOneAndUpdate(id,{$pull:{guests :{_id : idguest}}, new: true, upsert: true})
	.then(data =>{
		res.json({
			success: true,
			Message: 'Activity guest ' +id +' sucessfully deleted .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}

//update guest in Activity
updateGuestInActivity=async(req,res) => {
	const id = req.params.id;
	const idguest =req.params.idguest;
	activitys.findOneAndUpdate({_id:id ,guests : {
		$elemMatch:{
			_id:idguest
		}
	}},{ $set :{'guests.$': req.body}})
	.then(data =>{
		res.json({
			success: true,
			message: 'Activity  ' +id +' sucessfully updated .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}


//CRUD TAG
//add TAG in Activity 
addTag=async(req,res) => {
	const id = req.params.id;
	const value = req.params.value;
	activitys.findOneAndUpdate( {_id:id},{$push:{'tags': value }})
	.then(data =>{
		res.json({
			success: true,
			message: 'Activity tag ' +id +' sucessfully pushed .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}
//delete tag from Activity
deleteTag=async(req,res) => {
	const id = req.params.id;
	const valueTag = ''+req.params.valueTag.toString();
	activitys.findOneAndUpdate(id,{$pull:{'tags' : valueTag}})
	.then(data =>{
		res.json({
			success:true,
			message: 'Activity tag ' +id +' sucessfully deleted . '+ valueTag
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}

//update tag in Activity
updateTagInActivity=async(req,res) => {
	const id = req.params.id;
	const valueTag ='' + req.params.valueTag.toString();
	activitys.findOneAndUpdate({_id:id ,'tags' :'said'
	},
	{ $set :{'tags': 'tag2938'}})
	.then(data =>{
		res.json({
			success: true,
			message: 'Activity  ' +id +' sucessfully updated .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}
//CRUD processes
//add processes in Activity 
addProcess=async(req,res) => {
	const id = req.params.id;
	activitys.findOneAndUpdate( {_id:id},{$push:{'processes': req.body }})
	.then(data =>{
		res.json({
			success: true,
			message: 'Activity processes ' +id +' sucessfully pushed .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}

//delete processes in Activity
deleteProcess=async(req,res) => {
	const id = req.params.id;
	const idprocesses = req.params.idprocesses;
	activitys.findOneAndUpdate(id,{$pull:{processes :{_id : idprocesses}}, new: true, upsert: true})
	.then(data =>{
		res.json({
			success: true,
			message: 'Activity processes ' +id +' sucessfully deleted .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}

//update processes in Activity
updateProcess=async(req,res) => {
	const id = req.params.id;
	const idprocesses =req.params.idprocesses;
	activitys.findOneAndUpdate({_id:id ,processes : {
		$elemMatch:{
			_id:idprocesses
		}
	}},{ $set :{'processes.$': req.body}})
	.then(data =>{
		res.json({
			success: true,
			message: 'Activity  ' +id +' sucessfully updated .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}

//CRUD chilsActivities
//add childActivities in Activity 
addChildActivity=async(req,res) => {
	const id = req.params.id;
	activitys.findOneAndUpdate( {_id:id},{$push:{'childActivities': req.body }})
	.then(data =>{
		res.json({
			success: true,
			message: 'Activity childActivities ' +id +' sucessfully pushed .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}

//delete childActivities from Activity
deleteChildActivity=async(req,res) => {
	const id = req.params.id;
	const idchildActivities = req.params.idchildActivities;
	activitys.findOneAndUpdate(id,{$pull:{childActivities :{_id : idchildActivities}}, new: true, upsert: true})
	.then(data =>{
		res.json({
			success: true,
			message: 'Activity childActivities ' + id +' sucessfully deleted .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}
//update childActivities in Activity
updateChildActivity=async(req,res) => {
	const id = req.params.id;
	const idchildActivities =req.params.idparticipants;
	activitys.findOneAndUpdate({_id:id ,childActivities : {
		$elemMatch:{
			_id:idchildActivities
		}
	}},{ $set :{'childActivities.$': req.body}})
	.then(data =>{
		res.json({
			success: true,
			message: 'Activity  ' +id +' sucessfully updated .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}

//CRUD PARTICIPANS//
//add participant to Activity 
addParticipant=async(req,res) => {
	const id = req.params.id;
	activitys.findOneAndUpdate( {_id:id},{$push:{'participants': req.body }})
	.then(data =>{
		res.json({
			success: true,
			message: 'Activity participants ' +id +' sucessfully pushed .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}

//delete participants from Activity
deleteParticipant=async(req,res) => {
	const id = req.params.id;
	const idparticipants = req.params.idparticipants;
	activitys.findOneAndUpdate(id,{$pull:{participants :{_id : idparticipants}}, new: true, upsert: true})
	.then(data =>{
		res.json({
			success: true,
			message: 'Activity participants ' +id +' sucessfully deleted .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}

//update participants in Activity
updateParticipants=async(req,res) => {
	const id = req.params.id;
	const idparticipants =req.params.idparticipants;
	activitys.findOneAndUpdate({_id:id ,participants : {
		$elemMatch:{
			_id:idparticipants
		}
	}},{ $set :{'participants.$': req.body}})
	.then(data =>{
		res.json({
			success: true,
			message: 'Activity  ' +id +' sucessfully updated .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}

//CRUD SPONSORS //
addSponsor=async(req,res) => {
	const id = req.params.id;
	activitys.findOneAndUpdate( {_id:id},{$push:{'sponsors': req.body }})
	.then(data =>{
		res.json({
			success: true,
			message: 'Activity sponsors ' +id +' sucessfully pushed .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}

//delete sponsors in Activity
deleteSponsor=async(req,res) => {
	const id = req.params.id;
	const idsponsors = req.params.idsponsors;
	activitys.findOneAndUpdate(id,{$pull:{sponsors :{_id : idsponsors}}, new: true, upsert: true})
	.then(data =>{
		res.json({
			success: true,
			message: 'Activity sponsors ' +id +' sucessfully deleted .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}
//update sponsors in Activity
updateSponsor=async(req,res) => {
	const id = req.params.id;
	const idsponsors =req.params.idsponsors;
	activitys.findOneAndUpdate({_id:id ,teams : {
		$elemMatch:{
			_id:idsponsors
		}
	}},{ $set :{'sponsors.$': req.body}})
	.then(data =>{
		res.json({
			success: true,
			message: 'Activity  ' +id +' sucessfully updated .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}

//CRUD TEAM
//add new team
addTeam=async(req,res) => {
	const id = req.params.id;
	activitys.findOneAndUpdate( {_id:id},{$push:{'teams': req.body }})
	.then(data =>{
		res.json({
			success: true,
			message: 'Activity media ' +id +' sucessfully pushed .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}

//delete team in Activity
deleteTeam=async(req,res) => {
	const id = req.params.id;
	const idteam = req.params.idteam;
	activitys.findOneAndUpdate(id,{$pull:{teams :{_id : idteam}}, new: true, upsert: true})
	.then(data =>{
		res.json({
			success: true,
			message: 'Activity team ' +id +' sucessfully deleted .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}

//update team in Activity
updateTeam=async(req,res) => {
	const id = req.params.id;
	const idteam =req.params.idteam;
	activitys.findOneAndUpdate({_id:id ,teams : {
		$elemMatch:{
			_id:idteam
		}
	}},{ $set :{'teams.$': req.body}})
	.then(data =>{
		res.json({
			success: true,
			message: 'Activity  ' +id +' sucessfully updated .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}


//CRUD MEDIA//

//add new media

addMedia=async(req,res) => {
	const id = req.params.id;
	activitys.findOneAndUpdate( {_id:id},{$push:{'media': req.body }})
	.then(data =>{
		res.json({
			success: true,
			message: 'Activity media ' +id +' sucessfully pushed .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}

//delete MEDIA in Activity
deleteMedia=async(req,res) => {
	const id = req.params.id;
	const idmedia = req.params.idmedia;
	activitys.findOneAndUpdate(id,{$pull:{media :{_id : idmedia}}, new: true, upsert: true})
	.then(data =>{
		res.json({
			success: true,
			message: 'Activity media ' +id +' sucessfully deleted .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}

//update media in Activity
updateMedia=async(req,res) => {
	const id = req.params.id;
	const idmedia =req.params.idmedia;
	activitys.findOneAndUpdate({_id:id ,media : {
		$elemMatch:{
			_id:idmedia
		}
	}},{ $set :{'media.$': req.body}})
	.then(data =>{
		res.json({
			success:true,
			message: 'Activity  ' +id +' sucessfully updated .'
		})
	})
	.catch(err=>{
		res.json({
			success: false,
			message : err.message
		})
	})
}
//------------ routes 
router.get('',getAllActivities)
router.get('/:id',getActivityById)
router.post('',addActivity)
router.delete('/:id',deleteActivityById)
router.delete('',deleteAllActivities)
router.put('/:id',updateActivity)

//helpers
router.get('/:id/guests',getAllGuests)
router.get('/:id/processes',getAllProcesses)
router.get('/:id/childActivities',getAllChildActivities)
router.get('/:id/participants',getAllParticipants)
router.get('/:id/sponsors',getAllSponsors)
router.get('/:id/media',getAllMedia)
router.get('/:id/teams',getAllTeams)
//---- crud gest
router.put('/:id/guests/:idguest/update',updateGuestInActivity)
router.put('/:id/guests/:idguest/delete',deleteGuestInActivity)
router.put('/:id/guests/add',addNewGuestToActivity)
//---- crud tags
router.put('/:id/tag/update/:valueTag/:newValue',updateTagInActivity)
router.put('/:id/tag/delete/:valueTag',deleteTag)
router.put('/:id/tag/add/:value',addTag)
//---- crud process
router.put('/:id/processes/:idprocesses/update',updateProcess)
router.put('/:id/processes/:idprocesses/delete',deleteProcess)
router.put('/:id/processes/add',addProcess)
//---- crud ChildActivity
router.put('/:id/childActivities/:idchildActivities/update',updateChildActivity)
router.put('/:id/childActivities/:idchildActivities/delete',deleteChildActivity)
router.put('/:id/childActivities/add',addChildActivity)
//---- crud Participants
router.put('/:id/participants/:idparticipants/update',updateParticipants)
router.put('/:id/participants/:idparticipants/delete',deleteParticipant)
router.put('/:id/participants/add',addParticipant)
//---- crud sponsor
router.put('/:id/sponsors/:idsponsors/update',updateSponsor)
router.put('/:id/sponsors/:idsponsors/delete',deleteSponsor)
router.put('/:id/sponsors/add',addSponsor)
//---- crud Team
router.put('/:id/teams/:idteam/update',updateTeam)
router.put('/:id/teams/:idteam/delete',deleteTeam)
router.put('/:id/teams/add',addTeam)
//---- crud Media
router.put('/:id/media/:idmedia/update',updateMedia)
router.put('/:id/media/:idmedia/delete',deleteMedia)
router.put('/:id/media/add',addMedia)

module.exports = router