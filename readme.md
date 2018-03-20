# Acme Bank
Verticles that have primarily been dominated by incumbents in the market (ex/ Financial and Healthcare verticles)are being disrupted at faster and faster rates. This is forcing companies in these industries to pursue new strategies to reach market segments with new applications and services that deliver unique user experiences. This holds especially true for millennials, a segment that traditional companies have struggled to connect with. To succeed  companies have to be agile, which is an issue for large legacy companies. Their applications and services tend to be spread out and locked down in traditional on-premesis data centers. This slows digital teams as they look to connect these services and applications together with other Saas offerings to deliver these new user experiences.  

This suite of applications is designed to be a Proof of Concept (PoC) of the [IBM Hybrid Integration Portfolio](https://www.ibm.com/cloud/integration), demonstrating how legacy companies can move from being the disptees to the disrupters in thier market. It contains a number of backend microservices tasked with simulating data from numerous data sources across several cloud providers, highlighting IBMs scalable multi-cloud integration platform. 

It contains a React-Native mobile application that levarages multiple services simulating a multi-cloud application, with services being delivered in the APP from multiple lines of buisness. The application aims at targeting young consumers with an opportunity to enroll in goal based savings programs.

In order to run this application easily from your local machine, the repository is configured to run all services locally with minimal setup. In a true hybrid scenario, you would be interfacing with legacy workloads and microsevices spanning multiple clouds. Please see the image below for an example of how we are running these services and handling their connectivity.

## Setup
 * Simply run `npm install` in each directory to install required dependencies

## Run
 * Open a terminal session for each service included in the project.
 * Run `npm start` within each directory to start each service
 * After starting each service, you can access the mobile application by downloading the Expo Client app on your phone and scanning the provided QR code, or running a mobile simulator on your development machine.

## Services

#### AcmeBank
This application is based on the `react-native` mobile framework. It uses the `expo` platform by default. This allows the application to quickly be run on a mobile device without needing to natively compile it. If you would like to natively compile the code, please read further about 'ejecting' your application [here](https://github.com/react-community/create-react-native-app/blob/master/EJECTING.md).

The default passcode for the application is `1234`. This can be changed by modifying the value in `AcmeBank/config/default.json`.

There is a shortcut in the application's navigation menu that allows you to reset the demo application to its initial state.

#### Accounts
This service provides account, transaction, and product data to power the mobile application.

#### Admin
This service provides a number of 'admin-level' functions to control the demo scenarios. These include adding various types of data and resetting the demo to its initial state.

#### App-Backend
This service handles all API calls to external services from the mobile application. A key thing to note here is the application configuration in `configs/config-base.yaml`. If you intend to run this application in an environment aside from your local machine, you will need to make modifications here regarding your references to the other services.

#### Credit
This service simulates a credit score backend. It captures a collection of credit scores for multiple customers. This allows `App-Backend` to pull latest credit scores for a given customer.

#### Customers
This service holds customer information. This includes customer personal data and program status that allows the mobile application to determine where the user is in their savings journey.

#### Documents
This service is responsible for generating and hosting documents for the end user to review and sign.

#### Investments
This service is responsible for opening investment accounts one the user has signed the required doucments in the mobile application.

#### Notifications
This service is tasked with generating and tracking notifications that are presented to the user in the mobile application.

#### RealEstate
This service simulates connectivity to a external real estate service like [Zillow](https://zillow.com). In order to allow this application to be used out-of-the-box, housing data is loaded into a database -- rather than being queried from an extenal source.

#### Scripts
This folder contains a number of NodeJS scripts which are designed to help manipulate data for use in a demo scenario.

## License
MIT License

## Contributing
Issues and Pull Requests are welcome.
