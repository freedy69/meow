console.log("hi");

var WAIT = (ms) => new Promise(res => setTimeout(res, ms));
var Properties = null;
var PropertiesReceived = false;
var DrawingMarkers = false;
var ClosestProperty = null;
var NearbyDistance = 50;
var NotNearbyWaitTime = 1000;
var NearbyWaitTime = 0;
var InRange = false;
var Enter_Called = false;
var Exit_Called = false;

CheckPos();

on("playerSpawned", () => {
    if (!PropertiesReceived)
    {
        emitNet("Properties->RequestList");
    }
});

on("onResourceStart", (res) => {
    if (res == GetCurrentResourceName())
    {
        emitNet("Properties->RequestList");
    }
});

onNet("Properties->ReceiveList", (properties) => {
    if (properties != null)
    {
        Properties = properties;
        PropertiesReceived = true;
    
        console.log(`Received ${Properties.length} properties.`);

        for (property of properties)
        {
            CreatePropertyBlips(property);
            console.log("Creating blips for property ", property.name);
        }
    }
});

async function CheckPos()
{
    while (true)
    {        
        if (PropertiesReceived)
        {
            var localPos = GetEntityCoords(PlayerPedId());
            for (property of Properties)
            {
                var d = GetDistance(localPos[0], localPos[1], localPos[2], property.extCoords[0], property.extCoords[1], property.extCoords[2]);

                if (d < NearbyDistance)
                {
                    InRange = true;
                    DrawingMarkers = true;
                    ClosestProperty = property;
                    DrawMarker(0, property.extCoords[0], property.extCoords[1], property.extCoords[2], 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 105, 136, 184, 255, true, false, 2, false, null, null, false);
                    if (!Enter_Called)
                    { 
                        PlayerEnteredRange();
                    }

                    if (property.garage.hasGarage)
                    {
                        DrawMarker(0, property.garage.extCoords[0], property.garage.extCoords[1], property.garage.extCoords[2], 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 105, 136, 184, 255, true, false, 2, false, null, null, false);
                    }
                }
                else
                {
                    InRange = false;
                    DrawingMarkers = false;
                    ClosestProperty = null;
                    
                    if (!Exit_Called)
                    {
                        PlayerExitedRange();
                    }
                }
            }
        }

        await WAIT(ClosestProperty ? NearbyWaitTime : NotNearbyWaitTime);
    }
}

function CreatePropertyBlips(property)
{
    AddTextEntry(property.txtEntry, property.name);
    var blip = AddBlipForCoord(property.extCoords[0], property.extCoords[1], property.extCoords[2]);
    SetBlipSprite(blip, property.blipId);
    SetBlipAsShortRange(blip, true);
    SetBlipCategory(blip, 10);
    BeginTextCommandSetBlipName(property.txtEntry);
    EndTextCommandSetBlipName(blip);    

    if (property.garage.hasGarage)
    {
        AddTextEntry(property.garage.txtEntry, property.garage.name);
        var garageBlip = AddBlipForCoord(property.garage.extCoords[0], property.garage.extCoords[1], property.garage.extCoords[2]);
        SetBlipSprite(garageBlip, property.garage.blipId);
        SetBlipAsShortRange(garageBlip, true);
        BeginTextCommandSetBlipName(property.garage.txtEntry);
        EndTextCommandSetBlipName(garageBlip);
    }
}

function GetDistance(x1, y1, z1, x2, y2, z2)
{
    var a = x2 - x1;
    var b = y2 - y1;
    var c = z2 - z1;

    var distance = Math.sqrt((a * a) + (b * b) + (c * c));

    return distance;
}

function PlayerEnteredRange()
{
    Enter_Called = true;
    log("entered range");
}

function PlayerExitedRange();
{
    Exit_Called = true;
    log("exited range");
}

function log(text)
{
    console.log(text);
}
