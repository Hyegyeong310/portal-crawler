const dynamoose = require("dynamoose");

exports.PortalKeyword = dynamoose.model('PotalKeyword', {
    portal: {
        type: String,
        hashKey: true
    },
    createdAt: {
        type: String,
        rangeKey: true
    },
    keywords: {
        type: Array
    }
}, {
    create: false
});