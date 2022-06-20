module.exports.createError = (status, message) => {
    const err = new Error()
    err.status = status
    err.message = message
    return err
}

module.exports.displayError = (app) => {
    app.use((err, req, res, next) => {
        const errorsStatus = err.status || 500
        const errorMessage = err.message || 'Something went wrong'
        return res.status(errorsStatus).json({
            success: false,
            status: errorsStatus,
            message: errorMessage,
            stack: err.stack
        })
    })
}