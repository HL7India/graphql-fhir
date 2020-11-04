const resolverFunc = (root, practitioner, context, info) => {
    practitioner._id = {id : practitioner._id.toString()};

    if(practitioner.qualification){
        for(let i = 0; i < practitioner.qualification.length; i ++) {
            if(practitioner.qualification[i].issuer) {
                practitioner.qualification[i].issuer = {resourceType: 'Organization', name: practitioner.qualification[i].issuer}
            }
        }
    }
    return practitioner;
}

/**
 * @name exports.getPractitioner
 * @static
 * @summary Practitioner resolver.
 */
module.exports.getPractitioner = function getPractitioner(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db, data;
	const collection = db.collection('Practitioner');

	return new Promise ((resolve,reject) => {
		collection.findOne({"identifier.id": args.identifier},(err, practitioner) => {
            if (practitioner != null) {
                data = resolverFunc(root, practitioner, context, info);
                resolve(data)
            } else {
                if (practitioner === null) {
                    resolve()
                    // reject(new Error('No matching practitioner record found'))
                } else {
                    reject(new Error(`Error occurred in fetching practitioner, ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.getPractitionerList
 * @static
 * @summary Practitioner list resolver.
 */
module.exports.getPractitionerList = function getPractitionerList(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db, data;
    var collection = db.collection('Practitioner');
	return  new Promise ((resolve, reject) => {
        collection.find({"resourceType" : "Practitioner"}).toArray((err, practitionerArray) => {
            if (practitionerArray.length > 0) {
                let array = []
                for (let i = 0; i < practitionerArray.length; i++) {
                    data = resolverFunc(root, practitionerArray[i], context, info);
                    array.push({resource: data})
                }
                resolve({entry: array})
            } else {
                if (practitionerArray.length === null) {
                    resolve({entry: []})
                    // reject(new Error('No matching practitioner records found'))
                } else {
                    reject(new Error(`Error occurred in fetching practitioner list, ${err}`))
                }
            }
        })
    });
};

/**
 * @name exports.getPractitionerInstance
 * @static
 * @summary Practitioner instance resolver.
 */
module.exports.getPractitionerInstance = function getPractitionerInstance(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};

/**
 * @name exports.createPractitioner
 * @static
 * @summary Create Practitioner resolver.
 */
module.exports.createPractitioner = function createPractitioner(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db;
	const collection = db.collection('Practitioner');
	
	return new Promise ((resolve,reject) => {
		collection.insertOne(args.resource, (err, practitioner) => {
            let practitionerRec = JSON.parse(JSON.stringify(practitioner.ops));
            practitionerRec[0]._id = {id: practitionerRec[0]._id};
            let pracRec = practitionerRec[0];

            if (pracRec != null) {
                data = resolverFunc(root, pracRec, context, info);
                resolve(data);
            } else {
                if (pracRec === null) {
                    reject(new Error('Error in inserting'))
                } else {
                    reject(new Error(`Some error occurred , ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.updatePractitioner
 * @static
 * @summary Update Practitioner resolver.
 */
module.exports.updatePractitioner = function updatePractitioner(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db;
	const collection = db.collection('Practitioner');
	return new Promise ((resolve,reject) => {
		collection.replaceOne({"identifier.id": args.id}, args.resource, (err, practitioner) => {
            let practitionerRec = JSON.parse(JSON.stringify(practitioner.ops));
            practitionerRec[0]._id = {id: practitionerRec[0]._id};
            let pracRec = practitionerRec[0];

            if (pracRec != null) {
                data = resolverFunc(root, pracRec, context, info);
                resolve(data);
            } else {
                if (pracRec === null) {
                    reject(new Error('Error in inserting'))
                } else {
                    reject(new Error(`Some error occurred , ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.removePractitioner
 * @static
 * @summary Remove Practitioner resolver.
 */
module.exports.removePractitioner = function removePractitioner(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};
