import $ from 'jquery'; // DISABLE ON PRODUCTION
// var $ = jQuery.noConflict(); // ENABLE ON PRODUCTION

//------------------------------------------------------------------------------
// FORM CLASS:
//------------------------------------------------------------------------------
// Class constructor
function PGCustomValidationForm() {
  // Store reference of DOM form field elements
  this.form = $('#' + 'ninja_forms_form_32_all_fields_wrap');
  this.formError = $('#' + 'ninja_forms_field_238_error');
  this.name = $('#' + 'ninja_forms_field_234');
  this.nameError = $('#' + 'ninja_forms_field_234_error');
  this.postalCode = $('#' + 'ninja_forms_field_235');
  this.postalCodeError = $('#' + 'ninja_forms_field_235_error');
  this.email = $('#' + 'ninja_forms_field_236');
  this.emailError = $('#' + 'ninja_forms_field_236_error');
  this.phoneNumber = $('#' + 'ninja_forms_field_237');
  this.phoneNumberError = $('#' + 'ninja_forms_field_237_error');
  this.submitBtn = $('#' + 'ninja_forms_field_238');
  this.customerData = {};
  this.errors = [];

  // Default installer data
  this.defaultInstaller = {
    logo: 'https://res.cloudinary.com/dxot4z4ma/image/upload/v1507557255/lkljbxmzudzwn8mulm7b.jpg',
    companyName: 'PROTECT UK Riverside Chambers',
    city: 'Derby',
    postalCode: 'DE1 3AF',
    addressOne: 'Riverside Chambers',
    addressTwo: 'Full Street',
    phoneNumber: '08447 705461',
    email: 'matt.cox@protectglobal.co.uk',
  };
}

// Class methods
PGCustomValidationForm.prototype.handleSubmit = function() {
  var self = this;

  // Check that all element references are reachable
  if (!this.checkElementsLoaded.apply(this)) {
    console.log('At least one of the form elements couldn\'t be found. Check your elements id.');
    return;
  }

  // Log state
  console.log('All form element were loaded correctly!');

  this.getCustomerIP.apply(this);

  // Attach 'click' event listener to submit button
  this.submitBtn.click(function (evt) {
    // Prevent the page to reload
    evt.preventDefault();

    // Log event
    console.log('Submiting form...');

    self.disableFormFields.apply(self);

    self.clearErrors.apply(self);

    self.gatherCustomerData.apply(self);

    self.logCustomerData.apply(self);

    self.checkCustomerData.apply(self);

    // Return handler in case of error
    if (self.errors.length > 0) {

      // Display first error on UI
      var firstError = self.errors[0];
      self.displayErrorOnUI.apply(self, [firstError]);

      // Re-enable form fields
      self.enableFormFields.apply(self);
      return;
    }

    self.trackGAEvent.apply(self);

    // Fire AJAX call
    self.performAJAXCall.apply(self);
  });
}

PGCustomValidationForm.prototype.checkElementsLoaded = function() {
  if (!this.name[0] || !this.postalCode[0] || !this.email[0] || !this.phoneNumber[0] ||
      !this.nameError[0] || !this.postalCodeError[0] || !this.emailError[0] || !this.phoneNumberError[0] ||
      !this.submitBtn[0] || !this.form[0] || !this.formError[0]
    ) {
    return false;
  }
  return true;
}

PGCustomValidationForm.prototype.getCustomerIP = function() {
  // Get user IP address and attach it to user data
  var self = this;

  try {
    // See: https://ipinfo.io/developers
    $.get('https://ipinfo.io', function(response) {
      self.customerData = {
        ipAddress: (response && response.ip) || '',
      };
    }, 'jsonp');
  } catch (exc) {
    console.log('Couldn\'t get user IP', exc);
  }
}

PGCustomValidationForm.prototype.disableFormFields = function() {
  this.name.prop('disabled', true);
  this.postalCode.prop('disabled', true);
  this.email.prop('disabled', true);
  this.phoneNumber.prop('disabled', true);
  this.submitBtn.prop('disabled', true);
}

PGCustomValidationForm.prototype.enableFormFields = function() {
  this.name.prop('disabled', false);
  this.postalCode.prop('disabled', false);
  this.email.prop('disabled', false);
  this.phoneNumber.prop('disabled', false);
  this.submitBtn.prop('disabled', false);
}

PGCustomValidationForm.prototype.clearErrors = function() {
  this.errors = [];
  this.formError.html('');
  this.formError.hide();
  this.nameError.html('');
  this.nameError.hide();
  this.postalCodeError.html('');
  this.postalCodeError.hide();
  this.emailError.html('');
  this.emailError.hide();
  this.phoneNumberError.html('');
  this.phoneNumberError.hide();
}

