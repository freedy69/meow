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
        var blip = AddBlipForCoord(property.extCoords[0], property.extCoords[1], property.extCoords[2]);
        SetBlipSprite(blip, property.blipId);
        console.log(`creating blip for ${property}`);
    }
});
