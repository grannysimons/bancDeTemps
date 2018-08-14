function flaix(){
    this.messages = {
        'info': '',
        'error': '',
        'warning': ''
    },
    this.session = undefined;
}

flaix.prototype.setSession(session)
{
    this.session = session;
}
flaix.prototype.setMessage(key, message)
{
    this.messages.key = message;
}

flaix.prototype.getMessage(key)
{
    return this.messages.key;
}

const flaix = flaix();
module.exports = flaix;