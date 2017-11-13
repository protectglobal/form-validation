import { Restivus } from 'meteor/nimble:restivus';
import { EJSON } from 'meteor/ejson';
import _ from 'lodash';

//------------------------------------------------------------------------------
// CONFIGURE FIRST VERSION OF THE API:
//------------------------------------------------------------------------------
/**
* @see {@link https://github.com/kahmali/meteor-restivus}
*/
const ApiV1 = new Restivus({
  apiPath: 'api/',
  version: 'v1',
  enableCors: true,
  useDefaultAuth: false,
  prettyJson: true,
  defaultOptionsEndpoint: {
    action() {
      this.response.writeHead(201, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      });
      this.done();
      return {
        status: 'success',
        data: {
          message: 'We love OPTIONS',
        },
      };
    },
  },
});

//------------------------------------------------------------------------------
// MOCK INSERT CUSTOMER END-POINT:
//------------------------------------------------------------------------------
/**
* @api {post} /mock-insert-customer - Mock insert customer endpoint from admin app
* Authentication is NOT required.
* @apiName Mock Insert Customer
* @apiGroup Customers
*
* @apiExample {curl} Example usage:
* curl -H "Content-Type: application/json"
* -X POST -d '{"name":"John Smith","postalCode":"XXXX", "phoneNumber": "5434554", "email": "email@example.com"}'
* http://localhost:3000/api/v1/MOCK-insert-customer/
*
* @apiPermission none
*
* @apiParam {String} name (required)
* @apiParam {String} postalCode (required)
* @apiParam {String} phoneNumber (required)
* @apiParam {String} email (required)
*
* @apiSuccess {String} Assignee installer data.
*
* @apiSuccessExample Success-Response:
* statusCode: 200,
* body: {
*   status: 'success',
*   message: ${installer},
* },
*
* @apiError Required fields.
*
* @apiErrorExample Error-Response:
* statusCode: 404,
* body: {
*   status: 'fail',
*   message: err.reason, // string
* },
*/
ApiV1.addRoute('mock-insert-customer', { authRequired: false }, {
  post: {
    roleRequired: [],
    action() {
      // Console log params
      console.log('API mock-insert-customer this.bodyParams', this.bodyParams);

      // Destructure
      const { name, postalCode, phoneNumber, email, ipAddress } = this.bodyParams;

      // Ensure string
      const newCustomer = {
        name: (name && String(name).trim()) || '',
        postalCode: (postalCode && String(postalCode).trim()) || '',
        phoneNumber: (phoneNumber && String(phoneNumber).trim()) || '',
        email: (email && String(email).trim()) || '',
        ipAddress: (ipAddress && String(ipAddress).trim()) || '',
      };

      /* const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      }; */

      // const TEST_TYPE = 'fail1'; // status: 'fail', some error
      // const TEST_TYPE = 'fail2'; // status field isn't present on response
      // const TEST_TYPE = 'fail3'; // message field isn't present on response
      // const TEST_TYPE = 'fail4'; // statusCode === 400
      // const TEST_TYPE = 'success1'; // default installer, all fields present
      // const TEST_TYPE = 'success2'; // default installer, missing field
      // const TEST_TYPE = 'success3'; // custom installer, all fields present
      const TEST_TYPE = 'success4'; // custom installer, missing field

      if (TEST_TYPE === 'fail1') {
        return {
          // headers
          statusCode: 200,
          body: {
            status: 'fail',
            message: 'some error',
          },
        };
      }

      if (TEST_TYPE === 'fail2') {
        return {
          statusCode: 200,
          body: {
            message: 'some error',
          },
        };
      }

      if (TEST_TYPE === 'fail3') {
        return {
          statusCode: 200,
          body: {
            status: 'success',
          },
        };
      }

      if (TEST_TYPE === 'fail4') {
        return {
          statusCode: 400,
          body: {
            status: 'fail',
            message: 'some error',
          },
        };
      }

      const defaultInstaller = {
        logo: 'https://res.cloudinary.com/dxot4z4ma/image/upload/v1507557255/lkljbxmzudzwn8mulm7b.jpg',
        companyName: 'PROTECT UK Riverside Chambers',
        city: 'Derby',
        postalCode: 'DE1 3AF',
        addressOne: 'Riverside Chambers',
        addressTwo: 'Full Street',
        phoneNumber: '08447 705461',
        email: 'matt.cox@protectglobal.co.uk',
      };

      const customInstaller = {
        logo: 'https://res.cloudinary.com/dxot4z4ma/image/upload/v1507294459/csyxxuaq4sh3kguqpxg0.jpg',
        companyName: 'HESIS',
        city: 'Liverpool',
        postalCode: 'L3 4BJ',
        addressOne: 'Unit 303 Century Building',
        addressTwo: 'Tower Street',
        phoneNumber: '0151 707 3234',
        email: 'info@hesis.co.uk',
      };

      if (TEST_TYPE === 'success1') {
        return {
          statusCode: 200,
          body: {
            status: 'success',
            message: EJSON.stringify(Object.assign({}, defaultInstaller), { indent: true }),
          },
        };
      }

      if (TEST_TYPE === 'success2') {
        // phoneNumber is missing in defaultInstaller!
        return {
          statusCode: 200,
          body: {
            status: 'success',
            message: EJSON.stringify(Object.assign({}, _.omit(defaultInstaller, 'phoneNumber')), { indent: true }),
          },
        };
      }

      if (TEST_TYPE === 'success3') {
        return {
          statusCode: 200,
          body: {
            status: 'success',
            message: EJSON.stringify(Object.assign({}, customInstaller), { indent: true }),
          },
        };
      }

      if (TEST_TYPE === 'success4') {
        // email is missing in customInstaller!
        return {
          statusCode: 200,
          body: {
            status: 'success',
            message: EJSON.stringify(Object.assign({}, _.omit(customInstaller, 'email')), { indent: true }),
          },
        };
      }
    },
  },
});
