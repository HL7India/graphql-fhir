const { getPatient } = require('../patient/resolver');
const { getPractitioner } = require('../practitioner/resolver');
const { getPractitionerRole } = require('../practitionerrole/resolver');
const { getRelatedPerson } = require('../relatedperson/resolver');
const { getHealthcareService } = require('../healthcareservice/resolver');
const { getLocation } = require('../location/resolver');
const { getImmunizationRecommendation } = require('../immunizationrecommendation/resolver');
const { getObservation } = require('../observation/resolver');
const { getProcedure } = require('../procedure/resolver');
const { getCondition } = require('../condition/resolver');
const { getSlot } = require('../slot/resolver');
const { getDevice } = require('../device/resolver');
const { getServiceRequest } = require('../servicerequest/resolver');
const moment = require('moment-timezone')

/**
 * @name exports.getAppointment
 * @static
 * @summary Appointment resolver.
 */
var ObjectId = require('mongodb').ObjectID;

const resolverFunc = (root, appointment, context, info) => {
    appointment._id && (appointment._id = {id : appointment._id.toString()});

    if(appointment.basedOn) {
        for(let i = 0; i < appointment.basedOn.length; i ++) {
            let patRefRec = appointment.basedOn[i].split('/')[0];
            let patRefArgs = { identifier: appointment.basedOn[i].split('/')[1] };
            appointment.basedOn[i] = getServiceRequest(root, patRefArgs , context, info)
       } 
    }

    if(appointment.reasonReference){
        for(let i = 0; i < appointment.reasonReference.length; i ++) {
             let patRefRec = appointment.reasonReference[i].split('/')[0];
             let patRefArgs = { identifier: appointment.reasonReference[i].split('/')[1] };
             appointment.reasonReference[i] = patRefRec === 'Condition'
                 ?   getCondition(root, patRefArgs , context, info)
                 :   patRefRec === 'Procedure'
                 ?   getProcedure(root, patRefArgs , context, info)
                 :   patRefRec === 'Observation'
                 ?   getObservation(root, patRefArgs , context, info)
                 :   getImmunizationRecommendation(root, patRefArgs , context, info)
        } 
     }

     if(appointment.slot){
         for( let i = 0; i < appointment.slot.length; i ++) {
             let slotArgs = { identifier: appointment.slot[i].split('/')[1]}
             // let slotArgs = { identifier: appointment.slot[i].split('/')[1]}
            //  console.log("slot args in appointment resolver", appointment.slot, slotArgs)
             appointment.slot[i] = getSlot(root, slotArgs , context, info)
         }
     }

     if(appointment.participant){
         for(let i = 0; i < appointment.participant.length; i++) {
             if(appointment.participant[i].actor){
                 let appointRefRec = appointment.participant[i].actor.split('/')[0];
                 let appointRefArgs = { identifier: appointment.participant[i].actor.split('/')[1] }
                 // let appointRefArgs = { identifier: appointment.participant[i].actor.split('/')[1] }
                 appointment.participant[i].actor = appointRefRec === 'Patient'
                     ?   getPatient(root, appointRefArgs , context, info)
                     :   appointRefRec === 'Practitioner'
                     ?   getPractitioner(root, appointRefArgs , context, info)
                     :   appointRefRec === 'PractitionerRole'
                     ?   getPractitionerRole(root, appointRefArgs , context, info)
                     :   appointRefRec === 'RelatedPerson'
                     ?   getRelatedPerson(root, appointRefArgs , context, info)
                     :   appointRefRec === 'Device'
                     ?   getDevice(root, appointRefArgs , context, info)
                     :   appointRefRec === 'HealthcareService'
                     ?   getHealthcareService(root, appointRefArgs , context, info)
                     :   getLocation(root, appointRefArgs , context, info)
             }
         }
     }

     return appointment;
}

module.exports.getAppointment = function getAppointment(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db, data;
	const collection = db.collection("Appointments");
	
	return new Promise((resolve, reject) => {
		collection.findOne({"identifier.id": args.identifier},(err, appointment) => {
            if (appointment != null) {
                data = resolverFunc(root, appointment, context, info);
                resolve(data)
            } else {
                if (appointment === null) {
                    resolve()
                    // reject(new Error('No matching appointment record found'))
                } else {
                    reject(new Error(`Error occurred in fetching appointment, ${err}`))
                }
            }
		})
	})
};

/**
 * @name exports.getAppointmentList
 * @static
 * @summary Appointment list resolver.
 */
