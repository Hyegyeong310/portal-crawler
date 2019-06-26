const AWS = require("aws-sdk");
const cheerio = require("cheerio");
const dynamoose = require("dynamoose");
const got = require('got');

AWS.config.update({region: "ap-northeast-2"});

const PortalKeyword = dynamoose.model('PotalKeyword', {
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

exports.crawler = async function (event, context, callback) {
    try {
        let naverKeywords = [];
        let daumKeywords = [];
        
        const result = await Promise.all([
            got('https://naver.com'),
            got('http://daum.net')
            
        ]);
        const createdAt = new Date().toISOString();
        
        const naverContent = result[0].body;
        const daumContent = result[1].body;
        
        const $naver = cheerio.load(naverContent);
        const $daum = cheerio.load(daumContent);
        
        $naver('.ah_l').filter((i, el) => {
            return i === 0;
        }).find('.ah_item').each((i, el) => {
            if(i >= 20) return;
            const keyword = $naver(el).find('.ah_k').text();
            naverKeywords.push({rank: i+1, keyword});
        });
        
        $daum('.rank_cont').find('.link_issue[tabindex=-1]').each((i, el) => {
            const keyword = $daum(el).text();
            daumKeywords.push({rank: i+1, keyword});
        });
        
        console.log({
            naver: naverKeywords,
            daum: daumKeywords
        });
        
        return callback(null, "success");
    } catch(err) {
        callback(err);
    }
}