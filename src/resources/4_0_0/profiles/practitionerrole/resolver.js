const { getOrganization, getOrganizationList, getOrganizationInstance, createOrganization, updateOrganization, removeOrganization } = require('../organization/resolver');
const { getPractitioner, getPractitionerList, getPractitionerInstance, createPractitioner, updatePractitioner, removePractitioner } = require('../practitioner/resolver');
const { getLocation, getLocationInstance, getLocationList, createLocation, updateLocation, removeLocation } = require('../location/resolver')
const { getHealthcareService, getHealthcareServiceInstance, getHealthcareServiceList, createHealthcareService, updateHealthcareService, removeHealthcareService } = require('../healthcareservice/resolver');

const resolverFunc = (root, practitionerRole, context, info) => {
    practitionerRole._id = {id : practitionerRole._id.toString()};

    if(practitionerRole.practitioner){
        let practitionerRef = { identifier : practitionerRole.practitioner.split('/')[1]}
        practitionerRole.practitioner = getPractitioner(root, practitionerRef , context, info)
    }

    if(practitionerRole.organization){
        let orgRef = { identifier : practitionerRole.organization.split('/')[1]}
        practitionerRole.organization = getOrganization(root, orgRef , context, info)
    }

    if(practitionerRole.location){
        for(let i = 0; i < practitionerRole.location.length; i++){
            let locId = practitionerRole.location[i].split('/')[1];
            let locIdArgs = { identifier: locId };
            practitionerRole.location[i] = getLocation(root, locIdArgs , context, info)
        }
    }

    if(practitionerRole.healthcareService){
        for(let i = 0; i < practitionerRole.healthcareService.length; i++){
            let locId = practitionerRole.healthcareService[i].split('/')[1];
            let locIdArgs = { identifier: locId };
            practitionerRole.healthcareService[i] = getHealthcareService(root, locIdArgs , context, info)
        }
    }
    return practitionerRole;
}

/**
 * @name exports.getPractitionerRole
 * @static
 * @summary PractitionerRole resolver.
 */
module.exports.getPractitionerRole = function getPractitionerRole(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db, data;
	const collection = db.collection('PractitionerRole');
	return new Promise ((resolve,reject) => {
		collection.findOne({"identifier.id": args.identifier},(err, practitionerRole) => {
            if (practitionerRole != null) {
                data = resolverFunc(root, practitionerRole, context, info);
                resolve(data)
            } else {
                if (practitionerRole === null) {
                    resolve()
                    // reject(new Error('No matching practitioner role record found'))
                } else {
                    reject(new Error(`Error occurred in fetching practitioner role, ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.getPractitionerRoleList
 * @static
 * @summary PractitionerRole list resolver.
 */
module.exports.getPractitionerRoleList = function getPractitionerRoleList(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db, data;
    var collection = db.collection('PractitionerRole');
	return  new Promise ((resolve, reject) => {
        collection.find({"resourceType" : "PractitionerRole", "specialty.coding.display": args.specialty}).toArray((err, practitionerRoleArray) => {
            if (practitionerRoleArray.length > 0) {
                let array = []
                for (let i = 0; i < practitionerRoleArray.length; i++) {
                    data = resolverFunc(root, practitionerRoleArray[i], context, info);
                    array.push({resource: data})
                }
                resolve({entry: array})
            } else {
                if (practitionerRoleArray.length === 0) {
                    resolve({entry: []})
                    // reject(new Error('No matching practitioner role records found'))
                } else {
                    reject(new Error(`Error occurred in fetching practitioner role list, ${err}`))
                }
            }
        })
    });
};

/**
 * @name exports.getPractitionerRoleInstance
 * @static
 * @summary PractitionerRole instance resolver.
 */
module.exports.getPractitionerRoleInstance = function getPractitionerRoleInstance(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};

/**
 * @name exports.createPractitionerRole
 * @static
 * @summary Create PractitionerRole resolver.
 */
module.exports.createPractitionerRole = function createPractitionerRole(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db;
	const collection = db.collection('PractitionerRole');
	return new Promise ((resolve,reject) => {
		collection.insertOne(args.resource, (err, practitionerRole) => {
            let practitionerRoleRec = JSON.parse(JSON.stringify(practitionerRole.ops));
            practitionerRoleRec[0]._id = {id: practitionerRoleRec[0]._id};
            let pracRole = practitionerRoleRec[0];

            if (pracRole != null) {
                data = resolverFunc(root, pracRole, context, info);
                resolve(data);
            } else {
                if (pracRole === null) {
                    reject(new Error('Error in inserting'))
                } else {
                    reject(new Error(`Some error occurred , ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.updatePractitionerRole
 * @static
 * @summary Update PractitionerRole resolver.
 */
module.exports.updatePractitionerRole = function updatePractitionerRole(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db;
    const collection = db.collection("PractitionerRole");
	return new Promise ((resolve,reject) => {
		collection.replaceOne({"identifier.id": args.id}, args.resource, (err, practitionerRole) => {
            let practitionerRoleRec = JSON.parse(JSON.stringify(practitionerRole.ops));
            practitionerRoleRec[0]._id = {id: practitionerRoleRec[0]._id};
            let pracRole = practitionerRoleRec[0];

            if (pracRole != null) {
                data = resolverFunc(root, pracRole, context, info);
                resolve(data);
            } else {
                if (pracRole === null) {
                    reject(new Error('Error in updating'))
                } else {
                    reject(new Error(`Some error occurred , ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.removePractitionerRole
 * @static
 * @summary Remove PractitionerRole resolver.
 */
module.exports.removePractitionerRole = function removePractitionerRole(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};
