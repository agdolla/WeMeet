var chai = require('chai');
var describe = require('mocha').describe;
var it = require('mocha').it;
var expect = chai.expect;
var should = chai.should();
chai.use(require('chai-http'));
chai.use(require('chai-like'));
var agent = chai.request.agent('http://localhost:3000');
var resetdatabase = require('../resetdatabase');

describe("test 'activity'", function() {
 this.timeout(3000);

  before((done)=>{
    resetdatabase(()=>{
      done();
    });
  })

  after((done)=>{
    resetdatabase(()=>{
      done();
    });
  })

  var userData;
  it('should log in correctly', function(done) {
    agent
    .post('/login')
    .set('content-type', 'application/json;charset=UTF-8')
    .send({"email":"upao@umass.edu","password":"123456"})
    .end(function (err, res) {
      expect(err).to.be.null;
      expect(res).to.have.cookie('session.sig');
      expect(res.body).to.be.an('object');
      userData = res.body;
      expect(userData.user).to.be.an('object');
      expect(userData.user.fullname).to.equal('WeMeet');
      expect(userData.token).to.be.a('string');
      done();
    });
  });

  it('should get acitivties',function(done){
    agent.get('/activities/'+new Date().getTime())
    .end((err,res)=>{
      expect(err).to.be.null;
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(3);
      var data = res.body;
      data.should.like([{
        title: "Hack UMass",
        postDate: 1478129314000,
        startTime:1478129314000,
        endTime:1479940314000,
        description:"Hack Umass",
        location:"University of Massachusetts Amherst"
      },{
        title:"birthday party",
        startTime:1478129314000,
        postDate:1478129313000,
        endTime:1479940314000,
        description:`Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.`,
        location:"University of Massachusetts Amherst"
      },{
        title:"dance party",
        startTime:1478129314000,
        postDate:1478129312000,
        endTime:1479940314000,
        description:`Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.`,
        location:"University of Massachusetts Amherst"
      }])
      done();
    })
  });

  it('should create a new activity correctly',done=>{
    var activity = {
      postDate: new Date().getTime(),
      type: "Entertainment",
      author:userData.user._id,
      title: "test activity",
      description:"data.description",
      img:"./img/default.png",
      startTime: new Date().getTime(),
      endTime: new Date().getTime(),
      location: "test",
      contents: {
       "text": "data.detail"
      }
    }
    agent.post('/createActivity')
    .set('content-type', 'application/json;charset=UTF-8')
    .send(activity)
    .end((err,res)=>{
      expect(err).to.be.null;
      res.body.should.be.an("object");
      done();
    })
  });

  it('should get the new activity',done=>{
    agent.get('/activities/'+new Date().getTime())
    .end((err,res)=>{
      expect(err).to.be.null;
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(4);
      var data = res.body;
      data.should.like([{
        type: "Entertainment",
        title: "test activity",
        description:"data.description",
        img:"./img/default.png",
        location: "test",
        contents: {
         "text": "data.detail"
        }
      }])
      done();
    });
  });

  it('should logout correctly',(done)=>{
    agent.get('/logout')
    .end((err,res)=>{
      expect(err).to.be.null;
      expect(res).to.redirectTo('http://localhost:3000/');
      done();
    })
  });

  it('should not get activities',(done)=>{
    agent.get('/activities/'+new Date().getTime())
    .end((err,res)=>{
      expect(err).to.not.null;
      res.should.have.status(401);
      done();
    })
  });
});