PGCustomValidationForm.prototype.gatherCustomerData = function() {
  // Gather and sanitize customer data
  this.customerData = {
    name: this.name[0].value.trim() || '',
    postalCode: this.postalCode[0].value.trim() || '',
    email: this.email[0].value.trim() || '',
    phoneNumber: this.phoneNumber[0].value.trim() || '',
    ipAddress: this.customerData.ipAddress.trim() || '',
  };
}

PGCustomValidationForm.prototype.logCustomerData = function() {
  console.log(
    '\nCustomer data:',
    '\nName:', this.customerData.name,
    '\nPostal Code:', this.customerData.postalCode,
    '\nEmail:', this.customerData.email,
    '\nPhone Number:', this.customerData.phoneNumber,
    '\nIP Address:', this.customerData.ipAddress,
  );
}

PGCustomValidationForm.prototype.isValidEmailAddress = function(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  return re.test(email);
}

PGCustomValidationForm.prototype.checkCustomerData = function() {
  if (!this.customerData.name || this.customerData.name.length === 0) {
    this.errors.push({
      elemName: 'name',
      errorMsg: 'Name is required',
    });
  }
  if (this.customerData.name.length > 100) {
    this.errors.push({
      elemName: 'name',
      errorMsg: 'Name is too long, 100 characters max',
    });
  }
  if (!this.customerData.postalCode || this.customerData.postalCode.length === 0) {
    this.errors.push({
      elemName: 'postalCode',
      errorMsg: 'Post code is required',
    });
  }
  if (this.customerData.postalCode.length > 100) {
    this.errors.push({
      elemName: 'postalCode',
      errorMsg: 'Post code is too long, 100 characters max',
    });
  }
  if (this.customerData.postalCode.length < 2) {
    this.errors.push({
      elemName: 'postalCode',
      errorMsg: 'Post code must be at least 2 characters long',
    });
  }
  if (!this.customerData.email || this.customerData.email.length === 0) {
    this.errors.push({
      elemName: 'email',
      errorMsg: 'Email is required',
    });
  }
  if (this.customerData.email.length > 100) {
    this.errors.push({
      elemName: 'email',
      errorMsg: 'Email is too long, 100 characters max',
    });
  }
  if (!this.isValidEmailAddress.apply(this, [this.customerData.email])) {
    this.errors.push({
      elemName: 'email',
      errorMsg: 'Please, provide a valid email address',
    });
  }
  if (!this.customerData.phoneNumber || this.customerData.phoneNumber.length === 0) {
    this.errors.push({
      elemName: 'phoneNumber',
      errorMsg: 'Phone number is required',
    });
  }
  if (this.customerData.phoneNumber.length > 100) {
    this.errors.push({
      elemName: 'phoneNumber',
      errorMsg: 'Phone number is too long, 100 characters max',
    });
  }
}

PGCustomValidationForm.prototype.displayErrorOnUI = function(error) {
  var elemNameError = error.elemName + 'Error';
  var errorMsg = error.errorMsg;

  this[elemNameError].show();
  this[elemNameError].css('color', 'red');
  this[elemNameError].html(errorMsg);
}

PGCustomValidationForm.prototype.trackGAEvent = function() {
  try {
    ga('send', 'event', { eventCategory: 'Contact Form', eventAction: 'Submit', eventLabel: 'Protect My Place Form' });
    window.uetq = window.uetq || [];
    window.uetq.push({ 'ec': 'button', 'ea': 'click', 'el': 'submit', 'ev': '1' });
  } catch (exc) {
    console.log('GA throwed up an error', exc);
  }
}

PGCustomValidationForm.prototype.displayInstaller = function(installer) {
  // Destructure installer's data
  var logo = installer.logo;
  var companyName = installer.companyName;
  var city = installer.city;
  var postalCode = installer.postalCode;
  var addressOne = installer.addressOne;
  var addressTwo = installer.addressTwo || ''; // not required, sanitize field
  var phoneNumber = installer.phoneNumber;
  var email = installer.email;

  this.form.html(
    "<h2>Thank you for your enquiry</h2>" +
    "<p class='thanks-block-header'>Your local installer will be in touch shortly:</p>" +
    "<img class='thanks-block-image' width='250' src='" + logo + "'>" +
    "<p class='thanks-block-name'>" + companyName + "</p>" +
    "<p>" + city  + "</p>" +
    "<p>" + postalCode + "</p>" +
    "<p>" + addressOne + "</p>" +
    "<p>" + addressTwo + "</p>" +
    "<p class='thanks-block-tel'>Tel: " + phoneNumber + "</p>" +
    "<p class='thanks-block-email'>Email: " + email + "</p>"
  );
}

