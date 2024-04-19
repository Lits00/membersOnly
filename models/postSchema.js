const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const postSchema = new Schema({
    title: { type: String, required: true, maxLength: 100 },
    text: { type: String, required: true, maxLength: 100 },
    date: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

postSchema.virtual("url").get(function() {
    return `/${this.id}`;
});

postSchema.virtual("dateFormat").get(function() {
    const date = DateTime.fromJSDate(this.date)
    const formatDate = date.toLocaleString(DateTime.DATE_MED);
    return formatDate;
})

module.exports = mongoose.model('Post', postSchema);