

const AysncHandler = require("express-async-handler")
const Subscriber = require("../models/client")
const moment = require("moment")

const Home_page = AysncHandler(async (req, res) => {

    res.status(200).render("index")

})

const signIn = AysncHandler(async (req, res) => {
    
    res.status(200).render("login_page")

})

const log_page = AysncHandler(async (req, res) => {
   if (req.session.user) {
    
   let  complete = req.session.complete
   res.status(200).render("add_new" , {complete ,  loged_user: req.session.user})

   }else{
    res.render("notAllow")
   }
})
 



const traveldetails= AysncHandler(async (req, res) => {
    try {
        var regex = new RegExp(req.query["term"], 'i');
        var substitute = Subscriber.find({ travel_details: regex }, { 'travel_details': 1 }).limit(6);

        
        var data = await substitute.exec();
        
        var result = [];
        if (data && data.length > 0) {
            data.forEach(element => {
                let obj = {
                    label: element.travel_details
                };
                result.push(obj);
            });
        }
        
        res.jsonp(result);
    } catch (err) {
        res.status(500).send(err);
    }
});




const adding = AysncHandler(async (req, res) => {
  
    const { travel_details,  name, passportId, directorName, direction ,status ,phoneNumber ,notes} = req.body;

    try {
        let subscriber = await Subscriber.findOne({ travel_details });

        if (!subscriber) {
           
            subscriber = new Subscriber({ travel_details, subscriptions: [] });
        }


const newSubscription = {
    name:name,
    passportId :passportId,
     directorName:directorName,
      direction:direction ,
      status : status,
      phoneNumber:phoneNumber ,
      notes :notes
    };
if (newSubscription) {
    subscriber.subscriptions.push(newSubscription);
    await subscriber.save();
    req.session.complete= "تمت الإضافة بنجاح"
    res.redirect("/login" )
}
   
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: 'حدث خطأ في إضافة الاشتراك' });
    }

})

 
 
 

// search by name
const one_subiscription_information = AysncHandler(async (req, res) => {
   if (req.session.user) {
    const data = req.session.students || [];
    res.status(200).render("searchByName" , {data   ,  loged_user: req.session.user})

   } else {
    res.render("notAllow")
   }
 })


 const name_search  = AysncHandler(async (req, res) => {
    try {
        const term = req.query.term || '';
        const regex = new RegExp(term, 'i');
        
        // البحث عن passportId ضمن الاشتراكات
        const users = await Subscriber.find({
            'subscriptions.name': regex
        }).select('subscriptions.name').limit(10);

      
        const results = users.flatMap(user => 
            user.subscriptions
                .filter(sub => regex.test(sub.name))
                .map(sub => ({ label: sub.name }))
        );

        res.json(results);
    } catch (error) {
        res.status(500).send(error);
    }
});
 
 
 
 
 
 
 
 

const search_subiscription  = AysncHandler(async (req, res) => {
    const {name} =req.body
    const dataArray = await Subscriber.find({
        'subscriptions.name': name
    }, {
        'subscriptions.$': 1,  // Return only the matched subscription
        'travel_details': 1,    // Return the travel details of the client
        'createdAt': 1,         // Return the creation timestamp
        'updatedAt': 1          // Return the updated timestamp
    });



    req.session.students=dataArray
    res.redirect('/subiscription_information');
        

        
    
    })

    // search by id
const subiscription_information_by_id = AysncHandler(async (req, res) => {
    if (req.session.user) {
        const data = req.session.students || [];
        res.status(200).render("searchById" , {data ,  loged_user: req.session.user  })
    
    } else {
        res.render("notAllow") 
    }
   
 })


 const name_search_id = AysncHandler(async (req, res) => {
    try {
        const term = req.query.term || '';
        const regex = new RegExp(term, 'i');
        
        // البحث عن passportId ضمن الاشتراكات
        const users = await Subscriber.find({
            'subscriptions.passportId': regex
        }).select('subscriptions.passportId').limit(10);

      
        const results = users.flatMap(user => 
            user.subscriptions
                .filter(sub => regex.test(sub.passportId))
                .map(sub => ({ label: sub.passportId }))
        );

        res.json(results);
    } catch (error) {
        res.status(500).send(error);
    }
});




const search_subiscription_id  = AysncHandler(async (req, res) => {
    const {passportId} =req.body
    const dataArray = await Subscriber.find({
        'subscriptions.passportId': passportId
    }, {
        'subscriptions.$': 1,  // Return only the matched subscription
        'travel_details': 1,    // Return the travel details of the client
        'createdAt': 1,         // Return the creation timestamp
        'updatedAt': 1          // Return the updated timestamp
    });



    req.session.students=dataArray
    res.redirect('/subiscription_information_by_id');
        
    
    })
    // search by direction 
const subiscription_information_by_direction = AysncHandler(async (req, res) => {
    if (req.session.user) {
        const data = req.session.students || [];
        res.status(200).render("searchByDirection" , {data ,  loged_user: req.session.user})
    } else {
        res.render("notAllow")
    }
  

 })

 const name_search_direction = AysncHandler(async (req, res) => {
    try {
        const term = req.query.term || '';
        const regex = new RegExp(term, 'i');
        
       
        const users = await Subscriber.find({
            'subscriptions.direction': regex
        }).select('subscriptions.direction').limit(10); 

        
        // const results = users.flatMap(user => 
        //     user.subscriptions
        //         .filter(sub => regex.test(sub.direction))
        //         .map(sub => ({ label: sub.direction }))
        // );


        const uniqueDirections = new Set();
        users.forEach(user => {
            user.subscriptions.forEach(sub => {
                if (regex.test(sub.direction)) {
                    uniqueDirections.add(sub.direction); 
                }
            });
        });

        
        const results = Array.from(uniqueDirections).map(direction => ({ label: direction }));







        res.json(results);
    } catch (error) {
        res.status(500).send(error);
    }
});
const search_subiscription_direction  = AysncHandler(async (req, res) => {
    const {direction} =req.body

    const dataArray = await Subscriber.find({
        'subscriptions.direction': direction
    }, {
        'subscriptions.$': 1,  // Return only the matched subscription
        'travel_details': 1,    // Return the travel details of the client
        'createdAt': 1,         // Return the creation timestamp
        'updatedAt': 1          // Return the updated timestamp
    });


   
    req.session.students=dataArray
    res.redirect('/subiscription_information_by_direction');
        
    
    })

// all


  const allUser = AysncHandler(async (req, res) => {
    if ( req.session.user) {
        const dataArray = await Subscriber.find({});

        const data = dataArray || []
        res.render('allAgents', {data ,  loged_user: req.session.user , moment});    
    }
    else{
        res.render("notAllow")
    }


  
    
    })

 
module.exports = {
    Home_page,
    log_page,
    adding,
    one_subiscription_information,
    name_search,
    search_subiscription,
    subiscription_information_by_id
    ,
    search_subiscription_direction,
    name_search_direction,

    subiscription_information_by_direction,
    search_subiscription_id,
    name_search_id,
    traveldetails,
    allUser,
    signIn

}


