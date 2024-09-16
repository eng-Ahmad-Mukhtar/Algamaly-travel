

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

        let complete = req.session.complete
        res.status(200).render("add_new", { complete, loged_user: req.session.user })

    } else {
        res.render("notAllow")
    }
})






const traveldetails = AysncHandler(async (req, res) => {
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

    const { travel_details, name, passportId, directorName, direction, status, phoneNumber, notes } = req.body;

    try {
        let subscriber = await Subscriber.findOne({ travel_details });

        if (!subscriber) {

            subscriber = new Subscriber({ travel_details, subscriptions: [] });
        }


        const newSubscription = {
            name: name,
            passportId: passportId,
            directorName: directorName,
            direction: direction,
            status: status,
            phoneNumber: phoneNumber,
            notes: notes
        };
        if (newSubscription) {
            subscriber.subscriptions.push(newSubscription);
            await subscriber.save();
            req.session.complete = "تمت الإضافة بنجاح"
            res.redirect("/login")
        }

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'حدث خطأ في إضافة الاشتراك' });
    }

})



const introducer = require("../models/introducer")

const add = AysncHandler(async (req, res) => {

    const { name, directorName, date, direction, status, phoneNumber, notes } = req.body;

    try {
        let subscriber = await introducer.findOne({ name });

        if (!subscriber) {

            subscriber = new introducer({ name, subscriptions: [] });
        }


        const newSubscription = {
            name: name,
            directorName: directorName,
            date: date,
            direction: direction,
            status: status,
            phoneNumber: phoneNumber,
            notes: notes
        };
        if (newSubscription) {
            subscriber.subscriptions.push(newSubscription);
            await subscriber.save();
            req.session.complete = "تمت الإضافة بنجاح"
            res.redirect("/add_introducer")
        }

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'حدث خطأ في إضافة الاشتراك' });
    }

})





const one_subiscription_information = AysncHandler(async (req, res) => {
    if (req.session.user) {
        const data = req.session.students || [];
        res.status(200).render("searchByName", { data, loged_user: req.session.user })

    } else {
        res.render("notAllow")
    }
})



const introducer_page = AysncHandler(async (req, res) => {
    if (req.session.user) {
        const data = req.session.students || [];
        res.status(200).render("search_introducer", { data, loged_user: req.session.user, moment })

    } else {
        res.render("notAllow")
    }
})

const search_introducer = AysncHandler(async (req, res) => {
    const { name } = req.body;


    const dataArray = await introducer.find({
        'name': name
    }, {
        'name': 1,
        'subscriptions': 1,
        'createdAt': 1,
        'updatedAt': 1
    });


    req.session.students = dataArray;


    res.redirect('/search_introducer');
});



const name_search = AysncHandler(async (req, res) => {
    try {
        const term = req.query.term || '';
        const regex = new RegExp(term, 'i');


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

// 
// 
// 
// 
const name_suggest = AysncHandler(async (req, res) => {
    try {
        var regex = new RegExp(req.query["term"], 'i');
        var substitute = introducer.find({ name: regex }, { 'name': 1 }).limit(6);

        var data = await substitute.exec();

        var result = [];
        if (data && data.length > 0) {
            data.forEach(element => {
                let obj = {
                    label: element.name
                };
                result.push(obj);
            });
        }

        res.jsonp(result);
    } catch (err) {
        res.status(500).send(err);
    }
});


const add_introducer = AysncHandler(async (req, res) => {
    if (req.session.user) {

        let complete = req.session.complete
        res.status(200).render("add_itroducer", { complete, loged_user: req.session.user })

    } else {
        res.render("notAllow")
    }

})





const search_subiscription = AysncHandler(async (req, res) => {
    const { name } = req.body
    const dataArray = await Subscriber.find({
        'subscriptions.name': name
    }, {
        'subscriptions.$': 1,
        'travel_details': 1,
        'createdAt': 1,
        'updatedAt': 1
    });



    req.session.students = dataArray
    res.redirect('/subiscription_information');

})


const subiscription_information_by_id = AysncHandler(async (req, res) => {
    if (req.session.user) {
        const data = req.session.students || [];
        res.status(200).render("searchById", { data, loged_user: req.session.user })

    } else {
        res.render("notAllow")
    }

})


const name_search_id = AysncHandler(async (req, res) => {
    try {
        const term = req.query.term || '';
        const regex = new RegExp(term, 'i');


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




const search_subiscription_id = AysncHandler(async (req, res) => {
    const { passportId } = req.body
    const dataArray = await Subscriber.find({
        'subscriptions.passportId': passportId
    }, {
        'subscriptions.$': 1,
        'travel_details': 1,
        'createdAt': 1,
        'updatedAt': 1
    });



    req.session.students = dataArray
    res.redirect('/subiscription_information_by_id');


})

const subiscription_information_by_direction = AysncHandler(async (req, res) => {
    if (req.session.user) {
        const data = req.session.students || [];
        res.status(200).render("searchByDirection", { data, loged_user: req.session.user })
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
const search_subiscription_direction = AysncHandler(async (req, res) => {
    const { direction } = req.body

    const dataArray = await Subscriber.find({
        'subscriptions.direction': direction
    }, {
        'subscriptions.$': 1,
        'travel_details': 1,
        'createdAt': 1,
        'updatedAt': 1
    });



    req.session.students = dataArray
    res.redirect('/subiscription_information_by_direction');


})

const allUser = AysncHandler(async (req, res) => {
    if (req.session.user) {
        console.log(req.session);
        const dataArray = await Subscriber.find({});

        const data = dataArray || []
        res.render('allAgents', { data, loged_user: req.session.user, moment });
    }
    else {


        res.render("notAllow")
    }


})

const deletee = AysncHandler(async (req, res) => {
    try {
        const { userId, subscriptionId } = req.params;

        console.log(`Attempting to delete subscription ${subscriptionId} for user ${userId}`);


        const user = await Subscriber.findById(userId);

        if (!user) {
            console.error('User not found');
            return res.status(404).send('User not found.');
        }


        user.subscriptions.pull({ _id: subscriptionId });


        await user.save();

        console.log('Subscription deleted successfully');
        res.redirect('/allAgents');
    } catch (error) {
        console.error('Error deleting subscription:', error);
        res.status(500).send('Error deleting subscription.');
    }
});

const deleteAll = AysncHandler(async (req, res) => {
    try {
        const { userId } = req.params;



        await Subscriber.findByIdAndDelete(userId);


        res.redirect('/allAgents');
    } catch (error) {

        res.status(500).send('Error deleting travel details.');
    }
});


module.exports = {
    Home_page,
    log_page,
    adding,
    one_subiscription_information,
    name_search,
    search_subiscription,
    subiscription_information_by_id,
    search_subiscription_direction,
    name_search_direction,
    subiscription_information_by_direction,
    search_subiscription_id,
    name_search_id,
    traveldetails,
    allUser,
    signIn,
    deletee,
    deleteAll,
    name_suggest,
    add_introducer,
    add,
    introducer_page,
     search_introducer

}


