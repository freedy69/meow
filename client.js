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
});
