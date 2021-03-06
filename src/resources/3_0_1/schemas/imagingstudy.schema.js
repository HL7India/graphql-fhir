const {
	GraphQLNonNull,
	GraphQLEnumType,
	GraphQLList,
	GraphQLUnionType,
	GraphQLString,
	GraphQLObjectType,
} = require('graphql');
const IdScalar = require('../scalars/id.scalar.js');
const UriScalar = require('../scalars/uri.scalar.js');
const CodeScalar = require('../scalars/code.scalar.js');
const OidScalar = require('../scalars/oid.scalar.js');
const DateTimeScalar = require('../scalars/datetime.scalar.js');
const UnsignedIntScalar = require('../scalars/unsignedint.scalar.js');

/**
 * @name exports
 * @summary ImagingStudy Schema
 */
module.exports = new GraphQLObjectType({
	name: 'ImagingStudy',
	description: 'Base StructureDefinition for ImagingStudy Resource',
	fields: () => ({
		resourceType: {
			type: new GraphQLNonNull(
				new GraphQLEnumType({
					name: 'ImagingStudy_Enum_schema',
					values: { ImagingStudy: { value: 'ImagingStudy' } },
				}),
			),
			description: 'Type of resource',
		},
		_id: {
			type: require('./element.schema.js'),
			description:
				'The logical id of the resource, as used in the URL for the resource. Once assigned, this value never changes.',
		},
		id: {
			type: IdScalar,
			description:
				'The logical id of the resource, as used in the URL for the resource. Once assigned, this value never changes.',
		},
		meta: {
			type: require('./meta.schema.js'),
			description:
				'The metadata about the resource. This is content that is maintained by the infrastructure. Changes to the content may not always be associated with version changes to the resource.',
		},
		_implicitRules: {
			type: require('./element.schema.js'),
			description:
				'A reference to a set of rules that were followed when the resource was constructed, and which must be understood when processing the content.',
		},
		implicitRules: {
			type: UriScalar,
			description:
				'A reference to a set of rules that were followed when the resource was constructed, and which must be understood when processing the content.',
		},
		_language: {
			type: require('./element.schema.js'),
			description: 'The base language in which the resource is written.',
		},
		// valueSetReference: http://hl7.org/fhir/ValueSet/languages
		language: {
			type: CodeScalar,
			description: 'The base language in which the resource is written.',
		},
		text: {
			type: require('./narrative.schema.js'),
			description:
				"A human-readable narrative that contains a summary of the resource, and may be used to represent the content of the resource to a human. The narrative need not encode all the structured data, but is required to contain sufficient detail to make it 'clinically safe' for a human to just read the narrative. Resource definitions may define what content should be represented in the narrative to ensure clinical safety.",
		},
		contained: {
			type: new GraphQLList(require('./resourcelist.schema')),
			description:
				'These resources do not have an independent existence apart from the resource that contains them - they cannot be identified independently, and nor can they have their own independent transaction scope.',
		},
		extension: {
			type: new GraphQLList(require('./extension.schema.js')),
			description:
				'May be used to represent additional information that is not part of the basic definition of the resource. In order to make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer is allowed to define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension.',
		},
		modifierExtension: {
			type: new GraphQLList(require('./extension.schema.js')),
			description:
				'May be used to represent additional information that is not part of the basic definition of the resource, and that modifies the understanding of the element that contains it. Usually modifier elements provide negation or qualification. In order to make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer is allowed to define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.',
		},
		_uid: {
			type: require('./element.schema.js'),
			description: 'Formal identifier for the study.',
		},
		uid: {
			type: new GraphQLNonNull(OidScalar),
			description: 'Formal identifier for the study.',
		},
		accession: {
			type: require('./identifier.schema.js'),
			description:
				'Accession Number is an identifier related to some aspect of imaging workflow and data management. Usage may vary across different institutions.  See for instance [IHE Radiology Technical Framework Volume 1 Appendix A](http://www.ihe.net/uploadedFiles/Documents/Radiology/IHE_RAD_TF_Rev13.0_Vol1_FT_2014-07-30.pdf).',
		},
		identifier: {
			type: new GraphQLList(require('./identifier.schema.js')),
			description: 'Other identifiers for the study.',
		},
		_availability: {
			type: require('./element.schema.js'),
			description: 'Availability of study (online, offline, or nearline).',
		},
		// valueSetReference: http://hl7.org/fhir/ValueSet/instance-availability
		availability: {
			type: CodeScalar,
			description: 'Availability of study (online, offline, or nearline).',
		},
		// valueSetReference: http://hl7.org/fhir/ValueSet/dicom-cid29
		modalityList: {
			type: new GraphQLList(require('./coding.schema.js')),
			description:
				'A list of all the Series.ImageModality values that are actual acquisition modalities, i.e. those in the DICOM Context Group 29 (value set OID 1.2.840.10008.6.1.19).',
		},
		patient: {
			type: new GraphQLNonNull(
				new GraphQLUnionType({
					name: 'ImagingStudypatient_patient_Union',
					description: 'The patient imaged in the study.',
					types: () => [require('./patient.schema.js')],
					resolveType(data) {
						if (data && data.resourceType === 'Patient') {
							return require('./patient.schema.js');
						}
					},
				}),
			),
			description: 'The patient imaged in the study.',
		},
		context: {
			type: new GraphQLUnionType({
				name: 'ImagingStudycontext_context_Union',
				description:
					'The encounter or episode at which the request is initiated.',
				types: () => [
					require('./encounter.schema.js'),
					require('./episodeofcare.schema.js'),
				],
				resolveType(data) {
					if (data && data.resourceType === 'Encounter') {
						return require('./encounter.schema.js');
					}
					if (data && data.resourceType === 'EpisodeOfCare') {
						return require('./episodeofcare.schema.js');
					}
				},
			}),
			description:
				'The encounter or episode at which the request is initiated.',
		},
		_started: {
			type: require('./element.schema.js'),
			description: 'Date and time the study started.',
		},
		started: {
			type: DateTimeScalar,
			description: 'Date and time the study started.',
		},
		basedOn: {
			type: new GraphQLList(
				new GraphQLUnionType({
					name: 'ImagingStudybasedOn_basedOn_Union',
					description:
						'A list of the diagnostic requests that resulted in this imaging study being performed.',
					types: () => [
						require('./referralrequest.schema.js'),
						require('./careplan.schema.js'),
						require('./procedurerequest.schema.js'),
					],
					resolveType(data) {
						if (data && data.resourceType === 'ReferralRequest') {
							return require('./referralrequest.schema.js');
						}
						if (data && data.resourceType === 'CarePlan') {
							return require('./careplan.schema.js');
						}
						if (data && data.resourceType === 'ProcedureRequest') {
							return require('./procedurerequest.schema.js');
						}
					},
				}),
			),
			description:
				'A list of the diagnostic requests that resulted in this imaging study being performed.',
		},
		referrer: {
			type: new GraphQLUnionType({
				name: 'ImagingStudyreferrer_referrer_Union',
				description: 'The requesting/referring physician.',
				types: () => [require('./practitioner.schema.js')],
				resolveType(data) {
					if (data && data.resourceType === 'Practitioner') {
						return require('./practitioner.schema.js');
					}
				},
			}),
			description: 'The requesting/referring physician.',
		},
		interpreter: {
			type: new GraphQLList(
				new GraphQLUnionType({
					name: 'ImagingStudyinterpreter_interpreter_Union',
					description:
						'Who read the study and interpreted the images or other content.',
					types: () => [require('./practitioner.schema.js')],
					resolveType(data) {
						if (data && data.resourceType === 'Practitioner') {
							return require('./practitioner.schema.js');
						}
					},
				}),
			),
			description:
				'Who read the study and interpreted the images or other content.',
		},
		endpoint: {
			type: new GraphQLList(
				new GraphQLUnionType({
					name: 'ImagingStudyendpoint_endpoint_Union',
					description:
						'The network service providing access (e.g., query, view, or retrieval) for the study. See implementation notes for information about using DICOM endpoints. A study-level endpoint applies to each series in the study, unless overridden by a series-level endpoint with the same Endpoint.type.',
					types: () => [require('./endpoint.schema.js')],
					resolveType(data) {
						if (data && data.resourceType === 'Endpoint') {
							return require('./endpoint.schema.js');
						}
					},
				}),
			),
			description:
				'The network service providing access (e.g., query, view, or retrieval) for the study. See implementation notes for information about using DICOM endpoints. A study-level endpoint applies to each series in the study, unless overridden by a series-level endpoint with the same Endpoint.type.',
		},
		_numberOfSeries: {
			type: require('./element.schema.js'),
			description:
				'Number of Series in the Study. This value given may be larger than the number of series elements this Resource contains due to resource availability, security, or other factors. This element should be present if any series elements are present.',
		},
		numberOfSeries: {
			type: UnsignedIntScalar,
			description:
				'Number of Series in the Study. This value given may be larger than the number of series elements this Resource contains due to resource availability, security, or other factors. This element should be present if any series elements are present.',
		},
		_numberOfInstances: {
			type: require('./element.schema.js'),
			description:
				'Number of SOP Instances in Study. This value given may be larger than the number of instance elements this resource contains due to resource availability, security, or other factors. This element should be present if any instance elements are present.',
		},
		numberOfInstances: {
			type: UnsignedIntScalar,
			description:
				'Number of SOP Instances in Study. This value given may be larger than the number of instance elements this resource contains due to resource availability, security, or other factors. This element should be present if any instance elements are present.',
		},
		procedureReference: {
			type: new GraphQLList(
				new GraphQLUnionType({
					name: 'ImagingStudyprocedureReference_procedureReference_Union',
					description: 'A reference to the performed Procedure.',
					types: () => [require('./procedure.schema.js')],
					resolveType(data) {
						if (data && data.resourceType === 'Procedure') {
							return require('./procedure.schema.js');
						}
					},
				}),
			),
			description: 'A reference to the performed Procedure.',
		},
		// valueSetReference: http://hl7.org/fhir/ValueSet/procedure-code
		procedureCode: {
			type: new GraphQLList(require('./codeableconcept.schema.js')),
			description: 'The code for the performed procedure type.',
		},
		// valueSetReference: http://hl7.org/fhir/ValueSet/procedure-reason
		reason: {
			type: require('./codeableconcept.schema.js'),
			description:
				'Description of clinical condition indicating why the ImagingStudy was requested.',
		},
		_description: {
			type: require('./element.schema.js'),
			description:
				'Institution-generated description or classification of the Study performed.',
		},
		description: {
			type: GraphQLString,
			description:
				'Institution-generated description or classification of the Study performed.',
		},
		series: {
			type: new GraphQLList(require('./imagingstudyseries.schema.js')),
			description:
				'Each study has one or more series of images or other content.',
		},
	}),
});
