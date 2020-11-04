/**
 * @name exports.getPatient
 * @static
 * @summary Patient resolver.
 */
module.exports.getPatient = function getPatient(
	root,
	args,
	context = {},
	info,
) {
    let { server, version, req, res } = context;
    let db = server.db;
	const collection = db.collection('Patient');
	return new Promise ((resolve, reject) => {
		collection.findOne({"identifier.id": args.identifier},(err, patient) => {
			if (patient != null) {
                patient._id = {id : patient._id.toString()};
                resolve (patient)
            } else {
                if (patient === null) {
                    reject(new Error('No matching patient record found'))
                } else {
                    reject(new Error(`Error occurred in fetching patient, ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.getPatientList
 * @static
 * @summary Patient list resolver.
 */
module.exports.getPatientList = function getPatientList(
	root,
	args,
	context = {},
	info,
) {
    let { server, version, req, res } = context;
    let db = server.db;
	const collection = db.collection('Patient');
	return new Promise ((resolve,reject) => {
		collection.find({"resourceType": "Patient"}).toArray((err, patientList) => {
            if (patientList.length > 0) {
                let array = []
                for (let i = 0; i < patientList.length; i++) {
                    array.push({resource: patientList[i]})
                }
                resolve({entry: array})
            } else {
                if (patientList.length === 0) {
                    reject(new Error('No matching patient list records found'))
                } else {
                    reject(new Error(`Error occurred in fetching patient list, ${err}`))
                }
            }
		})
	});
};

/**
 * @name exports.getPatientInstance
 * @static
 * @summary Patient instance resolver.
 */
module.exports.getPatientInstance = function getPatientInstance(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};

/**
 * @name exports.createPatient
 * @static
 * @summary Create Patient resolver.
 */
module.exports.createPatient = function createPatient(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db;
	const collection = db.collection('Patient');
	return new Promise ((resolve,reject) => {
		collection.insertOne(args.resource, (err, patient) => {
			if (err) {
				console.log('error in inserting');
			} else {
				
				let patientRec = JSON.parse(JSON.stringify(patient.ops));
                patientRec[0]._id = {id: patientRec[0]._id};

				resolve(patientRec[0]);
			}
		})
	});
};

/**
 * @name exports.updatePatient
 * @static
 * @summary Update Patient resolver.
 */
module.exports.updatePatient = function updatePatient(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	let db = server.db;
	const collection = db.collection("Patient");
	return new Promise ((resolve,reject) => {
		collection.replaceOne({"identifier.id": args.id}, args.resource, (err, patient) => {
			if (err) {
				console.log('error in inserting',err);
			} else {
				let patientRec = JSON.parse(JSON.stringify(patient.ops));
				patientRec[0]._id = {id: patientRec[0]._id};
				resolve(patientRec[0]);
			}
		})
	});
};

/**
 * @name exports.removePatient
 * @static
 * @summary Remove Patient resolver.
 */
module.exports.removePatient = function removePatient(
	root,
	args,
	context = {},
	info,
) {
	let { server, version, req, res } = context;
	return {};
};
