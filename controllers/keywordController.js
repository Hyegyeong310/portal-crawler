const got = require('got');
const cheerio = require("cheerio");

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
    } catch(err) {
        console.error(err);
    }
}