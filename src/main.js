
const Crawler = require('./crawler');
const DB = require('./db');
const FundParser = require('./fundparser');
const DateFormat = require('dateformat');
const Util = require('util');

const c = new Crawler({
    // maxConnections : 10,
    rateLimit: 1000,
    callback : function (error, res, done) {
        if (error) {
            console.error(error);
        } else {
            const funds = FundParser.parse(res.body);
            const filepath = DateFormat(new Date(), 'yyyy/mm/dd') + '/' + res.options['type'] + '.json';
            DB.write(funds, filepath);
        }
        done();
    }
});

const rankUri = 'http://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=%s&rs=&gs=0&sc=zzf&st=desc&pi=1&pn=10000&dx=1'

// 全部
c.queue({
    uri: Util.format(rankUri, 'all'),
    type: 'all'
});

// 股票型
c.queue({
    uri: Util.format(rankUri, 'gp'),
    type: 'gupiao'
});

// 混合型
c.queue({
    uri: Util.format(rankUri, 'hh'),
    type: 'hunhe'
});

// 债券型
c.queue({
    uri: Util.format(rankUri, 'zq'),
    type: 'zhaiquan'
});

// 指数型
c.queue({
    uri: Util.format(rankUri, 'zs'),
    type: 'zhishu'
});

// QDII
c.queue({
    uri: Util.format(rankUri, 'qdii'),
    type: 'qdii'
});

// LOF
c.queue({
    uri: Util.format(rankUri, 'lof'),
    type: 'lof'
});

// FOF
c.queue({
    uri: Util.format(rankUri, 'fof'),
    type: 'fof'
});
