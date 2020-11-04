const resolverFunc = (root, organization, context, info) => {
    organization._id = {id : organization._id.toString()};

    if(organization.partOf) {
        let orgRef = { identifier : organization.partOf.split('/')[1] }
        organization.partOf = getOrganization(root, orgRef , context, info)
    }

    return organization;
}

/**
 * @name exports.getOrganization
 * @static
 * @summary Organization resolver.
 */
module.exports.getOrganization = function getOrganization(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db, data;
    
    const collection = db.collection("Organization");
    return new Promise((resolve, reject) => {
		collection.findOne({"identifier.id": args.identifier},(err, organization) => {
            if (organization != null) {
                data = resolverFunc(root, organization, context, info);
                resolve(data)
            } else {
                if (organization === null) {
                    resolve()
                    // reject(new Error('No matching organization record found'))
                } else {
                    reject(new Error(`Error occurred in fetching organization, ${err}`))
                }
            }
		})
	})
};

/**
 * @name exports.getOrganizationList
 * @static
 * @summary Organization list resolver.
 */
module.exports.getOrganizationList = function getOrganizationList(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db, data;
    const collection = db.collection("Organization");
    return new Promise((resolve, reject) => {
		collection.find({"resourceType" : "Organization", "type.coding.display": args.type}).toArray((err, organizationList) => {
            if (organizationList.length > 0 ) {
                let array = []
                for (let i = 0; i < organizationList.length; i++) {
                    data = resolverFunc(root, organizationList[i], context, info);
                    array.push({resource: data})
                }
                resolve({entry: array})
            } else {
                if (organizationList.length === 0) {
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
 * @name exports.getOrganizationInstance
 * @static
 * @summary Organization instance resolver.
 */
module.exports.getOrganizationInstance = function getOrganizationInstance(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};

/**
 * @name exports.createOrganization
 * @static
 * @summary Create Organization resolver.
 */
module.exports.createOrganization = function createOrganization(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db, data;
	const collection = db.collection("Organization");
	return new Promise ((resolve,reject) => {
		collection.insertOne(args.resource, (err, organization) => {
            let organizationRec = JSON.parse(JSON.stringify(organization.ops));
            organizationRec[0]._id = {id: organizationRec[0]._id};
            let orgRec = organizationRec[0];

            if (orgRec != null) {
                data = resolverFunc(root, orgRec, context, info);
                resolve(data);
            } else {
                if (orgRec === null) {
                    reject(new Error('Error in inserting'))
                } else {
                    reject(new Error(`Some error occurred , ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.updateOrganization
 * @static
 * @summary Update Organization resolver.
 */
module.exports.updateOrganization = function updateOrganization(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db, data;
    
	const collection = db.collection("Organization");
	return new Promise ((resolve,reject) => {
		collection.replaceOne({"identifier.id": args.id}, args.resource, (err, organization) => {
            let organizationRec = JSON.parse(JSON.stringify(organization.ops));
            organizationRec[0]._id = {id: organizationRec[0]._id};
            let orgRec = organizationRec[0];

            if (orgRec != null) {
                data = resolverFunc(root, orgRec, context, info);
                resolve(data);
            } else {
                if (orgRec === null) {
                    reject(new Error('Error in inserting'))
                } else {
                    reject(new Error(`Some error occurred , ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.removeOrganization
 * @static
 * @summary Remove Organization resolver.
 */
module.exports.removeOrganization = function removeOrganization(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};
