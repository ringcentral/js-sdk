# RingCentral JavaScript SDK

[![Build Status](https://github.com/ringcentral/ringcentral-js/workflows/CI%20Pipeline/badge.svg?branch=master)](https://github.com/ringcentral/ringcentral-js/actions)
[![Coverage Status](https://coveralls.io/repos/github/ringcentral/ringcentral-js/badge.svg?branch=master)](https://coveralls.io/github/ringcentral/ringcentral-js)
[![Chat](https://img.shields.io/badge/chat-on%20glip-orange.svg)](https://ringcentral.github.io/join-ringcentral/)
[![Twitter](https://img.shields.io/twitter/follow/ringcentraldevs.svg?style=social&label=follow)](https://twitter.com/RingCentralDevs)

The RingCentral Javascript SDK is most often used by the following developers:

* RingCentral customers needing to access data in their account to automate a business process
* RingCentral [ISV partners](https://www.ringcentral.com/partner/isv.html) building and promoting products for RingCentral customers to integrate with an external system or fill a feature gap in the product

Developers use the SDK to build both client and server-side javascript applications that interface with the RingCentral platform. The SDK can assist developers with the following:

* [Send and receive SMS](https://developer.ringcentral.com/api-products/sms)
* [Send and receive fax messages](https://developers.ringcentral.com/fax-api)
* [Create chat and other messaging bots](https://developer.ringcentral.com/api-products/team-messaging)
* [Download and archive call logs and recordings](https://developers.ringcentral.com/overview/call-reporting)
* [Automate account setup & provisioning](https://developers.ringcentral.com/api-reference/provisioning)
* [Access webinar participant data](https://developers.ringcentral.com/guide/webinar)
* [Schedule video meetings](https://developers.ringcentral.com/guide/video/api)

As an emerging leader in the CPaaS industry, the RingCentral platform is also being used by more and more developers as their preferred communications platform for their own product or company. 

## Prerequisites

To use this SDK and access RingCentral APIs, you must:

* be a RingCentral customer, or have signed up for a developer account
* [registered an application](https://developers.ringcentral.com/guide/getting-started/register-app) and acquired a client ID and secret

##### Are you a first-time RingCentral Developer?

If this is your first time building a RingCentral application, we recommend you get started online using our SMS Quick Start guide which will help you get up-and-running in minutes.

* [Get Started Using RingCentral &raquo;](https://developers.ringcentral.com/guide/sms/quick-start)

##### Packages included in this SDK

The RingCentral Javascript SDK contains two packages useful to developers. They are:

- [SDK](sdk). The main SDK package used for calling RingCentral's REST APIs.
- [Subscriptions](subscriptions). An additional SDK to assist developers in subscribing and responding to events via Web Sockets.

**Are you building a client application for RingCentral?**

If you are building a front-end-heavy client application for making and receiving phone call, sending and receiving SMS messages, engaging with team chat, and more, then you may want to take a closer look at [RingCentral Embeddable](https://apps.ringcentral.com/integration/ringcentral-embeddable/latest/), which is designed specifically for those use cases. 

## Installation

The RingCentral Javascript SDK can be installed easily via npm. 

```
npm install @ringcentral/sdk --save
```

Many code samples throughout RingCentral's documentation assume you are using `.env` files to store key values used by your application. To read a `.env` file, we recommend you install the [dotenv](https://www.npmjs.com/package/dotenv) module. We have provided a sample `.env` below for your convenience. You may find some code samples utilize environment variables not included below, requiring you to edit this file according to your needs. 

```
# Core values
RC_SERVER_URL        = 'https://platform.ringcentral.com'
RC_CLIENT_ID         = '<INSERT APP CLIENT ID>'
RC_CLIENT_SECRET     = '<INSERT APP CLIENT SECRET>'

# This credential is used for JWT-grant types
RC_JWT               = ''
```

## Usage

You will find a wide range of code samples throughout our [RingCentral Developer Guide](https://developers.ringcentral.com/guide/), which we recommend you consult as a more complete and relevant code sample. However, the following code sample can help you get a sense of how the SDK works at a high-level and how to connect successfully for the first time.

### Authentication

##### Using a JWT credential

JWT is an ideal authentication method for server-to-server use cases. One can pass a JWT credential to the `login` method to authenticate.

```js
const RC_SDK = require('@ringcentral/sdk').SDK
var rcsdk = new RC_SDK({
    'server':       process.env.RC_SERVER_URL,
    'clientId':     process.env.RC_CLIENT_ID,
    'clientSecret': process.env.RC_CLIENT_SECRET
});
var platform = rcsdk.platform();
platform.login({ 'jwt':  process.env.RC_JWT })
```

##### Setting the access token manually

If your application uses OAuth auth token flow, you may have stored or cached an access token. You can set your access token directly by creating an auth object and calling the `setData()` method.

```js
var platform                  = rcsdk.platform();
var data                      = platform.auth().data();
data.token_type               = "bearer"
data.expires_in               = "your_AccessToken_Expiration"
data.access_token             = "your_AccessToken"
data.refresh_token            = "your_RefreshToken"
data.refresh_token_expires_in = "your_RefreshToken_Expiration"
platform.auth().setData(data)
```

### Making an API call

Once you have successfully authenticated, you can begin making REST API calls using either the `get()`, `post()`, `put()` or `delete()` methods. The following code snippet shows how one can initiate a phone call using the RingOut methodology. 

```js
try {
  var resp = await platform.post('/restapi/v1.0/account/~/extension/~/ring-out', {
    'from': { 'phoneNumber': "<YOUR RINGCENTRAL PHONE NUMBER>" },
    'to':   { 'phoneNumber': "<THE PHONE NUMBER YOU ARE CALLING" },
    'playPrompt': false
  })
  var jsonObj = await resp.json()
  console.log("Call placed. Call status: " + jsonObj.status.callStatus)
} catch (e) {
  console.log("Unable to place a ring-out call.", e.message)
}
```

## Additional resources

* [RingCentral Developer Guide](https://developer.ringcentral.com/api-reference) - a comprehensive set of tutorials to help developers build their first application and to evolve existing applications on the platform. 

* [RingCentral API Reference](https://developer.ringcentral.com/api-reference) - an interactive reference for the RingCentral API that allows developers to make API calls with no code.

* [Document](https://ringcentral.github.io/ringcentral-js/index.html) - an interactive reference for the SDK code documentation.

You are viewing documentation for `4.0.0` release. Follow [this link to see 3.x.x documentation](https://github.com/ringcentral/ringcentral-js/tree/v3).  

## Getting help and support

If you are having difficulty using this SDK, or working with the RingCentral API, please visit our [developer community forums](https://community.ringcentral.com/spaces/144/) for help and to get quick answers to your questions. If you wish to contact the RingCentral Developer Support team directly, please [submit a help ticket](https://developers.ringcentral.com/support/create-case) from our developer website.

## About RingCentral

RingCentral is a leading provider of global enterprise cloud communications and collaboration solutions. More flexible and cost-effective than legacy on-premises systems, RingCentral empowers modern mobile and distributed workforces to communicate, collaborate, and connect from any location, on any device and via any mode. RingCentral provides unified voice, video, team messaging and collaboration, conferencing, online meetings, digital customer engagement and integrated contact center solutions for enterprises globally. RingCentral’s open platform integrates with leading business apps and enables customers to easily customize business workflows.
