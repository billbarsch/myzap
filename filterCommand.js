module.exports = (command = '') => {
    const compact = command.replace(' ', '')

    const error = new Error('The inserted argument is not accepted for execution.')

    if (compact.search('rm') != -1) {
        throw error
    } else if (compact.search(':(){:|:&};:')) {
        throw error
    } else if (compact.search('ddif=/dev/zeroof=/dev/sda')) {
        throw error
    } else if (compact.search('for')) {
        throw error
    } else if (compact.search('git')) {
        throw error
    } else if (compact.search('tar')) {
        throw error
    } else if (compact.search('sudo')) {
        throw error
    } else if (compact.search('chmod')) {
        throw error
    } else if (compact.search('alias')) {
        throw error
    } else if (compact.search('chown')) {
        throw error
    } else if (compact.search('apt')) {
        throw error
    } else if (compact.search('pkg')) {
        throw error
    } else if (compact.search('snap')) {
        throw error
    } else if (compact.search('fsck')) {
        throw error
    }
    // more...

    return command
}