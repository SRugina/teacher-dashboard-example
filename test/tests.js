// https://codeforgeek.com/unit-testing-nodejs-application-using-mocha/

const supertest = require("supertest");
const should = require("should");

const server = supertest.agent("http://localhost:3000");

var token;
var id;
let testName = 'testTeacher';
let testEmail = 'testTeacher@school.com';
let testPassword = 'testTeacher123';
let testFormGroup = '4c';

describe("test homepage",function(){
    it("should return homepage",function(done){
        server
        .get("/")
        .expect("Content-type",/json/)
        .expect(200) // 200 is a successful response
        .end(function(err,res) {
            // HTTP status should be 200
            res.status.should.equal(200);
            // response should say that it succeeded
            res.body.success.should.equal(true);

            console.log(res.body);
            done();
        });
    });
});

describe("test teacher signup",function(){
    it("should return success message",function(done){
        server
        .post("/api/v1/teachers/signup")
        .send({name: testName, email: testEmail, password: testPassword, formGroup: testFormGroup})
        .set('Accept', 'application/json')
        .expect("Content-type",/json/)
        .expect(200) // 200 is a successful response
        .end(function(err,res) {
            if (err) return done(err);
            // HTTP status should be 200
            res.status.should.equal(200);
            // response should say that it succeeded
            res.body.success.should.equal(true);

            console.log(res.body);
            done();
        });
    });
});

describe("test incorrect teacher login details",function(){
    it("should return json with success equal to false",function(done){
        server
        .post("/api/v1/teachers/auth")
        .send({email: testEmail, password: 'rgrewesf'})
        .set('Accept', 'application/json')
        .expect("Content-type",/json/)
        .expect(200) // 200 means request arrived
        .end(function(err,res) {
            if (err) return done(err);
            // HTTP status should be 200
            res.status.should.equal(200);
            // response should say that it succeeded
            res.body.success.should.equal(false);

            console.log(res.body);
            done();
        });
    });
});

describe("test teacher login",function(){
    it("should return success message",function(done){
        server
        .post("/api/v1/teachers/auth")
        .send({email: testEmail, password: testPassword})
        .set('Accept', 'application/json')
        .expect("Content-type",/json/)
        .expect(200) // 200 is a successful response
        .end(function(err,res) {
            if (err) return done(err);
            // HTTP status should be 200
            res.status.should.equal(200);
            // response should say that it succeeded
            res.body.success.should.equal(true);
            token = res.body.data.token;
            id = res.body.data.teacher.id;

            console.log(res.body);
            done();
        });
    });
});

describe("test teacher access to all pupil information",function(){
    it("should return success message",function(done){
        server
        .get("/api/v1/pupils/")
        .set({'Accept': 'application/json', 'x-access-token': token})
        .expect("Content-type",/json/)
        .expect(200) // 200 is a successful response
        .end(function(err,res) {
            if (err) return done(err);
            // HTTP status should be 200
            res.status.should.equal(200);
            // response should say that it succeeded
            res.body.success.should.equal(true);

            console.log(res.body);
            done();
        });
    });
});

describe("test teacher deletion",function(){
    it("should return success message",function(done){
        server
        .delete("/api/v1/teachers/manage/".concat(id))
        .set({'Accept': 'application/json', 'x-access-token': token})
        .expect("Content-type",/json/)
        .expect(200) // 200 is a successful response
        .end(function(err,res) {
            if (err) return done(err);
            // HTTP status should be 200
            res.status.should.equal(200);
            // response should say that it succeeded
            res.body.success.should.equal(true);

            console.log(res.body);
            done();
        });
    });
});