PGCustomValidationForm.prototype.isJsonString = function(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

PGCustomValidationForm.prototype.getJsonObjectOrUndefined = function(input) {
  // In case we receive and object, return the object
  if (input && typeof input === 'object') {
    return input;
  }

  // In case input is a valid JSON string, return the parsed object
  if (input && typeof input === 'string' && this.isJsonString.apply(this, [input])) {
    return JSON.parse(input);
  }

  // Otherwise, the input is invalid
  return;
}

PGCustomValidationForm.prototype.isValidInstaller = function(installer) {
  // Check that all required fields are present and are not empty strings

  if (!installer || typeof installer !== 'object') {
    return false;
  }

  var requiredFields = [
    'logo',
    'companyName',
    'city',
    'postalCode',
    'addressOne',
    // 'addressTwo', // not required
    'phoneNumber',
    'email',
  ];

  var valid = true;
  for (var i = 0; i < requiredFields.length; i++) {
    var fieldValue = installer[requiredFields[i]];
    if (!fieldValue || fieldValue.trim().length === 0) {
      valid = false;
    }
  }

  return valid;
}

PGCustomValidationForm.prototype.handleSuccessAJAXResponse = function(res) {
  console.log('AJAX success response', res);
  var self = this;

  // Sanitize response, get valid JSON object
  var jsonRes = self.getJsonObjectOrUndefined.apply(self, [res]);

  // Make sure response is a valid JSON object, and 'status' and 'message'
  // keys are present
  if (!jsonRes || !jsonRes.status || !jsonRes.message) {
    self.displayInstaller.apply(self, [self.defaultInstaller]);
    // Throw error so that it can be caught by sentry.io
    throw new Error('Sucess response is invalid');
  }

  // Validate status field
  var status = jsonRes.status;
  if (!status || typeof status !== 'string' || (status !== 'success' && status !== 'fail')) {
    self.displayInstaller.apply(self, [self.defaultInstaller]);
    // Throw error so that it can be caught by sentry.io
    throw new Error('Sucess response status is undefined, not string or has an invalid value', status);
  }

  // Handle status = 'fail'
  if (status === 'fail') {
    self.displayInstaller.apply(self, [self.defaultInstaller]);
    // Throw error so that it can be caught by sentry.io
    throw new Error('Sucess response status fail');
  }

  //--------------------------------
  // From here on status = 'success'
  //--------------------------------

  // Sanitize response.message (installer's data), get valid JSON object
  var customInstaller = self.getJsonObjectOrUndefined.apply(self, [jsonRes.message]);

  // Make sure installer is a valid JSON object
  if (!customInstaller) {
    self.displayInstaller.apply(self, [self.defaultInstaller]);
    // Throw error so that it can be caught by sentry.io
    throw new Error('Sucess response.message is invalid');
  }

  // Display custom installer, if and only if, all required fields are present...
  if (self.isValidInstaller.apply(self, [customInstaller])) {
    console.log('Returning custom installer');
    self.displayInstaller.apply(self, [customInstaller]);
    return;
  }

  // Otherwise, return default installer
  self.displayInstaller.apply(self, [self.defaultInstaller]);
  // Throw error so that it can be caught by sentry.io
  throw new Error('Returnning default installer, at least one of the custom installer\'s fields is not present');
}

PGCustomValidationForm.prototype.handleErrorAJAXResponse = function(res) {
  console.log('AJAX error response', res);
  var self = this;

  // If we get an error from the AJAX response, return default installer
  self.displayInstaller.apply(self, [self.defaultInstaller]);
  // Throw error so that it can be caught by sentry.io
  throw new Error('AJAX error response', res);
}

PGCustomValidationForm.prototype.performAJAXCall = function() {
  console.log('Fire AJAX call :)');
  var self = this;

  // Attach action type to customerData for the AJAX call
  var data = self.customerData;
  data.action = 'form_submit';

  $.ajax({
    url: 'http://localhost:3000/api/v1/mock-insert-customer', // DISABLE ON PRODUCTION!
    // url: vars.ajax_url, // ENABLE ON PRODUCTION!
    // crossDomain: true, // DISABLE ON PRODUCTION!
    type: 'post',
    data: data,
    beforeSend: function() {
      self.submitBtn.val('SUBMITTING');
    },
    success: function(res) {
      // res = JSON.stringify(res); // FOR TESTING ONLY
      self.handleSuccessAJAXResponse.apply(self, [res])
    },
    error: function(res) {
      self.handleErrorAJAXResponse.apply(self, [res])
    }
  });
}

//------------------------------------------------------------------------------
// MAIN:
//------------------------------------------------------------------------------
$(document).ready(function() {
  // Log state
  console.log('document ready!');

  var form = new PGCustomValidationForm();

  form.handleSubmit();
});
