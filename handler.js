const got = require('got');
const cheerio = require("cheerio");
const dynamoose = require("dynamoose");

const AWS = require("aws-sdk");

AWS.config.update({region: "ap-northeast-2"});

