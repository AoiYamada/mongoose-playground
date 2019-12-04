const mongod = require("./db/setup");
const mongoose = require('mongoose');
const { Schema, ObjectId, model } = mongoose;

(async () => {
  // Edit your test here, Example:
  const MixedSchema = new Schema({
    mixedArray: [{
      data: {
        type: ObjectId,
        refPath: 'mixedArray.kind',
      },
      kind: {
        type: String,
        enum: ['a', 'b'],
      }
    }],
  });

  const ASchema = new Schema({
    a: {
      type: String,
    },
  });

  const BSchema = new Schema({
    b: {
      type: String,
    },
  });

  const Mixed = model("mix", MixedSchema);
  const A = model("a", ASchema);
  const B = model("b", BSchema);

  const data_a = await A.create({
    a: 'hello',
  });
  const data_b = await B.create({
    b: 'world',
  });

  const data_mix = await Mixed.create({
    mixedArray: [
      {
        kind: 'a',
        data: data_a._id,
      }, {
        kind: 'b',
        data: data_b._id,
      },
    ]
  });

  const query = Mixed
    .findById(data_mix._id)
    .populate({
      path: 'mixedArray.data',
      options: { lean: true },
    })
    .lean();

  const result = await query.exec();
  console.log(result.mixedArray);
})().then(
  async _ => {
    await mongoose.disconnect();
    await mongod.stop();
    process.exit(0);
  },
  async _ => {
    console.log(_);
    await mongoose.disconnect();
    await mongod.stop();
    process.exit(1);
  }
)
