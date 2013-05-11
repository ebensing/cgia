var fs = require("fs")
var imageFolder = "../Public/images/huit_images/";
var imgPath = "/images/huit_images/";
var files = fs.readdirSync(imageFolder);
var import_output = "";
var import_template = 'db.images.insert({ title: "<%title%>", url: "<%url%>", votes: 0 });\n';
for(var i = 0; i < files.length; i++) {
    var title = files[i].replace(".png", "");
    import_output += import_template.replace("<%title%>", title).replace("<%url%>", imgPath + files[i]);
}
import_output += 'var ids = db.images.find({}, { _id: true }).toArray() \
    var idArr = [];\
    for (var i = 0; i < ids.length; i++) { \
        idArr.push(ids[i]._id); \
    } \
    db.sequences.insert({ title: "Job Title Maps", "imageIds": idArr, "isActive": true });';
fs.writeFileSync('db_import_script.js', import_output);
