

var comments = db.comment.find().toArray();

for (var i=0; i< comments.length; i++) {
	var image = db.images.findOne({_id : comments[i].imageId});
	var out = image.title +", " + comments[i].title + ", " + comments[i].username +", '" + comments[i].text + "'";
	print(out);
}
