const expect = require('expect');

var {generateMessage,generateLocationMessage} = require('./message');

describe('generateMessage',() => {
   it('should generate correct message object', () => {
       var from = 'Harsh';
       var text = 'Hello';
       var message = generateMessage(from,text);

       expect(message.createdAt).toBeA('number');
       expect(message).toInclude({from,text});
   }) 
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        var from = 'Harsh';
        var lat = '15';
        var long = '105';
        var url = 'https://www.google.com/maps?q=15,105'
        var messageLocation = generateLocationMessage(from, lat, long);

        expect(messageLocation.createdAt).toBeA('number');
        expect(messageLocation).toInclude({ from, url });
    })
});