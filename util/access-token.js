
const request = require('request')
const client_id='IC8IYZ2PiStsjCxfaAyvWBeh'
    const client_secret='F9xtLrzhb9PfI1ntQNNYN1lqR8EqgS2K'
async function main() {
    const options = {
        'method': 'POST',
        'url': `https://aip.baidubce.com/oauth/2.0/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`,
        'headers': {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });
}

main().then(r =>{
    console.log('r', r)
} );
