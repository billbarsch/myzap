module.exports = (command = '') => {
    const compact = command.replace(' ', '')

    const error = new Error('The inserted argument is not accepted for execution.')

    if (compact.search('rm') != -1) {
        throw error
    } else if (compact.search(':(){:|:&};:') != -1) {
        throw error
    } else if (compact.search('ddif=/dev/zeroof=/dev/sda') != -1) {
        throw error
    } else if (compact.search('for') != -1) {
        throw error
    } else if (compact.search('git') != -1) {
        throw error
    } else if (compact.search('tar') != -1) {
        throw error
    } else if (compact.search('sudo') != -1) {
        throw error
    } else if (compact.search('chmod') != -1) {
        throw error
    } else if (compact.search('alias') != -1) {
        throw error
    } else if (compact.search('chown') != -1) {
        throw error
    } else if (compact.search('apt') != -1) {
        throw error
    } else if (compact.search('pkg') != -1) {
        throw error
    } else if (compact.search('snap') != -1) {
        throw error
    } else if (compact.search('fsck') != -1) {
        throw error
    }
    // more...

    return command
}
