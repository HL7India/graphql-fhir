/**
 * @name exports.getSlot
 * @static
 * @summary Slot resolver.
 */
const { getSchedule } = require('../schedule/resolver');
const moment = require('moment-timezone');

const resolverFunc = (root, slot, context, info) => {
    slot._id = {id : slot._id.toString()};

    if(slot.schedule) {
        let scheduleArgs = {identifier: slot.schedule.split('/')[1]}
        slot.schedule = getSchedule(root, scheduleArgs , context, info)
    }
    return slot;
}
module.exports.getSlot = function getSlot(root, args, context = {}, info) {
	let { server, version, req, res } = context;
	let db = server.db, data;
	const collection = db.collection('Slot');
	// const collection = db.collection('Slot');
	
	return new Promise ((resolve,reject) => {
		collection.findOne({"identifier.id": args.identifier},(err, slot) => {
            if (slot != null) {
                data = resolverFunc(root, slot, context, info);
                resolve(data)
            } else {
                if (slot === null) {
                    resolve()
                    // reject(new Error('No matching slot record found'))
                } else {
                    reject(new Error(`Error occurred in fetching slot, ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.getSlotList
 * @static
 * @summary Slot list resolver.
 */
module.exports.getSlotList = function getSlotList(
	root,
	args,
	context = {},
	info,
) {
    let { server, version, req, res } = context;
    let db = server.db, data;
    const collection = db.collection('Slot');
    // const collection = db.collection('Slot');
    // console.log("args for slots", args)
    let searchCriteria = args.schedule ? {"resourceType" : "Slot", schedule: `Schedule/${args.schedule}`} : {"resourceType" : "Slot", "identifier.id": {$regex: args.identifier}, "start": {$gte: moment(args.start).utc().startOf('day').format()}}
    // let searchCriteria = args.schedule ? {"resourceType" : "Slot", "identifier.id": {$regex: args.identifier}, schedule: args.schedule} : {"resourceType" : "Slot", "identifier.id": {$regex: args.identifier}, "start": {$gte: args.start}}
	return new Promise ((resolve, reject) => {
        collection.find(searchCriteria).toArray((err, slotListArray) => {
            // console.log("slotListArray", slotListArray)
            if (slotListArray.length > 0 ) {
                let array = []
                for (let i = 0; i < slotListArray.length; i++) {
                    data = resolverFunc(root, slotListArray[i], context, info);
                    array.push({resource: data})
                }
                resolve({entry: array})
            } else {
                if (slotListArray.length === 0) {
                    resolve({entry: []})
                    // reject(new Error('No matching slot records found'))
                } else {
                    reject(new Error(`Error occurred in fetching slot list, ${err}`))
                }
            }
        })
    })
};

/**
 * @name exports.getSlotInstance
 * @static
 * @summary Slot instance resolver.
 */
module.exports.getSlotInstance = function getSlotInstance(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};

/**
 * @name exports.createSlot
 * @static
 * @summary Create Slot resolver.
 */
module.exports.createSlot = function createSlot(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
    let db = server.db;
    // console.log("db in slot is", db)
    const collection = db.collection('Slot');
    // console.log("args in slotcreate", args)
	return new Promise ((resolve,reject) => {
        // console.log("trying to insert slot")
		collection.insertOne(args.resource, (err, slot) => {
            // console.log("error in creating slot", err)
            // console.log("slot created", JSON.stringify(slot.ops))
            let slotRec = JSON.parse(JSON.stringify(slot.ops));
            slotRec[0]._id = {id: slotRec[0]._id};
            let slotRecord = slotRec[0];

            if (slotRecord != null) {
                data = resolverFunc(root, slotRecord, context, info);
                resolve(data);
            } else {
                if (slotRecord === null) {
                    reject(new Error('Error in inserting'))
                } else {
                    reject(new Error(`Some error occurred , ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.updateSlot
 * @static
 * @summary Update Slot resolver.
 */
module.exports.updateSlot = function updateSlot(
	root,
	args,
	context = {},
	info,
) {
    let { server, version, req, res } = context;
    let db = server.db, data;
	const collection = db.collection("Slot")
	return new Promise ((resolve,reject) => {
		collection.replaceOne({"identifier.id": args.id}, args.resource, (err, slot) => {
            let slotRec = JSON.parse(JSON.stringify(slot.ops));
            slotRec[0]._id = {id: slotRec[0]._id};
            let slotRecord = slotRec[0];

            if (slotRecord != null) {
                data = resolverFunc(root, slotRecord, context, info);
                resolve(data);
            } else {
                if (slotRecord === null) {
                    reject(new Error('Error in inserting'))
                } else {
                    reject(new Error(`Some error occurred , ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.removeSlot
 * @static
 * @summary Remove Slot resolver.
 */
module.exports.removeSlot = function removeSlot(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
    let db = server.db, data;
	const collection = db.collection("Slot");
	return new Promise ((resolve,reject) => {
		collection.deleteOne({"identifier.id": args.id},(err, slot) => {
            let data = {resourceType : "Slot", status: 'free'}
            resolve(data);
		})
	});
};
