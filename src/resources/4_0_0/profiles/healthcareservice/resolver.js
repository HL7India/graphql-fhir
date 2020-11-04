const { getOrganization, getOrganizationList, getOrganizationInstance, createOrganization, updateOrganization, removeOrganization } = require('../organization/resolver');
const { getRelatedPerson, getRelatedPersonList, getRelatedPersonInstance, createRelatedPerson, updateRelatedPerson, removeRelatedPerson } = require('../relatedperson/resolver');
const { getPractitioner, getPractitionerList, getPractitionerInstance, createPractitioner, updatePractitioner, removePractitioner } = require('../practitioner/resolver');
const {  getPractitionerRole } = require('../practitionerrole/resolver');
const { getLocation, getLocationList, getLocationInstance, createLocation, updateLocation, removeLocation } = require('../location/resolver');

/**
 * @name exports.getHealthcareService
 * @static
 * @summary HealthcareService resolver.
 */
module.exports.getHealthcareService = function getHealthcareService(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db;
	const collection = db.collection('HealthcareService');
	
	// console.log('args for patient query is ', args);
	return new Promise ((resolve,reject) => {
		collection.findOne({"identifier.id": args.identifier},(err, healthcareService) => {
			if (err) {
				console.log('error in inserting');
			} else {
				// console.log('resolving healthcareService query', healthcareService)
                healthcareService._id = {id : healthcareService._id.toString()};
                if(healthcareService.providedBy) {
                    let orgRef = { identifier : healthcareService.providedBy.split('/')[1]}
                    healthcareService.providedBy = getOrganization(root, orgRef , context, info)
                }
                if(healthcareService.location){
                    for(let i = 0; i < healthcareService.location.length; i++){
                        let orgRef = { identifier : healthcareService.location[i].split('/')[1]}
                        healthcareService.location[i] = getLocation(root, orgRef , context, info)
                    }
                }
                if(healthcareService.coverageArea){
                    for(let i = 0; i < healthcareService.coverageArea.length; i++){
                        let orgRef = { identifier : healthcareService.coverageArea[i].split('/')[1]}
                        healthcareService.coverageArea[i] = getLocation(root, orgRef , context, info)
                    }
                }
				resolve(healthcareService);
			}
		})
	});
};

/**
 * @name exports.getHealthcareServiceList
 * @static
 * @summary HealthcareService list resolver.
 */
module.exports.getHealthcareServiceList = function getHealthcareServiceList(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};

/**
 * @name exports.getHealthcareServiceInstance
 * @static
 * @summary HealthcareService instance resolver.
 */
module.exports.getHealthcareServiceInstance = function getHealthcareServiceInstance(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};

/**
 * @name exports.createHealthcareService
 * @static
 * @summary Create HealthcareService resolver.
 */
module.exports.createHealthcareService = function createHealthcareService(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db;
	const collection = db.collection('HealthcareService');
	return new Promise ((resolve,reject) => {
		collection.insertOne(args.resource, (err, healthcareService) => {
			if (err) {
				console.log('error in inserting');
			} else {
				// console.log("healthcareService is", healthcareService);
				let healthcareServiceRec = JSON.parse(JSON.stringify(healthcareService.ops));
                healthcareServiceRec[0]._id = {id: healthcareServiceRec[0]._id};
                let healthRec = healthcareServiceRec[0];

                if(healthRec.providedBy) {
                    healthRec.providedBy = { resourceType: healthRec.providedBy.split('/')[0], id: healthRec.providedBy.split('/')[1]}
                }

                if(healthRec.location){
                    for( let i = 0; i < healthRec.location.length; i ++){
                        healthRec.location[i] = { resourceType: healthRec.location[i].split('/')[0], id: healthRec.location[i].split('/')[0] };
                    }
                }

                if(healthRec.coverageArea){
                    for( let i = 0; i < healthRec.coverageArea.length; i ++){
                        healthRec.coverageArea[i] = { resourceType: healthRec.coverageArea[i].split('/')[0], id: healthRec.coverageArea[i].split('/')[0] };
                    }
                }

				resolve(healthcareServiceRec[0]);
			}
		})
	});
};

/**
 * @name exports.updateHealthcareService
 * @static
 * @summary Update HealthcareService resolver.
 */
module.exports.updateHealthcareService = function updateHealthcareService(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};

/**
 * @name exports.removeHealthcareService
 * @static
 * @summary Remove HealthcareService resolver.
 */
module.exports.removeHealthcareService = function removeHealthcareService(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};
