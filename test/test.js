const _ = require('lodash');

describe('sample test', function () {
  it('should work', async function () {
    expect(true).to.be.true;
  });
});

let page1;
let page2;

describe('Connection Test', function () {

  var p1 = {
    id: null,
    connectedTo: null
  };
  var p2 = {
    id: null,
    connectedTo: null
  };

  before (function (done) {
    startPage(p1,p2,done);
    if(p1.id != null && p2.id != null)
      done();
  });

  after (async function () {
    // await page1.close();
    // await page2.close();
  });

  it('Two way connection is working', async function () {
    expect(p1.id).to.eql(p2.connectedTo);
  });

});

async function startPage(p1, p2, done) {
  page1 = await browser.newPage();
  page2 = await browser.newPage();

  page1.on('console', message => {
    var msg = message.text();
    msg = _.trimStart(msg, '%c ');
    msg = _.trimEnd(msg, ' color:Chartreuse');
    if(_.startsWith(msg, 'My id')){
      p1.id = _.trimStart(msg, 'My id is ');
    }
    if(_.startsWith(msg, 'WebRTC Connected')){
      p1.connectedTo = _.trimStart(msg, 'WebRTC Connected with ');
    }
  });
  page2.on('console', message => {
    var msg = message.text();
    msg = _.trimStart(msg, '%c ');
    msg = _.trimEnd(msg, ' color:Chartreuse');
    if(_.startsWith(msg, 'My id')){
      p2.id = _.trimStart(msg, 'My id is ');
    }
    if(_.startsWith(msg, 'WebRTC Connected')){
      p2.connectedTo = _.trimStart(msg, 'WebRTC Connected with ');
      done();
    }
  });

  await page1.goto('http://localhost:8080/conf/');
  await page2.goto('http://localhost:8080/conf/');
}