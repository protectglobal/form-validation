# Validation form for protect-my-place WordPress site using jquery
The aim of this project is two fold. On one hand, create a javascript validation
form for protect-my-place WordPress site. On the other, mock the insert-customer
endpoint response so that we can test the form under diferent AJAX requests.

In development, clone this project and set $.ajax.url to equals
'http://localhost:3000/api/v1/mock-insert-customer'
Then, go to /server/rest-api.js and set different TEST_TYPE values to test how
the form responds to differnt AJAX response values.
