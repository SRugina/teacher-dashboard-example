// https://codeforgeek.com/unit-testing-nodejs-application-using-mocha/

const supertest = require("supertest");
const should = require("should");

const server = supertest.agent("http://localhost:3000");

let token = '';
let token2 = '';
let id = '';
let studentId = '4fnqd';
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
            //res.body.success.should.equal(true);

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
            token2 = res.body.data.token;
            id = res.body.data.teacher.id;

            console.log(res.body);
            done();
        });
    });
});

describe("test teacher logout",function(){
    it("should return success message and remove token header",function(done){
        server
        .get("/api/v1/teachers/logout")
        .set({'Accept': 'application/json', 'x-access-token': token2})
        .expect("Content-type",/json/)
        .expect(200) // 200 is request received
        .end(function(err,res) {
            if (err) return done(err);
            // HTTP status should be 200
            res.status.should.equal(200);
            // response should say that it succeeded
            res.body.success.should.equal(true);
            token2 = res.body.data.token;

            console.log(res.body);
            done();
        });
    });
});

describe("test no logged in user access to all pupil information",function(){
    it("should fail to show pupil info",function(done){
        server
        .get("/api/v1/pupils/")
        .set({'Accept': 'application/json', 'x-access-token': token2})
        .expect("Content-type",/json/)
        .expect(200) // 200 is a successful response
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

describe("test pupil get by id",function(){
    it("should return success message",function(done){
        server
        .get("/api/v1/pupils/".concat(studentId))
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

describe("test pupil update info",function(){
    it("should return success message",function(done){
        server
        .put("/api/v1/pupils/".concat(studentId))
        .send({toReplace: "dob", newValue: "31052004"})
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

describe("test pupil create new",function(){
    it("should return success message",function(done){
        server
        .post("/api/v1/pupils/")
        .send({ surname: "duckling", forename: "tester", dob: "31052004", homeAddress: "44 somewhere somewhere", homePhone: "07482950271934", gender: "female", tutorGroup: "4c", schoolEmail: "testStudent@school.com", grades: [{"french": 9 }] })
        .set({'Accept': 'application/json', 'x-access-token': token})
        .expect("Content-type",/json/)
        .expect(200) // 200 is a successful response
        .end(function(err,res) {
            if (err) return done(err);
            // HTTP status should be 200
            res.status.should.equal(200);
            // response should say that it succeeded
            res.body.success.should.equal(true);
            studentId = res.body.data.pupilId;

            console.log(res.body);
            done();
        });
    });
});

describe("test pupil delete",function(){
    it("should return success message",function(done){
        server
        .delete("/api/v1/pupils/".concat(studentId))
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