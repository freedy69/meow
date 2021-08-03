console.log("hi");

var Properties =
{
    EclipseTwr:
    {
        extCoords: [-774.02, 310.89, 85.7],
        name: "Eclipse Tower Apartments",
        blipId: 475,
        Apartments: 
        [
            {
                type: "Luxury",
                name: "Apartment 1",
                price: 1000000,
                intCoords: [-774.553, 331.621, 160]
            }
        ]
    }
};

console.log(Properties);

onNet("Properties->RequestList", () => {
    var _source = source;
    console.log(_source, " requested properties");
    emitNet("Properties->ReceiveList", _source, Properties);
});
