import DomStorage from 'dom-storage';
import fetch, {Request, Response, Headers} from 'node-fetch';
import {setDefaultExternals} from './SDK';

export * from './SDK';

// Create a new instance of DomStorage for localStorage with strict mode enabled.
const localStorage = new DomStorage(null, {strict: true});

// Set default externals for the application.
setDefaultExternals({
    localStorage, // LocalStorage instance.
    fetch, // Fetch function for making HTTP requests.
    Request, // Request constructor for creating HTTP requests.
    Response, // Response constructor for handling HTTP responses.
    Headers, // Headers constructor for working with HTTP headers.
});
