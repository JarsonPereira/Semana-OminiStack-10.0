const axios = require('axios');
const Dev = require('../models/dev')

module.exports = {
    
    async index(request, response) {    
        const { latitude, longitude, techs } = request.query;
        const techsArray = techs.split(',').map(tech => tech.trim());
        let devs =  await Dev.find({
            techs:{ 
                $in:techsArray
            },
            location:{
                $near:{
                    $geometry:{
                        type:'Point',
                        coordinates:[longitude,latitude]
                    },
                    $maxDistance:10000
                }
            }
        })
        return response.json({devs:[devs]});
    }
}