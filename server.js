console.log("hi");

var Properties =
[
    {
        extCoords: [-774.02, 310.89, 85.7],
        name: "Eclipse Tower Apartments",
        garage: 
        {
            hasGarage: true,
            extCoords: [-796.206, 311.314, 85.692],
            blipId: 357,
            name: "Garage: Eclipse Tower",
            txtEntry: "G_ECL_TRW",
            intCoords: [240.962, -1004.716, -99.014]
        },
        txtEntry: "ECL_TWR",
        blipId: 40,
        apartments: 
        [
            {
                type: "Luxury",
                name: "Apartment 1",
                price: 1000000,
                intCoords: [-774.553, 331.621, 160]
            }
        ]
    }
];

onNet("Properties->RequestList", () => {
    var _source = source;
    var _name = GetPlayerName(_source);

    console.log(`[${_source}] ${_name} requested properties, sending...`);
    emitNet("Properties->ReceiveList", _source, Properties);
});
