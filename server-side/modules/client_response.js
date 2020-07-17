var success = true;
var error = false;
var message = "";
var data = [];

module.exports = {
    setResponse: (success, error, message, data) => {
        this.success = success;
        this.error = error;
        this.message = message;
        this.data = data;
    },
    getData: () => {
        return {
            success: this.success,
            error: this.error,
            message: this.message,
            data: this.data
        }
    },
    clear: () => {
        this.success = true;
        this.error = false;
        this.message = "";
        this.data = [];
    }
}