const _ = require('lodash');
const { expect } = require('chai');
const url = 'http://localhost:8080/conf/';

describe('Test', function () {
  it('should work', async function () {
    expect(true).to.be.true;
  });
});

async function startPage() {
  var page;

  page = await browser.newPage();

  pageObj = {
    id: null,
    connectedTo: new Array(),
    page: page
  };

  pages.push(pageObj);

  var i = pages.length - 1;

  pages[i].page.on('console', message => {
    var msg = message.text();
    msg = _.trimStart(msg, '%c ');
    msg = _.trimEnd(msg, ' color:Chartreuse');
    if(_.startsWith(msg, 'My id')){
      pages[i].id = _.trimStart(msg, 'My id is ');
    }
    if(_.startsWith(msg, 'WebRTC Connected')){
      pages[i].connectedTo.push(_.trimStart(msg, 'WebRTC Connected with '));
    }
  });
  
  await pages[i].page.goto(url);
}

var pages = new Array();

describe('Connection Test', function () {

  before ( done => {
    startPage();
    startPage()
      .then( () => {
        setTimeout(() => {
          done();
        }, 500);
      });
  });

  after (async function () {
    await pages[0].page.close();
    await pages[1].page.close();
    pages = new Array();
  });

  it('Two way connection is working', async function () {
    expect(pages[0].id).to.not.eql(null);
    expect(pages[1].id).to.not.eql(null);
    expect(pages[0].id).to.eql(pages[1].connectedTo[0]);
    expect(pages[1].id).to.eql(pages[0].connectedTo[0]);
  });

});

describe('Routing Table Tests', function () {
  var numberOfPeers = 4;
  before ( done => {
    for(var i=0;i<numberOfPeers - 1;i++) {
      startPage();
    }
    startPage()
      .then( () => {
        setTimeout(() => {
          done();
        }, 500);
      });
  });
  it('Routing Table', async function () {
    for(var i=0;i<numberOfPeers;i++) {
      console.log(pages[i].id, pages[i].connectedTo);
    }
    expect(true).to.be.true;
  });
});