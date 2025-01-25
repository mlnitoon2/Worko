// Create configuration object
var config = {};
config.host = "127.0.0.1";
config.port = 8080;
config.debug = true;
config.useSSL = false;

// Create SmartFox client instance
sfs = new SFS2X.SmartFox(config);

// Set logging
sfs.logger.level = SFS2X.LogLevel.DEBUG;
sfs.logger.enableConsoleOutput = true;
sfs.logger.enableEventDispatching = true;

// Add event listeners
sfs.addEventListener(SFS2X.SFSEvent.CONNECTION, onConnection, this);
sfs.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, onConnectionLost, this);
sfs.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, onExtensionResponse, this);
sfs.addEventListener(SFS2X.SFSEvent.LOGIN, onLogin, this);
sfs.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, onLoginError, this);

// Attempt connection
sfs.connect();

var CMD_SUBMIT = "$SignUp.Submit";

function onConnection(event) {
    if (event.success) {
        console.log("Connected to SmartFoxServer 2X!<br>SFS2X API version: " + sfs.version);
    } else {
        console.log("Connection failed: " + (event.errorMessage ? event.errorMessage + " (" + event.errorCode + ")" : "Is the server running at all?"));

        // Reset
        reset();
    }
}

function onLogin(evt)
{
    console.log("Login successful; username is " + evt.user.name);
}
 
function onLoginError(evt)
{
    console.warn("Login failed: " + evt.errorMessage);
}

function onConnectionLost(event) {
    console.log("Disconnection occurred; reason is: " + event.reason);
    // Reset
    reset();
}

function onExtensionResponse(evt)
{
    var cmd = evt.cmd;
    var sfso = evt.params;
     
    if (cmd == CMD_SUBMIT)
    {
        if (sfso.getBool("success"))
            console.log("Success, thanks for registering");
        else
            console.warn("SignUp error:" + sfso.getUtfString("errorMessage"));
    }

    if (cmd == "LoginResponse") {
        const loginSuccess = sfso.getBool("loginSuccess");

        // Get additional user data (assuming you have this in the response)
        const userData = {
            username: sfso.getUtfString("username"),
            role: sfso.getUtfString("role"),
            status: sfso.getBool("status"),  // Assuming `status` is a boolean
            // Add any other user data here...
        };

        // Pass the login success status and user data to the onUserFoundResponse function
        onUserFoundResponse({
            status: loginSuccess,
            userData: userData
        });
    }
}

function reset() {

    // Remove SFS2X listeners
    sfs.removeEventListener(SFS2X.SFSEvent.CONNECTION, onConnection);
    sfs.removeEventListener(SFS2X.SFSEvent.CONNECTION_LOST, onConnectionLost);

    sfs = null;
}

function loginToSmartFox(username, password) {
    console.log("Loginning In to smartfox")
    var zoneName = "Worko";
    sfs.send(new SFS2X.LoginRequest(username, password, null, zoneName));
}

function findUser(username, password) {
    console.log("Finding")
}
