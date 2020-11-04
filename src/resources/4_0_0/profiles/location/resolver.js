const { getOrganization, getOrganizationList, getOrganizationInstance, createOrganization, updateOrganization, removeOrganization } = require('../organization/resolver');

const resolverFunc = (root, location, context, info) => {
    location._id = {id : location._id.toString()};

    if(location.managingOrganization) {
        let orgRef = { identifier : location.managingOrganization.split('/')[1]}
        location.managingOrganization = getOrganization(root, orgRef , context, info)
    }

    if(location.partOf) {
        let orgRef = { identifier : location.partOf.split('/')[1] }
        location.partOf = getOrganization(root, orgRef , context, info)
    }

    return location;
}

/**
 * @name exports.getLocation
 * @static
 * @summary Location resolver.
 */
module.exports.getLocation = function getLocation(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db, data;
	const collection = db.collection('Location');
	
	return new Promise ((resolve,reject) => {
		collection.findOne({"identifier.id": args.identifier},(err, location) => {
            if (location != null) {
                data = resolverFunc(root, location, context, info);
                resolve(data)
            } else {
                if (location === null) {
                    resolve()
                    // reject(new Error('No matching location record found'))
                } else {
                    reject(new Error(`Error occurred in fetching location, ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.getLocationList
 * @static
 * @summary Location list resolver.
 */
module.exports.getLocationList = function getLocationList(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db, data;
    
    const collection = db.collection("Location");
    return new Promise((resolve, reject) => {
		collection.find({"resourceType" : "Location", "managingOrganization": args.organization}).toArray((err, locationList) => {
            if (locationList.length > 0 ) {
                let array = []
                for (let i = 0; i < locationList.length; i++) {
                    data = resolverFunc(root, locationList[i], context, info);
                    array.push({resource: data})
                }
                resolve({entry: array})
            } else {
                if (locationList.length === 0) {
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
 * @name exports.getLocationInstance
 * @static
 * @summary Location instance resolver.
 */
module.exports.getLocationInstance = function getLocationInstance(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};

/**
 * @name exports.createLocation
 * @static
 * @summary Create Location resolver.
 */
module.exports.createLocation = function createLocation(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db, data;
	const collection = db.collection('Location');
	
	return new Promise ((resolve,reject) => {
		collection.insertOne(args.resource, (err, location) => {
            let locationRec = JSON.parse(JSON.stringify(location.ops));
            locationRec[0]._id = {id: locationRec[0]._id};
            let locRec = locationRec[0];

            if (locRec != null) {
                data = resolverFunc(root, locRec, context, info);
                resolve(data);
            } else {
                if (locRec === null) {
                    reject(new Error('Error in inserting'))
                } else {
                    reject(new Error(`Some error occurred , ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.updateLocation
 * @static
 * @summary Update Location resolver.
 */
module.exports.updateLocation = function updateLocation(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db, data;
	const collection = db.collection('Location');
	
	return new Promise ((resolve,reject) => {
		collection.replaceOne({"identifier.id": args.id}, args.resource, (err, location) => {
            let locationRec = JSON.parse(JSON.stringify(location.ops));
            locationRec[0]._id = {id: locationRec[0]._id};
            let locRec = locationRec[0];

            if (locRec != null) {
                data = resolverFunc(root, locRec, context, info);
                resolve(data);
            } else {
                if (locRec === null) {
                    reject(new Error('Error in inserting'))
                } else {
                    reject(new Error(`Some error occurred , ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.removeLocation
 * @static
 * @summary Remove Location resolver.
 */
module.exports.removeLocation = function removeLocation(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};
