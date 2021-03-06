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
const DateTimeScalar = require('../scalars/datetime.scalar.js');

/**
 * @name exports
 * @summary OrderResponse Schema
 */
module.exports = new GraphQLObjectType({
	name: 'OrderResponse',
	description: 'Base StructureDefinition for OrderResponse Resource',
	fields: () => ({
		resourceType: {
			type: new GraphQLNonNull(
				new GraphQLEnumType({
					name: 'OrderResponse_Enum_schema',
					values: { OrderResponse: { value: 'OrderResponse' } },
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
		identifier: {
			type: new GraphQLList(require('./identifier.schema.js')),
			description:
				'Identifiers assigned to this order. The identifiers are usually assigned by the system responding to the order, but they may be provided or added to by other systems.',
		},
		request: {
			type: new GraphQLNonNull(
				new GraphQLUnionType({
					name: 'OrderResponserequest_request_Union',
					description: 'A reference to the order that this is in response to.',
					types: () => [require('./order.schema.js')],
					resolveType(data) {
						if (data && data.resourceType === 'Order') {
							return require('./order.schema.js');
						}
					},
				}),
			),
			description: 'A reference to the order that this is in response to.',
		},
		_date: {
			type: require('./element.schema.js'),
			description:
				'The date and time at which this order response was made (created/posted).',
		},
		date: {
			type: DateTimeScalar,
			description:
				'The date and time at which this order response was made (created/posted).',
		},
		who: {
			type: new GraphQLUnionType({
				name: 'OrderResponsewho_who_Union',
				description:
					'The person, organization, or device credited with making the response.',
				types: () => [
					require('./practitioner.schema.js'),
					require('./organization.schema.js'),
					require('./device.schema.js'),
				],
				resolveType(data) {
					if (data && data.resourceType === 'Practitioner') {
						return require('./practitioner.schema.js');
					}
					if (data && data.resourceType === 'Organization') {
						return require('./organization.schema.js');
					}
					if (data && data.resourceType === 'Device') {
						return require('./device.schema.js');
					}
				},
			}),
			description:
				'The person, organization, or device credited with making the response.',
		},
		_orderStatus: {
			type: require('./element.schema.js'),
			description:
				'What this response says about the status of the original order.',
		},
		// valueSetReference: http://hl7.org/fhir/ValueSet/order-status
		orderStatus: {
			type: new GraphQLNonNull(CodeScalar),
			description:
				'What this response says about the status of the original order.',
		},
		_description: {
			type: require('./element.schema.js'),
			description:
				'Additional description about the response - e.g. a text description provided by a human user when making decisions about the order.',
		},
		description: {
			type: GraphQLString,
			description:
				'Additional description about the response - e.g. a text description provided by a human user when making decisions about the order.',
		},
		fulfillment: {
			type: new GraphQLList(
				new GraphQLUnionType({
					name: 'OrderResponsefulfillment_fulfillment_Union',
					description:
						'Links to resources that provide details of the outcome of performing the order; e.g. Diagnostic Reports in a response that is made to an order that referenced a diagnostic order.',
					types: () => [require('./resource.schema.js')],
					resolveType(data) {
						if (data && data.resourceType === 'Resource') {
							return require('./resource.schema.js');
						}
					},
				}),
			),
			description:
				'Links to resources that provide details of the outcome of performing the order; e.g. Diagnostic Reports in a response that is made to an order that referenced a diagnostic order.',
		},
	}),
});
