

var seq = db.sequences.find().toArray()[0];

var output = "{";

var out_template = "'<%title%>' : <%pos%>,\n";

for (var i = 0; i < seq.imageIds.length; i++) {
    var img = db.images.findOne({ _id: seq.imageIds[i] });
    output += out_template.replace("<%title%>", img.title).replace("<%pos%>", i.toString());
}

output += "}";

print(output);