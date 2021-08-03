console.log("hi");

var PropertiesReceived = false;
var PropertiesBlips = [];

on("playerSpawned", () => {
    emitNet("Properties->RequestList");
});

on("onResourceStart", (res) => {
    if (res == GetCurrentResourceName())
    {
        emitNet("Properties->RequestList");
    }
});

on("onResourceStop", (res) => {
    if (res == GetCurrentResourceName())
    {
        for (blip of PropertiesBlips)
        {
            RemoveBlip(blip);
        }
    }
})

onNet("Properties->ReceiveList", (properties) => {
    PropertiesReceived = false;
    console.log(properties);

    for (property of properties)
    {
        AddTextEntry(property.txtEntry, property.name);

        var blip = AddBlipForCoord(property.extCoords[0], property.extCoords[1], property.extCoords[2]);
        SetBlipSprite(blip, property.blipId);
        BeginTextCommandSetBlipName(property.txtEntry);
        EndTextCommandSetBlipName(blip);

        PropertiesBlips.push(blip);

        console.log(`creating blip for ${property}`);
    }
});
