db.persons
  .aggregate([
    {
      $project: {
        _id: 0,
        name: 1,
        email: 1,
        birthdate: { $toDate: "$dob.date" },
        age: "$dob.age",
        location: {
          type: "Point",
          coordinates: [
            {
              $convert: {
                input: "$location.coordinates.longitude",
                to: "double",
                onError: 0.0,
                onNull: 0.0,
              },
            },
            {
              $convert: {
                input: "$location.coordinates.latitude",
                to: "double",
                onError: 0.0,
                onNull: 0.0,
              },
            },
          ],
        },
      },
    },
    {
      $project: {
        gender: 1,
        email: 1,
        location: 1,
        birthdate: 1,
        age: 1,
        fullName: {
          $concat: [
            { $toUpper: { $substrCP: ["$name.first", 0, 1] } },
            {
              $substrCP: [
                "$name.first",
                1,
                { $subtract: [{ $strLenCP: "$name.first" }, 1] },
              ],
            },
            " ",
            { $toUpper: { $substrCP: ["$name.last", 0, 1] } },
            {
              $substrCP: [
                "$name.last",
                1,
                { $subtract: [{ $strLenCP: "$name.last" }, 1] },
              ],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: { birthYear: { $isoWeekYear: "$birthdate" } },
        numPersons: { $sum: 1 },
      },
    },
    { $sort: { numPersons: -1 } },
  ])
  .pretty();

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
/////////     ARRAYS

db.friends.aggregate([
  { $unwind: "$hobbies" },
  {
    $group: {
      _id: { age: "$age" },
      allHobbies: { $addToSet: "$hobbies" },
    },
  },
]);

db.friends.aggregate([
  {
    $project: { _id: 0, examScore: { $slice: ["$examScores", 0, 1] } },
  },
]);

db.friends.aggregate([
  {
    $project: {
      _id: 0,
      examScore: {
        $filter: {
          input: "$examScores",
          as: "sc",
          cond: { $gt: ["$$sc.diffculty", 6] },
        },
      },
    },
  },
]);

db.friends.aggregate([
  { $unwind: "$examScores" },
  { $project: { _id: 1, name: 1, age: 1, score: "$examScores.score" } },
  { $sort: { score: -1 } },
  {
    $group: {
      _id: "$_id",
      name: { $first: "$name" },
      maxScore: { $max: "$score" },
    },
  },
  { $sort: { maxScore: -1 } },
]);

db.friends.aggregate([
  {
    $bucket: {
      groupBy: "$dob.age",
      boundries: [0, 18, 30, 50, 80],
      output: { numPersons: { $sum: 1 }, averageAge: { $avg: "$dob.age" } },
    },
  },
]);

db.persons.aggregate([
  { $match: { gender: "male" } },
  {
    $project: {
      _id: 0,
      name: 1,
      email: 1,
      birthdate: { $toDate: "$dob.date" },
      age: "$dob.age",
      location: {
        type: "Point",
        coordinates: [
          {
            $convert: {
              input: "$location.coordinates.longitude",
              to: "double",
              onError: 0.0,
              onNull: 0.0,
            },
          },
          {
            $convert: {
              input: "$location.coordinates.latitude",
              to: "double",
              onError: 0.0,
              onNull: 0.0,
            },
          },
        ],
        w,
      },
    },
  },
  { $sort: { age: 1 } },
  { $skip: 10 },
  { $limit: 10 },
]);

db.transformedPersons
  .aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [-18.4, -42.8],
        },
        maxDistance: 1000000,
        num: 10,
        query: { age: { $gt: 30 } },
        distanceField: "distance",
      },
    },
    // store the result in a new collection called nearbyPersons
    { $out: "nearbyPersons" },
  ])
  .pretty();
