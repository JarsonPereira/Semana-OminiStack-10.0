const axios = require('axios');
const Dev = require('../models/dev')

module.exports = {
    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({github_username});
        if(dev)
        {
            return response.json(dev); 
        }

        const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
        let { name = login, avatar_url, bio } = apiResponse.data;

        const techsArray = techs.split(',').map(tech => tech.trim());
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        }

        const devCreated = await Dev.create({
            github_username,
            name,
            avatar_url,
            bio,
            techs: techsArray,
            location
        });

        return response.json(devCreated);
    },


    async index(request, response) {    
        return response.json(await Dev.find());
    },

    async destroy(request,response){
        const { id } = request.params;
        var resp = await Dev.deleteOne({_id:id});
        return response.json(resp);
    }
}