const express = require('express');
const router = express.Router();

const home_control = require('../Controllers/home_control');

router.get("/", home_control.Home_page)
router.get("/login", home_control.log_page)
router.get('/autocomplet/', home_control.traveldetails)
router.post("/adding", home_control.adding)


router.get("/subiscription_information", home_control.one_subiscription_information)
router.get('/autocomplete/', home_control.name_search)
router.post('/search_name', home_control.search_subiscription)

router.get("/subiscription_information_by_id", home_control.subiscription_information_by_id)
router.get('/autocompletee/', home_control.name_search_id)
router.post('/search_namee', home_control.search_subiscription_id)
router.get("/subiscription_information_by_direction", home_control.subiscription_information_by_direction)
router.get('/autocompleteee/', home_control.name_search_direction)
router.post('/search_nameee', home_control.search_subiscription_direction)
router.get("/allAgents", home_control.allUser)






module.exports = router;

