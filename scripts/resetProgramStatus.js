const Promise = require('bluebird');
const rp = require('request-promise');

const customerId = require('./utils/conf').get('customerId');
const accountsConfig = require('./utils/conf').get('accounts');
const customersConfig = require('./utils/conf').get('customers');
const documentsConfig = require('./utils/conf').get('documents');
const notificationsConfig = require('./utils/conf').get('notifications');
const investmentsConfig = require('./utils/conf').get('investments');

let accountsRequest = rp.defaults({
  baseUrl: accountsConfig.url,
  json: true,
});

let customersRequest = rp.defaults({
  baseUrl: customersConfig.url,
  json: true,
});

let documentsRequest = rp.defaults({
  baseUrl: documentsConfig.url,
  json: true,
});

let notificationsRequest = rp.defaults({
  baseUrl: notificationsConfig.url,
  json: true,
});

let investmentsRequest = rp.defaults({
  baseUrl: investmentsConfig.url,
  json: true,
});

async function run(){
  //delete all mortgage accounts
  let mortgageAccounts = await accountsRequest.get({
    uri: '/accounts',
    qs: {
      filter: {
        where: {
          customerId,
          type: 'mortgage',
        },
      },
    },
  });
  console.log('found mortgage accounts:');
  console.log(mortgageAccounts);
  await Promise.map(mortgageAccounts, account => accountsRequest.delete({
    uri: `/accounts/${account.id}/transactions`,
  }));
  await Promise.map(mortgageAccounts, account => accountsRequest.delete({
    uri: `/accounts/${account.id}`,
  }));
  console.log(`Deleted ${mortgageAccounts.length} mortgage accounts`);
  //delete all investment accounts
  let investmentAccounts = await accountsRequest.get({
    uri: '/accounts',
    qs: {
      filter: {
        where: {
          customerId,
          type: 'investment',
        },
      },
    },
  });
  console.log('found investment accounts:');
  console.log(investmentAccounts);
  await Promise.map(investmentAccounts, account => accountsRequest.delete({
    uri: `/accounts/${account.id}/transactions`,
  }));
  await Promise.map(investmentAccounts, account => accountsRequest.delete({
    uri: `/accounts/${account.id}`,
  }));
  console.log(`Deleted ${investmentAccounts.length} investment accounts`);
  //delete customerPrograms with name 'homeSavings'
  let customerPrograms = await customersRequest.get({
    uri: '/programs',
    qs: {
      filter: {
        where: {
          customerId,
          name: 'homeSavings',
        },
      },
    },
  });
  console.log('found customer programs:');
  console.log(customerPrograms);
  await Promise.map(customerPrograms, program => customersRequest.delete({
    uri: `/programs/${program.id}`,
  }));
  console.log(`Deleted ${customerPrograms.length} customerPrograms`);
  //delete notifications with type document
  let notifications = await notificationsRequest.get({
    uri: '/notifications',
    qs: {
      filter: {
        where: {
          customerId,
          type: 'document',
        },
      },
    },
  });
  console.log('found notifications:');
  console.log(notifications);
  await Promise.map(notifications, notification => notificationsRequest.delete({
    uri: `/notifications/${notification.id}`,
  }));
  console.log(`Deleted ${notifications.length} notifications`);
  //delete documents with type accountConsent
  let documents = await documentsRequest.get({
    uri: '/documents',
    qs: {
      filter: {
        where: {
          customerId,
          type: 'accountConsent',
        },
      },
    },
  });
  console.log('found documents:');
  console.log(documents);
  await Promise.map(documents, doc => documentsRequest.delete({
    uri: `/documents/${doc.id}`,
  }));
  console.log(`Deleted ${documents.length} documents`);
  //create customerProgram
  await customersRequest.post({
    uri:  '/programs',
    json: {
      customerId,
      name: 'homeSavings',
      data: {},
    }
  })
}

run();