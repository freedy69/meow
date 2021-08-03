console.log("hi");

var Properties =
[
    {
        id: 1,
        extCoords: [-774.02, 310.89, 85.7],
        name: "Eclipse Tower Apartments",
        garage: 
        {
            hasGarage: true,
            extCoords: [-796.206, 311.314, 85.692],
            blipId: 357,
            name: "Eclipse Tower - Garage",
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
    },
    {
        id: 2,
        extCoords: [-340.36, 626.12, 171.36],
        name: "Kimble Hill Residence",
        garage:
        {
            hasGarage: true,
            extCoords: [-338.94, 630.68, 172.35],
            blipId: 357,
            name: "Kimble Hill Residence - Garage",
            txtEntry: "G_KMB_RES",
            intCoords: [211.66, -999.18, -99]
        },
        txtEntry: "KMB_RES",
        blipId: 40,
        apartments:
        [
            {
                type: "Luxury",
                name: "1378 Kimble Hill",
                price: 2500000,
                intCoords: [0, 0, 0]
            }
        ]
    },
    {
        id: 3,
        extCoords: [903.43, -615.8, 58.45],
        name: "West Mirror Estate",
        garage:
        {
            hasGarage: true,
            extCoords: [912.94, -630.5, 58.05],
            blipId: 357,
            name: "West Mirror Estate - Garage",
            txtEntry: "G_WSM_EST",
            intCoords: [211.66, -999.18, -99]
        },
        txtEntry: "WSM_EST",
        blipId: 40,
        apartments:
        [
            {
                type: "Modest",
                name: "3102 West Mirror Drive",
                price: 650000,
                intCoords: [0, 0, 0]
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