module.exports.getAppointmentList = function getAppointmentList(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
    let db = server.db;
    var collection = db.collection('Appointments');
    // console.log("args for appointment2", args, moment(args.date).utc().startOf('day').format())
    // console.log("appointment time", moment(args.date+"T00:00:00Z", "YYYY-MM-DDTHH:mm:ssZ").utc().startOf('day').format())               
    let searchCriteria

    if(args.patient && args.status === 'fulfilled') {
        searchCriteria = {"resourceType" : "Appointment", "participant.actor": args.patient, "start": {$lt: moment(args.date).utc().startOf('day').format()}, "status": {$ne: "cancelled"}, "serviceCategory.coding.code": args.service_category}
    } else if (args.practitioner) {
        searchCriteria = {"resourceType" : "Appointment", "participant.actor": args.practitioner, "start": {$gte: moment(args.date+"T00:00:00Z", "YYYY-MM-DDTHH:mm:ssZ").utc().startOf('day').format()}, "end": {$lt: moment(args.date+"T23:59:00Z", "YYYY-MM-DDTHH:mm:ssZ").utc().endOf('day').format()}} //past dates show cancelled too
        // searchCriteria = {"resourceType" : "Appointment", "participant.actor": args.practitioner, "start": {$gte: moment(args.date+"T00:00:00Z", "YYYY-MM-DDTHH:mm:ssZ").utc().startOf('day').format()}, "end": {$lt: moment(args.date+"T23:59:00Z", "YYYY-MM-DDTHH:mm:ssZ").utc().endOf('day').format()}, "serviceCategory.coding.code": args.service_category} //past dates show cancelled too
        // searchCriteria = {"resourceType" : "Appointment", "participant.actor": args.practitioner, "start": {$gte: moment(args.date).utc().startOf('day').format()}, "end": {$lt: moment(args.date).utc().endOf('day').format()}} //past dates show cancelled too
    } else if (args.actor && args.actor.includes('Location')) {
        searchCriteria = {"resourceType" : "Appointment", "participant.actor": args.actor, "start": {$gte: moment(args.date+"T00:00:00Z", "YYYY-MM-DDTHH:mm:ssZ").utc().startOf('day').format()}, "end": {$lt: moment(args.date+"T23:59:00Z", "YYYY-MM-DDTHH:mm:ssZ").utc().endOf('day').format()}, "serviceCategory.coding.code": args.service_category} //past dates show cancelled too
        // searchCriteria = {"resourceType" : "Appointment", "participant.actor": args.practitioner, "start": {$gte: moment(args.date).utc().startOf('day').format()}, "end": {$lt: moment(args.date).utc().endOf('day').format()}} //past dates show cancelled too
    } else {
        searchCriteria = {"resourceType" : "Appointment", "start": {$gte: moment(args.date).utc().startOf('day').format()}, "participant.actor": args.identifier, "serviceCategory.coding.code": args.service_category} //dont show fulfilled for today or upcoming
    }

    // console.log("searchCriteria", searchCriteria)
    return new Promise ((resolve,reject) => {
	
		collection.find(searchCriteria).toArray((err, appointmentArray) => {
		// collection.find({"resourceType" : "Appointment", start: startCriteria, "identifier.id": {$regex: args.identifier}}).toArray((err, appointmentArray) => {
            // console.log("getappointment list", appointmentArray)
            if (appointmentArray!=undefined && appointmentArray.length > 0 ) {
                let array = []
                for (let i = 0; i < appointmentArray.length; i++) {
                    data = resolverFunc(root, appointmentArray[i], context, info);
                    array.push({resource: data})
                }
                resolve({entry: array})
            } else {
                if (appointmentArray.length === 0) {
                    resolve({entry: []})
                } else {
                    reject(new Error(`Error occurred in fetching appointment list, ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.getAppointmentInstance
 * @static
 * @summary Appointment instance resolver.
 */
module.exports.getAppointmentInstance = function getAppointmentInstance(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};

/**
 * @name exports.createAppointment
 * @static
 * @summary Create Appointment resolver.
 */
module.exports.createAppointment = function createAppointment(
	root,
	args,
	context = {},
	info,
) {
	
	let { server, version, req, res } = context;

	let db = server.db;
	const collection = db.collection("Appointments");
	return new Promise ((resolve,reject) => {
		collection.insertOne(args.resource, (err, appointment) => {

            let appointmentRec = JSON.parse(JSON.stringify(appointment.ops));
            appointmentRec[0]._id = {id: appointmentRec[0]._id};
            let appointRec = appointmentRec[0];

            if (appointRec != null) {
                data = resolverFunc(root, appointRec, context, info);
                resolve(data);
            } else {
                if (appointRec === null) {
                    reject(new Error('Error in inserting'))
                } else {
                    reject(new Error(`Some error occurred , ${err}`))
                }
            }
		})
	});
};


/**
 * @name exports.updateAppointment
 * @static
 * @summary Update Appointment resolver.
 */
module.exports.updateAppointment = function updateAppointment(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db;
	
	const collection = db.collection("Appointments");
	return new Promise ((resolve,reject) => {
		collection.replaceOne({"identifier.id": args.id}, args.resource, (err, appointment) => {
            let appointmentRec = JSON.parse(JSON.stringify(appointment.ops));
            appointmentRec[0]._id = {id: appointmentRec[0]._id};
            let appointRec = appointmentRec[0];

            if (appointRec != null) {
                data = resolverFunc(root, appointRec, context, info);
                resolve(data);
            } else {
                if (appointRec === null) {
                    reject(new Error('Error in inserting'))
                } else {
                    reject(new Error(`Some error occurred , ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.removeAppointment
 * @static
 * @summary Remove Appointment resolver.
 */
module.exports.removeAppointment = function removeAppointment(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};
