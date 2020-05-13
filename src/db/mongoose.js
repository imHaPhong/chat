const mongoose = require("mongoose");
  const MONGODB_RUI ='mongodb+srv://anhtuan_159:123@cluster0-7j5ib.mongodb.net/chat?retryWrites=true&w=majority'
  mongoose.set("useCreateIndex", true);
  mongoose.connect(MONGODB_RUI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify:false
  }, (err)=>{
    if(err){console.log(err);}
    console.log("OK")
  });
return mongoose;

