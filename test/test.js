const _ = require('lodash');
const url = 'http://localhost:8080/conf/';

describe('Test', function () {
  it('should work', async function () {
    expect(true).to.be.true;
  });
});

var pages = new Array();

describe('Connection Test', function () {

  before ( done => {
    startPage();
    startPage()
      .then( () => {
        done();
      });
  });

  after (async function () {
    await pages[0].page.close();
    await pages[1].page.close();
    pages = new Array();
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