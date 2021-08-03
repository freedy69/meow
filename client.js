console.log("hi");

console.log("hi");

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
    console.log(properties);
});
