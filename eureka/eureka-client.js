'use strict'

const Eureka = require('eureka-js-client').Eureka;

const client = new Eureka({
  instance: {
    instanceId: 'mock-service-01',
    app: 'mock-service',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    preferIpAddress: true, // default is false and host will be used.
    homePageUrl: 'http://localhost:7300',
    statusPageUrl: 'http://localhost:7300/info',
    // healthCheckUrl: 'http://localhost:3001/info',
    port: {
      '$': 3001,
      '@enabled': 'true',
    },
    vipAddress: 'mock-service', // Important, otherwise spring-apigateway cannot find instance of book-service
    // secureVipAddress: 'book-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    fetchRegistry: false,
    host: '10.8.1.202',
    port: 10100,
    servicePath: '/eureka/apps/'
  },
});
client.logger.level('debug');

module.exports = client;
