# rdrct

rdrct is a URL shortener and redirection service.

## Quick start

To run rdrct, the simplest option is to do so using Docker. For that, first you have to build the Docker image:

```shell
$ docker build -t rdrct .
```

Once the build has been successfully completed, run the Docker image using the following command. Please note that you have to provide some values for the environment variables `API_USERNAME` and `API_PASSWORD`:

```shell
$ docker run \
    -d \
    -p 3000:3000 \
    -e API_USERNAME=<username> \
    -e API_PASSWORD=<password> \
    --name rdrct \
    rdrct
```

The most common interaction is following a redirect. For that, send a `GET` request to rdrct and provide the `key` of the desired redirect as path, e.g.:

```
GET http://localhost:3000/tnw
```

Depending on how the redirect has been configured, you will either be redirected permanently (`301`) or temporarily (`307`). If the key you provide does not exist, you get a `404`.

### Interacting with the API

For managing the redirects, rdrct provides an API. To connect to this API you always have to send the username and the password you set when you started the Docker image using the `API_USERNAME` and `API_PASSWORD` environment variables.

*Please note that rdrct uses HTTP basic authentication, which does not encrypt the credentials in any way. This will leak your credentials to anyone who is able to intercept the traffic between your client and the server. While this is fine for running things locally while developing or trying things out, never run it like this in production. Make sure to always run it behind a reverse proxy that acts as a TLS endpoint in order to run things securely!*

### Getting all redirects

To get a list of all existing redirects, send a `GET` request to the `/api/redirects` route.

### Adding redirects

To add a new redirect, send a `POST` request to the `/api/add-redirect` route, and provide the data for the desired redirect in the request body. The request body must match the following JSON schema:

```json
{
  "type": "object",
  "properties": {
    "key": { "type": "string", "minLength": 1 },
    "url": { "type": "string", "minLength": 1, "format": "uri" },
    "type": { "type": "string", "enum": [ "permanent", "temporary" ]}
  },
  "required": [ "key", "url", "type" ],
  "additionalProperties": false
}
```

If the redirect was added successfully, you get back the redirect's newly created `id`. If it already existed, you will get a `409`.

### Removing redirects

To remove a redirect, send a `POST` request to the `/api/remove-redirect` route, and provide the key of the redirect in the request body. The request body must match the following JSON schema:

```json
{
  "type": "object",
  "properties": {
    "key": { "type": "string", "minLength": 1 }
  },
  "required": [ "key" ],
  "additionalProperties": false
}
```

If the redirect was removed successfully, you get back a `200`. If the redirect could not be found, you will get a `404`.

## Running quality assurance

To run quality assurance for this module use [roboter](https://www.npmjs.com/package/roboter):

```shell
$ npx roboter
```
