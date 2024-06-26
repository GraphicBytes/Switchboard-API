# CLOUD SWITCHBOARD API #

**VERSION**
1.0.0 alpha

**AUTHORS**

  - Darren Morley

**CONTRIBUTING DEVELOPERS**

  - n/a

## ABOUT

Switchboard is a REST-ful API/Microservice.

Switchboard is responsible for handling the following areas of functionality

- 3rd party API connection management
- 3rd party API data push handling
- 3rd party API data fetch handling
- Socket functionality

## DEPLOYMENT

This API is launched via Docker containerization using a `docker-compose.yml` file. Environment files are used to separate deployment environments. The main ENV files and CLI commands are:

*note: Please use the "tools.sh" shell script instead of these commands, see below*

`docker-compose --env-file ./env/dev.env up`

`docker-compose --env-file ./env/stage.env up`

`docker-compose --env-file ./env/production.env up`

## TOOLS SCRIPT

**This repo contains a shell script to help manage this repo and docker container**

`sh tools.sh`

This shell script will give you 12 options

`1. Cancel/Close`

`2. Pull changes`

This option will pull the latest updates for the current git branch

`3. Start/Reboot docker container with dev.env`

This will boot up the API in development mode for beta testing

`4. Start/Reboot docker container with stage.env`

This will boot up the API in staging mode for alpha testing

`5. Start/Reboot docker container with production.env`

This will boot up the API in production mode

`6. View console log output`

This will show the live docker logs output, useful for debugging but are disabled in production mode.

`7. Git push changes to current branch`

This will push changes to the current branch while also offering an option to leave comment.

`8. Git merge Main to Staging`

This will merge the current Main branch into Staging when ready for Alpha testing

`9. Git merge Staging to Production`

This will merge the current Staging branch into Production

`10. Checkout Main branch`

This will switch to the Main branch

`11. Checkout Staging branch`

This will switch to the Staging branch

`12. Checkout Production branch`

This will switch to the Production branch

## MAIN REPO BRANCHES

This API follows a development -> staging -> production flow focused on the following git repo branches

**Main**

Latest beta testing build *(All development work should be done on this branch, or forked and re-merged with this branch before moving onto staging.)* 

**Staging**

Latest alpha testing build

**Production**

Latest production build

## DOCKER STACK

`Node.js FROM node:20.11.1-slim`

`MongoDB FROM mongo:7.0.5`

`mongo-express FROM mongo-express:1.0.2-20`

`redis-cache FROM redis:7.2.4`

## NODE.JS DEPENDENCIES

`express ^4.16.4`

`mongoose ^5.4.10`

`bcrypt ^5.1.1`

`multer ^1.4.5-lts.1`

`cors ^2.8.5`

`axios ^1.6.7`

`xmlrpc ^1.3.2`

`lodash ^4.17.21` 

## SCALE EXPECTATIONS

### OPTIMAL PERFORMANCE

For optimal performance the API is intended to launch as a cluster, ideally 1 cluster fork per CPU thread.

### Short Term/Early Lifespan

Expecting:

- Data Storage Needs - **Light**
- CPU Needs - **Light**
- Memory Needs - **Light**
- hosting solution needed - **Shared hosting via docker.**

Minimum requirements:

- 2 CPU THREADS
- 4 GB RAM
- 20 GB SSD-SPEED STORAGE

### Long Term/Heavy Load

For long term or high traffic usage, this API will require dedicated hosting resources. 

- *Data Storage Needs* - **Light,** This API will be unlikely to consume large amounts of storage.
- *CPU Needs* - **Light,** This API is unlikely to become CPU intensive.
- *Memory Needs* - **Light,**, This API will be unlikely to consume large amounts of system memory.

Minimum requirements:

- 2+ CPU THREADS
- 4+ GB RAM
- 20+ GB (or more) SSD-SPEED STORAGE 

## MAIN REST-FUL API RESPONSE ###

Every request made to the server, good or bad, will return a JSON object. Every request will contain 2 core child objects alongside the individual  handler return data.

`qry: 1:0 `

**0:** request failed

**1:** request accepted

`msg:{} `

*msg* will return as an empty object unless the backend needs to communicate an error or warning to the front end. Which will be structured as follows

`{ (int)code : (string)"message", (int)code : (string)"message", (int)code : (string)"message" }`

Error and Warning codes are detailed per api end-point bellow.

## END POINTS AND USAGE ###

### SYSTEM END POINTS

**get platform theme and api data**

`POST /push-event RETURNS json`

This is the end point the other APIs use when they wish to emit a socket event.

*ERRORS*:

`0: unknown error`

### MESSAGE RESPONSE MASTER LIST

`0: unknown error`

## Change Log

### v1.0.0
- Launch with core functionality for core user functions, auth, login, session management as to original spec agreed.

