console.log("hi");

var PropertiesReceived = false;

on("playerSpawned", () => {
    emitNet("Properties->RequestList");
});

on("onResourceStart", (res) => {
    if (res == GetCurrentResourceName())
    {
        emitNet("Properties->RequestList");
    }
});

onNet("Properties->ReceiveList", (properties) => {
    PropertiesReceived = false;
    console.log(properties);

    for (property of properties)
    {
        AddTextEntry(property.txtEntry, property.name);
        AddTextEntry(property.garageTxtEntry, property.garageName);

        var blip = AddBlipForCoord(property.extCoords[0], property.extCoords[1], property.extCoords[2]);
        SetBlipSprite(blip, property.blipId);
        SetBlipAsShortRange(blip, true);
        SetBlipCategory(blip, 10);
        BeginTextCommandSetBlipName(property.txtEntry);
        EndTextCommandSetBlipName(blip);

        console.log(`creating blip for ${property.name}`);

        var garageBlip = AddBlipForCoord(property.garageCoords[0], property.garageCoords[1], property.garageCoords[2]);
        SetBlipSprite(garageBlip, property.garageBlipId);
        SetBlipAsShortRange(garageBlip, true);
        BeginTextCommandSetBlipName(property.garageTxtEntry);
        EndTextCommandSetBlipName(garageBlip);

        console.log(`creating blip for ${property.garageName}`);
    }
});
