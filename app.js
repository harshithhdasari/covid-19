const express = require("express");
const {open}= require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
let db = null;
const dbpath = path.join(__dirname,"covid19India.db");
app.use(express.json());

const intializeDbAndServer = async() =>{
    try {
        database = await open({filename:dbpath,driver:sqlite3.Database});
        app.listen(3000,(=>{
            console.log("Server is running on http://localhost:3000");
        }));
    }
    catch(error){
        console.log(`Database error is ${error}`);
        process.exit(1);
    }
};
intializeDbAndServer();

const convertDbObjectToResponseObject = (dbObject) =>{
return { cured: dbObject.cured, 
stateName: dbObject.state_name,
population: dbObject.population,
districtId: dbObject.district_id,
districtName: dbObject.district_name,
stateId: dbObject.state_id,
cases: dbObject.cases,
active: dbObject.active,
deaths: dbObject.deaths,
};

app.get("/states/", async (request, response) =>{ const stateNames = `SELECT * FROM state`;
const allStatesArray = await db.all(stateNames);
response.send( allStatesArray.map((eachObject) =>
convertDbObjectToResponseObject(eachObject)
)
);
});
app.get("/states/:stateId/", async (request, response) =>{ 
    const { stateId} = request.params;
const stateQuery = `SELECT * FROM state WHERE state_id = ${stateId}`;
const stateDetails = await db.get(stateQuery);
response.send(convertDbObjectToResponseObject(stateDetails)); });

app.post("/districts/", async (request, response)=>{
const newDistrict = request.body;
const { districtName, stateId, cases, cured, active, deaths }= newDistrict;
const addingNewDistrict =`
INSERT INTO
district(district_name,state_id,cases,cured,active,deaths)
VALUES(
    `${district_name}`
    `${stateId}`
    `${cases}`
    `${cured}`
    `${active}`
    `${deaths}`
    )`;
    const dbResponse await db.run(addingNewDistrict); 
    const newDistrictDetails dbResponse.lastID; 
    response.send("District Successfully Added"); });
app.get("/districts/:districtId/", async (request, response)=>{
const { districtId} = request.params;
const districtDetails =
`SELECT * FROM district WHERE district_id = ${districtId}`;
const districtArray = await db.get(districtDetails);
response.send(convertDbObjectToResponseObject(districtArray));
});
app.delete("/districts/:districtId/", async (request, response) =>{
const { districtId = request.params;
const removeDistrict = `DELETE FROM district WHERE district_id = ${districtId}`;
await db.run(removeDistrict);
response.send("District Removed");
});
app.put("/districts/:districtId/", async (request, response) => {
const { districtId} = request.params;
const districtDetails = request.body;
const {
districtName,
stateId,
cases,
cured,
active,
deaths,
} =districtDetails;
const updateDistrictDetails =
`UPDATE district SET
district_name = '${districtName}', 
cured = ${cured)', 
active = '${active}', 
deaths = '${deaths)' ,
state_id = '${stateId}',
cases = '${cases}',
WHERE district_id = ${districtId}';

await db.run(updateDistrictDetails); 
response.send("District Details Updated");
});

app.get("/states/:stateId/stats/", async (request, response)=>{}
const { stateId} = request.params;
const stateQuery =
`SELECT
SUM(cases),
SUM(cured),
SUM(active),
SUM(deaths)
FROM district
WHERE
state_id = $(stateId}`;
const stateDetails = await db.get(stateQuery);
response.send({
totalCases: stateDetails["SUM(cases)"],
totalCured: stateDetails["SUM(cured)"],
totalActive: stateDetails["SUM(active)"],
totalDeaths: stateDetails["SUM(deaths)"],
});
});
app.get("/districts/:districtId/details/", async (request, response) =>{
const { districtId} = request.params;
const stateQuery =
`SELECT state_name
FROM state
NATURAL JOIN district
WHERE district_id = ${districtId}`;
const stateName = await db.get(stateQuery);
response.send(convertDbObjectToResponseObject(stateName));
 });
module.exports = app;