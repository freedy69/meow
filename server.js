console.log("hi");

var Properties =
[
    {
        extCoords: [-774.02, 310.89, 85.7],
        name: "Eclipse Tower Apartments",
        txtEntry: "ECL_TWR",
        blipId: 40,
        garageCoords: [-796.206, 311.314, 85.692],
        garageBlipId: 357,
        garageName: "Garage: Eclipse Tower",
        garageTxtEntry: "G_ECL_TRW",
        Apartments: 
        [
            {
                type: "Luxury",
                name: "Apartment 1",
                price: 1000000,
                intCoords: [-774.553, 331.621, 160],
                hasGarage: true
            }
        ]
    }
];

console.log(Properties);

onNet("Properties->RequestList", () => {
    var _source = source;
    console.log(_source, " requested properties");
    emitNet("Properties->ReceiveList", _source, Properties);
});
