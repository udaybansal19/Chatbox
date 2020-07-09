const _ = require('lodash');
const url = 'http://localhost:8080/conf/';

describe('Test', function () {
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

  before (async function () {
    //startPage(p1,p2,done);
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
    }
  });

  await page1.goto(url);
  await page2.goto(url);

  await page1.waitFor(4000);
  await page2.waitFor(4000);
  });

  after (async function () {
    await page1.close();
    await page2.close();
  });

  it('Two way connection is working', async function () {
    expect(p1.id).to.eql(p2.connectedTo);
  });
  it('Two way connection is working', async function () {
    expect(p2.id).to.eql(p1.connectedTo);
  });

});

var pages = new Array();

describe('Routing Table Test', function () {

  before ( done => {
    startPage();
    startPage()
      .then( () => {
        setTimeout(() => {
          done();
        }, 10000);
      });
  });

  after (async function () {
    // await page1.close();
    // await page2.close();
  });

  it('Two way connection is working', async function () {
    expect(pages[0].id).to.eql(pages[1].connectedTo);
  });
  it('Two way connection is working', async function () {
    expect(pages[1].id).to.eql(pages[0].connectedTo);
  });

});

async function startPage() {
      var page;
      page = await browser.newPage();
      pageObj = {
        id: null,
        connectedTo: null,
        page: page
      };
      pages.push(pageObj);
      var i = pages.length - 1;
      pages[i].page.on('console', message => {
        var msg = message.text();
        msg = _.trimStart(msg, '%c ');
        msg = _.trimEnd(msg, ' color:Chartreuse');
        if(_.startsWith(msg, 'My id')){
          pages[i].page.id = _.trimStart(msg, 'My id is ');
        }
        if(_.startsWith(msg, 'WebRTC Connected')){
          pages[i].page.connectedTo = _.trimStart(msg, 'WebRTC Connected with ');
        }
      });
      await pages[i].page.goto(url);
}