/**
 * @name exports.getSchedule
 * @static
 * @summary Schedule resolver.
 */

const { getHealthcareService } = require("../healthcareservice/resolver");
const { getPatient } = require('../patient/resolver');
const { getDevice } = require('../device/resolver');
const { getGroup } = require('../group/resolver');
const { getLocation } = require('../location/resolver');
const { getPractitioner } = require('../practitioner/resolver');
const { getPractitionerRole } = require('../practitionerrole/resolver');
const { getRelatedPerson } = require('../relatedperson/resolver');
const { getOrganization } = require('../organization/resolver');
const moment = require('moment-timezone');

const resolverFunc = (root, schedule, context, info) => {
    schedule._id = {id : schedule._id.toString()};
    if(schedule.actor) {
        for(let i = 0; i < schedule.actor.length; i ++){
            let actorRec = schedule.actor[i].split('/')[0];
            let actorArgs = { identifier : schedule.actor[i].split('/')[1]};

            schedule.actor[i] = actorRec === 'Patient'
                ?   getPatient(root, actorArgs , context, info)
                :   actorRec === 'HealthcareService'
                ?   getHealthcareService(root, actorArgs , context, info)
                :   actorRec === 'Location'
                ?   getLocation(root, actorArgs , context, info)
                :   actorRec === 'Device'
                ?   getDevice(root, actorArgs , context, info)
                :   actorRec === 'Practitioner'
                ?   getPractitioner(root, actorArgs , context, info)
                :   actorRec === 'PractitionerRole'
                ?   getPractitionerRole(root, actorArgs , context, info)
                :   getRelatedPerson(root, actorArgs , context, info)
        }
    }
    return schedule;
}
 module.exports.getSchedule = function getSchedule(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db, data;
    const collection = db.collection('Schedule');
    // const collection = db.collection('Schedule');
    // console.log("args for schedule", args);
    let mongoArgs = args.date ? {resourceType: "Schedule", "actor": {$regex : args.actor}, $or: [{"planningHorizon.start": {$regex:args.date}}, {"planningHorizon.end": {$regex:args.date}}]} : {resourceType: "Schedule", "identifier.id": args.identifier};
	return new Promise ((resolve,reject) => {
		collection.findOne(mongoArgs,(err, schedule) => {
		// collection.findOne({$or : [{resourceType: "Schedule", "identifier.id": args.identifier, "planningHorizon.start": args.date} ]},(err, schedule) => {
            // console.log("schedules are", schedule);
            if (schedule != null) {
                data = resolverFunc(root, schedule, context, info);
                resolve(data)
            } else {
                if (schedule === null) {
                    resolve()
                    // reject(new Error('No matching schedule record found'))
                } else {
                    reject(new Error(`Error occurred in fetching schedule, ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.getScheduleList
 * @static
 * @summary Schedule list resolver.
 */
module.exports.getScheduleList = function getScheduleList(
	root,
	args,
	context = {},
	info,
) {
    let { server, version, req, res } = context;
    let db = server.db, data;
    const collection = db.collection('Schedule')
    // console.log("args for schedule", args)
    // const collection = db.collection('Schedule')
	return new Promise ((resolve, reject) => {
        // collection.find({resourceType: "Schedule", "actor": args.actor, "planningHorizon.start": {$gte: moment(args.date).utc().startOf('day').format()}}).toArray((err, scheduleArray) => {
        collection.find({resourceType: "Schedule", "actor": args.actor, "planningHorizon.start": {$gte: moment(args.date+"T00:00:00Z", "YYYY-MM-DDTHH:mm:ssZ").utc().startOf('day').format()}}).toArray((err, scheduleArray) => {
            // console.log("scheduleArray ", scheduleArray)
            if (scheduleArray.length > 0 ) {
                let array = []
                for (let i = 0; i < scheduleArray.length; i++) {
                    data = resolverFunc(root, scheduleArray[i], context, info);
                    array.push({resource: data})
                }
                resolve({entry: array})
            } else {
                if (scheduleArray.length === 0) {
                    resolve({entry: []})
                    // reject(new Error('No matching schedule records found'))
                } else {
                    reject(new Error(`Error occurred in fetching schedule list, ${err}`))
                }
            }
        })
    });
};

/**
 * @name exports.getScheduleInstance
 * @static
 * @summary Schedule instance resolver.
 */
module.exports.getScheduleInstance = function getScheduleInstance(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};

/**
 * @name exports.createSchedule
 * @static
 * @summary Create Schedule resolver.
 */
module.exports.createSchedule = function createSchedule(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db;
	const collection = db.collection('Schedule');

	return new Promise ((resolve,reject) => {
		collection.insertOne(args.resource, (err, schedule) => {
            let scheduleRec = JSON.parse(JSON.stringify(schedule.ops));
            scheduleRec[0]._id = {id: scheduleRec[0]._id};
            let schedRec = scheduleRec[0];

            if (schedRec != null) {
                data = resolverFunc(root, schedRec, context, info);
                resolve(data);
            } else {
                if (schedRec === null) {
                    reject(new Error('Error in inserting'))
                } else {
                    reject(new Error(`Some error occurred , ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.updateSchedule
 * @static
 * @summary Update Schedule resolver.
 */
module.exports.updateSchedule = function updateSchedule(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db;
	const collection = db.collection('Schedule');

	return new Promise ((resolve,reject) => {
		collection.replaceOne({"identifier.id": args.id}, args.resource, (err, schedule) => {
            let scheduleRec = JSON.parse(JSON.stringify(schedule.ops));
            scheduleRec[0]._id = {id: scheduleRec[0]._id};
            let schedRec = scheduleRec[0];

            if (schedRec != null) {
                data = resolverFunc(root, schedRec, context, info);
                resolve(data);
            } else {
                if (schedRec === null) {
                    reject(new Error('Error in inserting'))
                } else {
                    reject(new Error(`Some error occurred , ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.removeSchedule
 * @static
 * @summary Remove Schedule resolver.
 */
module.exports.removeSchedule = function removeSchedule(
	root,
	args,
	context = {},
	info,
) {
    let { server, version, req, res } = context;
    let db = server.db;
	const collection = db.collection("Schedule");
	return new Promise ((resolve,reject) => {
		collection.deleteOne({"identifier.id": args.id},(err, schedule) => {
            let data = {resourceType : "Schedule"}
            resolve(data);
		})
	});
};
