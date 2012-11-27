
// create the images

db.images.insert({ title: "Map 1", url: "/images/final-map-1.png", votes: 0 });
db.images.insert({ title: "Map 2", url: "/images/final-map-2.png", votes: 0 });
db.images.insert({ title: "Map 3", url: "/images/final-map-3.png", votes: 0 });

// get the ids

var ids = db.images.find({}, { _id: true }).toArray()
var idArr = [];
for (var i = 0; i < ids.length; i++) {
    idArr.push(ids[i]._id);
}

// create sequence

db.sequences.insert({ title : "Job Title Maps", "imageIds" : idArr, "isActive" : true });