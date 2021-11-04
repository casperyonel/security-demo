const bcrypt = require('bcrypt')
const chats = []
// This is where we're storing our chats, normally in a database.


module.exports = {
    createMessage: (req, res) => {
        // the first log, this is why key is message:
        // then we create our own messages property, called messages:
        const {pin, message} = req.body
        // This is from the user, through the body which was defined in submitHandler function
        for (let i = 0; i < chats.length; i++) {
            const existingPin = bcrypt.compareSync(pin, chats[i].pinHash)
            // comparing if pin user sent it = hashed versions of pins in our DB
            // 1st argument, pin user sent it, 2nd argument, pinned hash in DB
            if (existingPin) {
                chats[i].messages.push(message)
                // Push the new message onto the messages property of chats[i] within chats array. Each object has a pin and messages keys. 
                let securedMessage = {...chats[i]}
                // copy of that chat message, containing the hash
                delete securedMessage.pinHash
                // Deleting that hash off of our message before sending it back to frontend
                res.status(200).send(securedMessage)
                return
                // This bumps us out of the FUNCTION! Very important, otherwise it will run let chatObj and create a duplicate!!!
                // Pulling out each chat message in our array, then checking its pin to the pin the frontend supplied            
            }
        }
        const salt = bcrypt.genSaltSync()
        // generates a random string pattern, we're making a salt here
        const pinHash = bcrypt.hashSync(pin, salt)
        // hashSync has 2 parameters (thing we want to hash (the pin), and the salt)

        // Hash my password before I send it to the database. 
        // Get pin from user, hash it, then send it to database. 
        // After for loop but BEFORE we make the new object in chats array

        let chatObj = {
            pinHash, 
            messages: [message]
        }
        chats.push(chatObj)
        // Pushing the new chatObj (since pin didn't match existing objects in our array) into our array of chats / DB.
        let securedMessage = {...chatObj}
        delete securedMessage.pinHash
        res.status(200).send(securedMessage)
        // we want to only send the frontend the messages with the same pin, not ALL the messages like we were doing before. 
        console.log(chats)
        // This will console.log if there's a new object, 
    }
}
